'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Bot, Trophy, Book, Settings, User } from "lucide-react"
import Logo from "../container/landing-page/ui/logo"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
  { href: "/problems", label: "Problems", icon: <FileText size={18} /> },
  { href: "/hints", label: "AI Hints", icon: <Bot size={18} /> },
  { href: "/leaderboard", label: "Leaderboard", icon: <Trophy size={18} /> },
  { href: "/learning", label: "Learning", icon: <Book size={18} /> },
  { href: "/profile", label: "Profile", icon: <User size={18} /> },
  { href: "/settings", label: "Settings", icon: <Settings size={18} /> },
]

export default function PlatformNav() {
  const pathname = usePathname()

  return (
    <aside className="h-screen w-[220px] bg-zinc-900 text-white flex flex-col justify-between border-r px-4 py-6">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Logo />
          <span className="text-lg font-bold">Zenith</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 transition 
                ${pathname === item.href ? "bg-zinc-800 font-semibold" : "text-zinc-300"}`}>
                {item.icon}
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      <div className="text-sm text-zinc-400 mt-8">
        <button className="w-full text-left hover:text-white" onClick={() => {/* logout logic */}}>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
