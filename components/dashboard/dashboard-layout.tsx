"use client";

import type React from "react";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./header";
import { AuthGuard } from "@/components/auth/auth-guard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <div className="bb-dash-root">
        <Sidebar />
        <div className="bb-dash-main">
          <DashboardHeader />
          <main className="bb-dash-body">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
