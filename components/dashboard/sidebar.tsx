"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuthStore, type UserRole } from "@/lib/auth-store"
import {
  Brain, Home, BookOpen, Trophy, MessageCircle, FileText,
  Settings, HelpCircle, Video, Calendar, BarChart3, UserCheck,
  Shield, Menu, Shuffle, MessageSquare,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  roles: UserRole[]
  badge?: string
}

const navItems: NavItem[] = [
  { title: "Dashboard",         href: "/dashboard",       icon: Home,           roles: ["student","volunteer","teacher","admin"] },
  { title: "Coding Sessions",   href: "/learning-rooms",  icon: Video,          roles: ["student","volunteer","teacher"] },
  { title: "Coding Challenges", href: "/quizzes",         icon: Trophy,         roles: ["student","volunteer","teacher"] },
  { title: "CS Q&A Forum",      href: "/forum",           icon: MessageCircle,  roles: ["student","volunteer","teacher"] },
  { title: "Random Chat",       href: "/chat/random",     icon: Shuffle,        roles: ["student","volunteer"] },
  { title: "CS Library",        href: "/library",         icon: BookOpen,       roles: ["student","volunteer","teacher"] },
  { title: "Notes",             href: "/notes",           icon: FileText,       roles: ["student","teacher"] },
  { title: "Assignments",       href: "/assignments",     icon: Calendar,       roles: ["student","teacher"] },
  { title: "Chat Rooms",        href: "/chat/rooms",      icon: MessageSquare,  roles: ["student","volunteer","teacher"] },
  { title: "Analytics",         href: "/analytics",       icon: BarChart3,      roles: ["teacher","admin"] },
  { title: "User Management",   href: "/users",           icon: UserCheck,      roles: ["admin"] },
  { title: "Content Review",    href: "/content-review",  icon: Shield,         roles: ["admin"] },
  { title: "Feedback",          href: "/feedback",        icon: HelpCircle,     roles: ["admin"] },
  { title: "Settings",          href: "/settings",        icon: Settings,       roles: ["student","volunteer","teacher","admin"] },
]

const ROLE_COLORS: Record<string, string> = {
  student: "#60a5fa",
  volunteer: "#7ee840",
  teacher: "#c084fc",
  admin: "#fb923c",
}

export function Sidebar() {
  const { user } = useAuthStore()
  const pathname = usePathname()

  if (!user) return null

  const filtered = navItems.filter((i) => i.roles.includes(user.role))
  const roleColor = ROLE_COLORS[user.role] ?? "#00d4aa"
  const initials = user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()

  const SidebarContent = () => (
    <div className="bb-sidebar-shell">
      {/* Logo */}
      <div className="bb-sidebar-logo">
        <Link href="/dashboard" className="bb-sidebar-logo-link">
          <div className="bb-sidebar-logo-mark">
            <Brain size={15} />
          </div>
          <span className="bb-sidebar-logo-text">Brainbuddies</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="bb-sidebar-nav">
        {filtered.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className={`bb-nav-item ${active ? "bb-nav-item-active" : ""}`}>
              <Icon size={16} />
              <span className="bb-nav-item-label">{item.title}</span>
              {item.badge && <span className="bb-nav-badge">{item.badge}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="bb-sidebar-footer">
        <div className="bb-sidebar-avatar" style={{ borderColor: roleColor + "55", background: roleColor + "15" }}>
          <span style={{ color: roleColor }}>{initials}</span>
        </div>
        <div className="bb-sidebar-user-info">
          <div className="bb-sidebar-user-name">{user.name}</div>
          <div className="bb-sidebar-user-role" style={{ color: roleColor }}>
            {user.role} · {user.points ?? 0} pts
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <div className="bb-sidebar-desktop">
        <SidebarContent />
      </div>

      {/* Mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="bb-sidebar-mobile-trigger" aria-label="Open menu">
            <Menu size={20} />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-[#0e1117] border-[#232f3e]">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}