import { createContext, useContext, useEffect, useState } from 'react'
type Theme = 'light'|'dark'|'system'
const KEY='oyoconnect_theme'
const Ctx=createContext<{theme:Theme, resolved:'light'|'dark', setTheme:(t:Theme)=>void}|null>(null)
export function ThemeProvider({children}:{children:React.ReactNode}){
  const [theme,setTheme]=useState<Theme>(()=>(localStorage.getItem(KEY) as Theme)||'system')
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
    localStorage.setItem(KEY, theme)
    if(theme==='system'){
      mq.addEventListener('change', apply)
      return ()=>mq.removeEventListener('change', apply)
    }
  },[theme])
  return <Ctx.Provider value={{theme, resolved, setTheme}}>{children}</Ctx.Provider>
}
export function useTheme(){ const c=useContext(Ctx); if(!c) throw new Error('useTheme'); return c }
