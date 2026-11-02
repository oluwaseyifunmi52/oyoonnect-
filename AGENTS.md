# OyoConnect redesign rules

## Never do
- Never change API calls, hooks, auth, roles, permissions, validation, error handling, real-time or polling logic, or redirects.
- Never change payment, wallet, funding, withdrawal, balance, messaging, notification, job, application, request, service, profile, settings, account, password, deletion, upload, login, session or sign-out logic.
- Never touch the backend, the landing page or unrelated pages.
- Never add dependencies (lucide-react is allowed).
- Never merge, remove or rename a route. Never fork a page shared by several roles; render it inside each role's own layout.
- Never use sample data from design pictures. Never invent numbers, statuses, response times or payment provider names. Show only fields that exist in the real data. Hide sections that have no real data.
- Never store, log or print credentials. Never sign in with my real account. Never submit real test data (jobs, businesses, reports, requests, payments); check validation and error states instead.
- If public/images/oyo-hero.jpg is missing, tell me. Do not use another image.

## Design
- Page background #f3f6f4. Fixed forest-green sidebar (~250px), current page highlighted. White top bar: global search, notification bell with unread badge, user menu. Content sits beside the sidebar, never under it.
- Keep each role's existing sidebar items and order. Add none, remove none. Keep logout and switch-account actions. Provider order: Dashboard, My Profile, My Services, Service Requests, Work Opportunities.
- Cards: white, rounded-2xl, soft shadow. Primary button: #064e3b with white text. Secondary: outline. Small coloured tags. Right column ~300px on desktop, drops below the content on small screens.
- Hero (only where a page has one): rounded banner with /images/oyo-hero.jpg, dark-green gradient on the left, and the eyebrow, heading, description and white pill search bar INSIDE it over the photo, in one position:relative container.
- Forms: labels above inputs, rounded-xl inputs at least 44px tall, green focus ring, inline errors under fields, grouped in cards, primary Submit and outline Cancel, loading state on submit.
- Size every icon explicitly. Add loading skeletons, empty states and error states. Contrast at least 4.5:1. Visible focus states.

## Every page task
1. Report what you found first: route, page file, layout, data sources, roles, links pointing to it.
2. Reuse shared components. Create one only if it does not exist.
3. Change only the files needed.
4. Connect every button to its real action or route.
5. If a picture shows something the app does not have, leave it out and tell me.
6. If I gave no picture for a page, build it from this design and tell me.
7. After each phase run the TypeScript check and production build, fix errors you caused, and commit ("Phase N: ...").
8. Check 1440px, 768px and 390px: nothing overlaps or is clipped, existing actions still work, users without access are still blocked. If you cannot open a browser, say so and list what I should check.