import { createContext, useContext, useEffect, useState } from 'react'
type Theme = 'light'|'dark'|'system'
const KEY='oyoconnect.theme'
const Ctx=createContext<{theme:Theme, resolved:'light'|'dark', setTheme:(t:Theme)=>void}|null>(null)
function isValidTheme(t: string): t is Theme {
  return t === 'light' || t === 'dark' || t === 'system'
}
export function ThemeProvider({children}:{children:React.ReactNode}){
  const saved = localStorage.getItem(KEY)
  const [theme,setTheme]=useState<Theme>(()=>{
    if(saved && isValidTheme(saved)) return saved as Theme
    return 'light'
  })
  const [resolved,setResolved]=useState<'light'|'dark'>('light')
  useEffect(()=>{
    const mq=window.matchMedia('(prefers-color-scheme: dark)')
    const compute=()=> theme==='system' ? (mq.matches?'dark':'light') : theme as 'light'|'dark'
    const apply=()=>{
      const r=compute()
      setResolved(r)
      document.documentElement.setAttribute('data-theme', r)
      if(r==='dark') document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    }
    apply()
    const themeToSave = theme === 'system' ? 'light' : theme
    localStorage.setItem(KEY, themeToSave)
    if(theme==='system'){
      mq.addEventListener('change', apply)
      return ()=>mq.removeEventListener('change', apply)
    }
  },[theme])
  return <Ctx.Provider value={{theme, resolved, setTheme}}>{children}</Ctx.Provider>
}
export function useTheme(){ const c=useContext(Ctx); if(!c) throw new Error('useTheme'); return c }
