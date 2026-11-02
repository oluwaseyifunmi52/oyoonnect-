import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Heart, Shield, Folder, Users, Briefcase } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'

export default function HeroInline() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)
  const closeSidebar = () => setSidebarOpen(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeSidebar])

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: 300,
      borderRadius: 16,
      overflow: "hidden",
      background: "#064e3b"
    }}>
      {/* 1. the picture fills the whole box */}
      <img
        src="/images/oyo-hero.jpg"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "right center"
        }}
      />

      {/* 2. dark green fade on the left so the text is readable */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(90deg, rgba(2,44,34,.97) 0%, rgba(6,78,59,.88) 38%, rgba(6,78,59,.3) 65%, rgba(6,78,59,0) 100%)"
      }} />

      {/* 3. text and search pinned ON the picture, vertically centred */}
      <div style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 32px",
        maxWidth: 620,
        color: "#fff",
        fontFamily: "Inter, Arial, sans-serif",
        textAlign: "left"
      }}>
        <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 600, letterSpacing: "0.14em" }}>📍 OYO STATE, NIGERIA</p>
        <h1 style={{ margin: "0 0 10px", fontSize: 40, lineHeight: 1.1, fontWeight: 800, maxWidth: 380, fontFamily: "inherit", position: "static" }}>
          Together for a better Oyo
        </h1>
        <p style={{ margin: "0 0 18px", fontSize: 15, maxWidth: 400, color: "rgba(255,255,255,.92)" }}>
          Discover local services, jobs, businesses and community updates near you.
        </p>

        <form style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#fff",
          borderRadius: 999,
          padding: "6px 6px 6px 16px",
          maxWidth: 560,
          boxShadow: "0 8px 24px rgba(0,0,0,.25)"
        }}>
          <input
            placeholder="Search for places, services, jobs, businesses..."
            style={{
              flex: 1,
              minWidth: 0,
              border: 0,
              outline: 0,
              background: "transparent",
              fontSize: 14,
              color: "#0f172a",
              padding: "10px 4px"
            }}
          />
          <select style={{
            border: 0,
            background: "transparent",
            fontSize: 14,
            color: "#334155"
          }}>
            <option>Oyo State</option>
          </select>
          <button type="submit"
            style={{
              border: 0,
              background: "#064e3b",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              padding: "11px 24px",
              borderRadius: 999,
              cursor: "pointer"
            }}>
            Search
          </button>
        </form>
      </div>
    </div>
  )
}