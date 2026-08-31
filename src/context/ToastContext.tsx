import { createContext, useContext, useState, useCallback } from 'react'
type ToastType='success'|'error'|'warning'|'info'
type Toast={id:string, type:ToastType, message:string}
const Ctx=createContext<{toasts:Toast[], show:(t:ToastType,m:string)=>void}|null>(null)
export function ToastProvider({children}:{children:React.ReactNode}){
  const [toasts,setToasts]=useState<Toast[]>([])
  const show=useCallback((type:ToastType, message:string)=>{
    const id=crypto.randomUUID()
    setToasts(s=>[...s,{id,type,message}])
    setTimeout(()=>setToasts(s=>s.filter(t=>t.id!==id)),4000)
  },[])
  return <Ctx.Provider value={{toasts, show}}>{children}
    <div style={{position:'fixed', bottom:16, right:16, display:'flex', flexDirection:'column', gap:8, zIndex:9999}}>
      {toasts.map(t=>(
        <div key={t.id} role="alert" style={{background: t.type==='success'?'var(--success)': t.type==='error'?'var(--error)': t.type==='warning'?'var(--warning)':'var(--ink)', color:'#fff', padding:'12px 16px', borderRadius:'8px', minWidth:'280px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'var(--shadow-lg)', fontSize:'14px'}}>
          <span>{t.message}</span>
          <button onClick={()=>setToasts(s=>s.filter(x=>x.id!==t.id))} style={{background:'transparent', border:'none', color:'#fff', cursor:'pointer', marginLeft:12}}>✕</button>
        </div>
      ))}
    </div>
  </Ctx.Provider>
}
export function useToast(){ const c=useContext(Ctx); if(!c) throw new Error('useToast'); return c }
