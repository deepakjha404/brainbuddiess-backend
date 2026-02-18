"use client";

import { useAuthStore } from "@/lib/auth-store";
import { Bell, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const ROLE_COLORS: Record<string, string> = {
  student: "#60a5fa",
  volunteer: "#7ee840",
  teacher: "#c084fc",
  admin: "#fb923c",
};

export function DashboardHeader() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      )
        setUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) return null;

  const roleColor = ROLE_COLORS[user.role] ?? "#00d4aa";
  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();
  const firstName = user.name.split(" ")[0];

  return (
    <header className="bb-dash-header">
      {/* Left */}
      <div className="bb-dash-header-left">
        <span className="bb-dash-welcome">
          gm, <span style={{ color: "#e2eaf4" }}>{firstName}</span>
        </span>
        <div
          className="bb-dash-role-pill"
          style={{
            color: roleColor,
            borderColor: roleColor + "40",
            background: roleColor + "10",
          }}
        >
          {user.role}
        </div>
      </div>

      {/* Right */}
      <div className="bb-dash-header-right">
        {/* Points */}
        <div className="bb-dash-points">
          <span className="bb-dash-points-val">
            {(user.points ?? 0).toLocaleString()}
          </span>
          <span className="bb-dash-points-label">pts</span>
        </div>

        {/* Notifications */}
        <div className="bb-dash-icon-wrap" ref={notifRef}>
          <button
            className="bb-dash-icon-btn"
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="bb-dash-notif-dot" />
          </button>
          {notifOpen && (
            <div className="bb-dash-dropdown">
              <div className="bb-dash-dropdown-label">Notifications</div>
              <div className="bb-dash-dropdown-sep" />
              <div className="bb-dash-dropdown-empty">No new notifications</div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="bb-dash-icon-wrap" ref={userMenuRef}>
          <button
            className="bb-dash-user-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div
              className="bb-dash-avatar"
              style={{
                borderColor: roleColor + "55",
                background: roleColor + "15",
                color: roleColor,
              }}
            >
              {initials}
            </div>
            <div className="bb-dash-user-text">
              <span className="bb-dash-user-name">{firstName}</span>
            </div>
            <ChevronDown
              size={13}
              style={{
                color: "#4e6577",
                transform: userMenuOpen ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            />
          </button>
          {userMenuOpen && (
            <div className="bb-dash-dropdown bb-dash-dropdown-right">
              <div className="bb-dash-dropdown-label">
                <div
                  style={{
                    color: "#e2eaf4",
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    marginBottom: 2,
                  }}
                >
                  {user.name}
                </div>
                <div
                  style={{
                    color: "#4e6577",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                  }}
                >
                  {user.email}
                </div>
              </div>
              <div className="bb-dash-dropdown-sep" />
              <Link
                href="/profile"
                className="bb-dash-dropdown-item"
                onClick={() => setUserMenuOpen(false)}
              >
                <User size={13} /> Profile
              </Link>
              <Link
                href="/settings"
                className="bb-dash-dropdown-item"
                onClick={() => setUserMenuOpen(false)}
              >
                <Settings size={13} /> Settings
              </Link>
              <div className="bb-dash-dropdown-sep" />
              <button
                className="bb-dash-dropdown-item bb-dash-dropdown-danger"
                onClick={handleLogout}
              >
                <LogOut size={13} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
