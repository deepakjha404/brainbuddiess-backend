"use client";

import type React from "react";
import Link from "next/link";
import { useAuthStore, type UserRole } from "@/lib/auth-store";
import {
  BookOpen,
  Trophy,
  Users,
  Calendar,
  MessageCircle,
  BarChart3,
  UserCheck,
  Shield,
  Video,
  FileText,
  Star,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

interface DashboardStat {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  trend?: string;
}

const roleSpecificStats: Record<UserRole, DashboardStat[]> = {
  student: [
    {
      title: "Algorithms Learned",
      value: "12",
      description: "Data structures mastered",
      icon: BookOpen,
      trend: "+3 this month",
    },
    {
      title: "Coding Score",
      value: "87%",
      description: "Problem solving accuracy",
      icon: Trophy,
      trend: "+5% improvement",
    },
    {
      title: "Coding Hours",
      value: "24h",
      description: "This week",
      icon: Clock,
      trend: "+3h from last week",
    },
    {
      title: "Rank",
      value: "#12",
      description: "In competitive programming",
      icon: Star,
      trend: "↑3 positions",
    },
  ],
  volunteer: [
    {
      title: "Questions Answered",
      value: "156",
      description: "Algorithm problems solved",
      icon: MessageCircle,
      trend: "+12 this week",
    },
    {
      title: "Helpful Votes",
      value: "89%",
      description: "Solution approval rate",
      icon: Trophy,
      trend: "+2% this month",
    },
    {
      title: "Students Helped",
      value: "43",
      description: "Unique coders",
      icon: Users,
      trend: "+8 this month",
    },
    {
      title: "Mentoring Hours",
      value: "32h",
      description: "This month",
      icon: Clock,
      trend: "+5h from last month",
    },
  ],
  teacher: [
    {
      title: "Active Students",
      value: "127",
      description: "Across all CS classes",
      icon: Users,
      trend: "+15 this semester",
    },
    {
      title: "Assignments",
      value: "23",
      description: "This semester",
      icon: FileText,
      trend: "+3 this month",
    },
    {
      title: "Average Grade",
      value: "82%",
      description: "Algorithm performance",
      icon: BarChart3,
      trend: "+4% improvement",
    },
    {
      title: "Coding Sessions",
      value: "8",
      description: "Active sessions",
      icon: Video,
      trend: "+2 this week",
    },
  ],
  admin: [
    {
      title: "Total Users",
      value: "2,847",
      description: "Platform members",
      icon: UserCheck,
      trend: "+127 this month",
    },
    {
      title: "Content Reviews",
      value: "45",
      description: "Pending approval",
      icon: Shield,
      trend: "-8 from yesterday",
    },
    {
      title: "System Health",
      value: "99.8%",
      description: "Uptime this month",
      icon: TrendingUp,
      trend: "Excellent",
    },
    {
      title: "Support Tickets",
      value: "12",
      description: "Open tickets",
      icon: MessageCircle,
      trend: "-3 resolved today",
    },
  ],
};

const roleSpecificActions: Record<
  UserRole,
  Array<{
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ size?: number }>;
  }>
> = {
  student: [
    {
      title: "Join Coding Session",
      description: "Collaborate with peers in real-time",
      href: "/learning-rooms",
      icon: Video,
    },
    {
      title: "Solve Problems",
      description: "Practice algorithms and earn points",
      href: "/quizzes",
      icon: Trophy,
    },
    {
      title: "Browse CS Library",
      description: "Explore algorithms and data structures",
      href: "/library",
      icon: BookOpen,
    },
  ],
  volunteer: [
    {
      title: "Answer Questions",
      description: "Help students with algorithms and code",
      href: "/forum",
      icon: MessageCircle,
    },
    {
      title: "Join Coding Session",
      description: "Mentor students in programming sessions",
      href: "/learning-rooms",
      icon: Video,
    },
    {
      title: "Random Chat",
      description: "Connect with students who need help",
      href: "/chat/random",
      icon: Users,
    },
  ],
  teacher: [
    {
      title: "Create Assignment",
      description: "Design new algorithm problems",
      href: "/assignments",
      icon: Calendar,
    },
    {
      title: "Start Session",
      description: "Host a live programming session",
      href: "/learning-rooms",
      icon: Video,
    },
    {
      title: "Review Submissions",
      description: "Grade student algorithm solutions",
      href: "/assignments",
      icon: FileText,
    },
  ],
  admin: [
    {
      title: "Review Content",
      description: "Moderate user-generated content",
      href: "/content-review",
      icon: Shield,
    },
    {
      title: "Manage Users",
      description: "Oversee platform members",
      href: "/users",
      icon: UserCheck,
    },
    {
      title: "View Analytics",
      description: "Monitor platform performance",
      href: "/analytics",
      icon: BarChart3,
    },
  ],
};

const ROLE_COLORS: Record<string, string> = {
  student: "#60a5fa",
  volunteer: "#7ee840",
  teacher: "#c084fc",
  admin: "#fb923c",
};

const PROGRESS_ITEMS = [
  { label: "Data Structures", value: 75 },
  { label: "Algorithms", value: 60 },
  { label: "Competitive Programming", value: 90 },
];

const RECENT_ACTIVITY: Record<
  UserRole,
  Array<{
    icon: React.ComponentType<{ size?: number }>;
    iconColor: string;
    text: string;
    time: string;
    badge?: string;
  }>
> = {
  student: [
    {
      icon: Trophy,
      iconColor: "#fbbf24",
      text: 'Solved "Dynamic Programming" problem',
      time: "2 hours ago",
      badge: "+15 pts",
    },
    {
      icon: Video,
      iconColor: "#60a5fa",
      text: 'Joined "Algorithm Study Group"',
      time: "1 day ago",
    },
  ],
  volunteer: [
    {
      icon: MessageCircle,
      iconColor: "#7ee840",
      text: "Answered question about binary search",
      time: "1 hour ago",
      badge: "+5 pts",
    },
    {
      icon: Users,
      iconColor: "#c084fc",
      text: "Helped 3 students with coding problems",
      time: "3 hours ago",
    },
  ],
  teacher: [
    {
      icon: Calendar,
      iconColor: "#fb923c",
      text: 'Created assignment "Graph Algorithms"',
      time: "2 hours ago",
    },
    {
      icon: Video,
      iconColor: "#60a5fa",
      text: 'Hosted "Data Structures Review Session"',
      time: "1 day ago",
    },
  ],
  admin: [
    {
      icon: Shield,
      iconColor: "#f87171",
      text: "Reviewed and approved 8 content submissions",
      time: "1 hour ago",
    },
    {
      icon: UserCheck,
      iconColor: "#7ee840",
      text: "Processed 15 new user registrations",
      time: "3 hours ago",
    },
  ],
};

export function RoleSpecificContent() {
  const { user } = useAuthStore();
  if (!user) return null;

  const stats = roleSpecificStats[user.role];
  const actions = roleSpecificActions[user.role];
  const activity = RECENT_ACTIVITY[user.role];
  const roleColor = ROLE_COLORS[user.role] ?? "#00d4aa";

  return (
    <div className="bb-dash-content">
      {/* ── Stats ── */}
      <div className="bb-dash-stats-grid">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bb-stat-card">
              <div className="bb-stat-card-top">
                <span className="bb-stat-card-title">{stat.title}</span>
                <div className="bb-stat-card-icon">
                  <Icon size={14} />
                </div>
              </div>
              <div className="bb-stat-card-val">{stat.value}</div>
              <div className="bb-stat-card-desc">{stat.description}</div>
              {stat.trend && (
                <div
                  className="bb-stat-card-trend"
                  style={{ color: roleColor }}
                >
                  {stat.trend}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Quick Actions ── */}
      <div className="bb-dash-section">
        <div className="bb-dash-section-head">
          <span className="bb-dash-section-label">Quick actions</span>
        </div>
        <div className="bb-actions-grid">
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                href={action.href}
                className="bb-action-card"
                style={{ "--role-color": roleColor } as React.CSSProperties}
              >
                <div
                  className="bb-action-icon"
                  style={{
                    background: roleColor + "12",
                    borderColor: roleColor + "30",
                  }}
                >
                  <Icon size={18} />
                </div>
                <div className="bb-action-title">{action.title}</div>
                <div className="bb-action-desc">{action.description}</div>
                <div className="bb-action-cta" style={{ color: roleColor }}>
                  Get started <ArrowRight size={12} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Progress (student only) ── */}
      {user.role === "student" && (
        <div className="bb-dash-section">
          <div className="bb-dash-section-head">
            <span className="bb-dash-section-label">CS Learning Progress</span>
          </div>
          <div className="bb-progress-card">
            {PROGRESS_ITEMS.map((item) => (
              <div key={item.label} className="bb-progress-row">
                <div className="bb-progress-meta">
                  <span className="bb-progress-label">{item.label}</span>
                  <span
                    className="bb-progress-pct"
                    style={{ color: roleColor }}
                  >
                    {item.value}%
                  </span>
                </div>
                <div className="bb-progress-track">
                  <div
                    className="bb-progress-fill"
                    style={{ width: `${item.value}%`, background: roleColor }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recent Activity ── */}
      <div className="bb-dash-section">
        <div className="bb-dash-section-head">
          <span className="bb-dash-section-label">Recent activity</span>
        </div>
        <div className="bb-activity-card">
          {activity.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bb-activity-row">
                <div
                  className="bb-activity-icon-wrap"
                  style={{
                    background: item.iconColor + "12",
                    borderColor: item.iconColor + "25",
                  }}
                >
                  <Icon size={13} />
                </div>
                <div className="bb-activity-body">
                  <div className="bb-activity-text">{item.text}</div>
                  <div className="bb-activity-time">{item.time}</div>
                </div>
                {item.badge && (
                  <div
                    className="bb-activity-badge"
                    style={{
                      color: roleColor,
                      borderColor: roleColor + "35",
                      background: roleColor + "10",
                    }}
                  >
                    {item.badge}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
