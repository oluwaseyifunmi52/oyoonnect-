import { spawn } from 'node:child_process'
import puppeteer from 'puppeteer-core'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const PORT = 8126
const BASE = `http://localhost:${PORT}`
const SCREENSHOTS = 'C:\\Users\\USER\\AppData\\Local\\Temp\\kilo'

function waitReady(url, attempts = 120) {
  return new Promise((resolve, reject) => {
    let i = 0
    const iv = setInterval(async () => {
      try {
        const res = await fetch(url)
        if (res.ok) { clearInterval(iv); resolve(true); return }
      } catch {}
      i++
      if (i >= attempts) { clearInterval(iv); reject(new Error('server not ready')) }
    }, 250)
  })
}

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host'], {
  env: process.env,
  shell: true,
  stdio: 'pipe',
})
server.stdout?.on('data', () => {})
server.stderr?.on('data', () => {})

const results = []
const pageErrors = []
const requestFailures = []
function check(name, cond, detail = '') {
  results.push({ name, pass: !!cond })
  console.log(`${cond ? 'PASS' : 'FAIL'} | ${name}${detail ? ' -> ' + detail : ''}`)
}

try {
  await waitReady(`${BASE}/jobs`)
  const browser = await puppeteer.launch({
    product: 'chrome',
    executablePath: EDGE,
    headless: true,
    args: ['--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars', '--window-size=1280,800'],
    ignoreHTTPSErrors: true,
  })

  const page = await browser.newPage()
  page.on('pageerror', (e) => pageErrors.push(String(e?.message || e)))
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const t = msg.text()
      if (!/ResizeObserver loop|interrupted connection|DevTools|crashed/i.test(t)) pageErrors.push('console:' + t)
    }
  })
  page.on('requestfailed', (req) => requestFailures.push('fail:' + (req.url() || '')))

  // ---------- DESKTOP ----------
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
  await page.goto(`${BASE}/jobs`, { waitUntil: 'networkidle0' })
  await page.waitForSelector('.jobs-hero__title', { timeout: 10000 }).catch(() => {})

  const heroTitle = await page.$eval('.jobs-hero__title', (el) => el.textContent?.trim()).catch(() => null)
  check('desktop: hero heading "Find Your Next Opportunity"', heroTitle === 'Find Your Next Opportunity', String(heroTitle))

  const heroEyebrow = await page.$eval('.jobs-hero__eyebrow', (el) => el.textContent?.trim()).catch(() => null)
  check('desktop: hero eyebrow "WORK & OPPORTUNITIES"', heroEyebrow === 'WORK & OPPORTUNITIES', String(heroEyebrow))

  const oppCards = await page.$$eval('.opportunity-card', (els) => els.length).catch(() => 0)
  check('desktop: 4 opportunity type cards', oppCards === 4, String(oppCards))

  const createPresent = await page.$eval('.create-opportunity-card .create-opportunity-card__title', (el) => el.textContent).catch(() => null)
  check('desktop: Create Opportunity card', createPresent === 'Create Opportunity', String(createPresent))

  const featuredEmpty = await page.$eval('.jobs-featured-card .empty-state__title', (el) => el.textContent?.trim()).catch(() => null)
  check('desktop: featured professional empty state', featuredEmpty === 'No featured jobs at the moment.', String(featuredEmpty))

  const featuredBtn = await page.$eval('.jobs-featured-card .empty-state__action .btn', (el) => el.textContent?.trim()).catch(() => null)
  check('desktop: featured "Post the First Job" button', featuredBtn === 'Post the First Job', String(featuredBtn))

  const searchFields = await page.$$eval('.jobs-search-row .input-wrapper', (els) => els.length).catch(() => 0)
  check('desktop: browse search row has 2 inputs', searchFields === 2, String(searchFields))

  const pills = await page.$$eval('.job-filter-pills .job-filter-pill', (els) => els.map((e) => e.textContent?.trim())).catch(() => [])
  check('desktop: 6 filter pills', pills.length === 6, JSON.stringify(pills))

  const activePill = await page.$eval('.job-filter-pill--active', (el) => el.textContent?.trim()).catch(() => null)
  check('desktop: "All Categories" pill active by default', activePill === 'All Categories', String(activePill))

  const catCards = await page.$$eval('.job-category-card', (els) => els.length).catch(() => 0)
  check('desktop: 8 category cards', catCards === 8, String(catCards))

  const browseEmpty = await page.$eval('.jobs-browse-card .empty-state__title', (el) => el.textContent?.trim()).catch(() => null)
  check('desktop: browse empty state "No jobs posted yet"', browseEmpty === 'No jobs posted yet', String(browseEmpty))

  const noOverlap = await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('.job-filter-pill'))
    if (!pills.length) return true
    const r = pills[0].getBoundingClientRect()
    return r.width > 0 && r.height > 0
  })
  check('desktop: pills not collapsed/overlapping', noOverlap === true, '')

  const bannerTitle = await page.$eval('.jobs-notification-banner .jobs-notification-banner__title', (el) => el.textContent?.trim()).catch(() => null)
  check('desktop: notification banner', bannerTitle === 'Never Miss an Opportunity', String(bannerTitle))

  const scrollable = await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight)
    return window.scrollY > 100
  })
  check('desktop: page is scrollable', scrollable === true, '')

  const centerTag = await page.evaluate(() => {
    const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
    return el ? el.tagName : null
  })
  check('desktop: center not a blocking overlay', centerTag && centerTag !== 'HTML', String(centerTag))

  await page.screenshot({ path: `${SCREENSHOTS}/probe-jobs-desktop.png`, fullPage: true }).catch(() => {})

  // interaction: internship pill filters URL
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('.job-filter-pill')).find((p) => p.textContent?.trim() === 'Internship')
    if (el) el.click()
  })
  await page.waitForURL((u) => u.searchParams.has('employmentType'), { timeout: 6000 }).catch(() => {})
  check('desktop: internship pill sets employmentType=internship', new URL(page.url()).searchParams.get('employmentType') === 'internship', new URL(page.url()).searchParams.get('employmentType'))

  // interaction: category card link
  const catHref = await page.$eval('.job-category-card', (el) => el.getAttribute('href') ?? '').catch(() => '')
  check('desktop: category card links to /jobs?category=', catHref.includes('category='), catHref)

  // ---------- MOBILE ----------
  await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2 })
  await page.goto(`${BASE}/jobs`, { waitUntil: 'networkidle0' })
  await page.waitForSelector('.jobs-hero__title', { timeout: 10000 }).catch(() => {})
  const mobileNoOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= 376)
  check('mobile: no horizontal overflow', mobileNoOverflow === true, String(mobileNoOverflow))
  const mobileOpp = await page.$$eval('.opportunity-card', (els) => els.length).catch(() => 0)
  check('mobile: 4 opportunity cards still present', mobileOpp === 4, String(mobileOpp))
  const mobilePills = await page.$$eval('.job-filter-pill', (els) => els.length).catch(() => 0)
  check('mobile: 6 filter pills present (wrap ok)', mobilePills === 6, String(mobilePills))
  await page.screenshot({ path: `${SCREENSHOTS}/probe-jobs-mobile.png`, fullPage: true }).catch(() => {})

  await browser.close().catch(() => {})
} catch (e) {
  check('setup/launch', false, String(e))
} finally {
  server.kill('SIGTERM')
  try { await server.waitUntilExit?.() } catch {}
}

check('no page/console errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '))
check('no request failures', requestFailures.length === 0, requestFailures.slice(0, 3).join(' | '))

const total = results.length
const passed = results.filter((r) => r.pass).length
console.log(`\nRESULT: ${passed}/${total} checks passed`)
if (passed < total) process.exitCode = 1
