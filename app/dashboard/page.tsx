import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { RoleSpecificContent } from "@/components/dashboard/role-specific-content"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your personalized learning hub</p>
        </div>
        <RoleSpecificContent />
      </div>
    </DashboardLayout>
  )
}
