import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield } from "lucide-react"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="rounded-2xl border bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 p-6 md:p-8 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-2xl hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-xl">Account</CardTitle>
                <CardDescription>Update your basic account information</CardDescription>
              </div>
              <User className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Display name</Label>
                <Input id="name" placeholder="Your name" defaultValue="" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" defaultValue="" disabled />
                <p className="text-xs text-muted-foreground">Email changes are disabled in this demo.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto" disabled>Save changes</Button>
            </CardFooter>
          </Card>

          <Card className="rounded-2xl hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-xl">Notifications</CardTitle>
                <CardDescription>Choose what you want to be notified about</CardDescription>
              </div>
              <Bell className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mentions and replies</p>
                  <p className="text-sm text-muted-foreground">Get notified when someone mentions you or replies</p>
                </div>
                <Switch defaultChecked aria-label="Mentions and replies" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New answers on your questions</p>
                  <p className="text-sm text-muted-foreground">Stay updated when someone answers your question</p>
                </div>
                <Switch defaultChecked aria-label="New answers" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Product updates</p>
                  <p className="text-sm text-muted-foreground">Occasional announcements and tips</p>
                </div>
                <Switch aria-label="Product updates" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto" disabled>Save preferences</Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="rounded-2xl hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-xl">Privacy</CardTitle>
              <CardDescription>Control how your profile appears to others</CardDescription>
            </div>
            <Shield className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show profile publicly</p>
                <p className="text-sm text-muted-foreground">Your name and avatar may be visible to other users</p>
              </div>
              <Switch defaultChecked aria-label="Show profile publicly" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow direct messages</p>
                <p className="text-sm text-muted-foreground">Other users can message you directly</p>
              </div>
              <Switch aria-label="Allow direct messages" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="ml-auto" disabled>
              Reset to defaults
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}


