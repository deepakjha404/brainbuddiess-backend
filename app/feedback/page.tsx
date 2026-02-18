"use client"

import { useState, useEffect } from "react"
import { useFeedbackStore } from "@/lib/feedback-store"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Plus, Bug, Lightbulb, Settings, MessageCircle } from "lucide-react"

export default function FeedbackPage() {
  const { user } = useAuthStore()
  const {
    feedbacks,
    userFeedbacks,
    selectedType,
    selectedStatus,
    sortBy,
    submitFeedback,
    updateFeedbackStatus,
    getUserFeedbacks,
    setSelectedType,
    setSelectedStatus,
    setSortBy,
  } = useFeedbackStore()

  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [newFeedback, setNewFeedback] = useState({
    type: "general" as const,
    title: "",
    description: "",
    priority: "medium" as const,
  })

  useEffect(() => {
    if (user) {
      getUserFeedbacks(user.id)
    }
  }, [user, getUserFeedbacks])

  const handleSubmitFeedback = () => {
    if (!newFeedback.title.trim() || !newFeedback.description.trim() || !user) return

    submitFeedback({
      ...newFeedback,
      submittedBy: user.id,
    })

    setNewFeedback({
      type: "general",
      title: "",
      description: "",
      priority: "medium",
    })
    setIsSubmitDialogOpen(false)

    // Refresh user feedbacks
    getUserFeedbacks(user.id)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bug":
        return <Bug className="h-4 w-4" />
      case "feature":
        return <Lightbulb className="h-4 w-4" />
      case "improvement":
        return <Settings className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bug":
        return "bg-red-500"
      case "feature":
        return "bg-blue-500"
      case "improvement":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "in-review":
        return "bg-blue-500"
      case "resolved":
        return "bg-green-500"
      case "closed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesType = selectedType === "all" || feedback.type === selectedType
    const matchesStatus = selectedStatus === "all" || feedback.status === selectedStatus
    return matchesType && matchesStatus
  })

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Feedback & Support</h1>
          <p className="text-muted-foreground">Help us improve BrainBuddies by sharing your feedback</p>
        </div>

        <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Submit Feedback
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Feedback</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newFeedback.type}
                    onValueChange={(value: any) => setNewFeedback({ ...newFeedback, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">
                        <div className="flex items-center gap-2">
                          <Bug className="h-4 w-4" />
                          Bug Report
                        </div>
                      </SelectItem>
                      <SelectItem value="feature">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Feature Request
                        </div>
                      </SelectItem>
                      <SelectItem value="improvement">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Improvement
                        </div>
                      </SelectItem>
                      <SelectItem value="general">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          General Feedback
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newFeedback.priority}
                    onValueChange={(value: any) => setNewFeedback({ ...newFeedback, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newFeedback.title}
                  onChange={(e) => setNewFeedback({ ...newFeedback, title: e.target.value })}
                  placeholder="Brief description of your feedback..."
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newFeedback.description}
                  onChange={(e) => setNewFeedback({ ...newFeedback, description: e.target.value })}
                  placeholder="Provide detailed information about your feedback..."
                  rows={6}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitFeedback}>Submit Feedback</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="my-feedback" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-feedback">My Feedback</TabsTrigger>
          <TabsTrigger value="all-feedback">All Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="my-feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                My Submitted Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userFeedbacks.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Feedback Submitted</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't submitted any feedback yet. Help us improve by sharing your thoughts!
                  </p>
                  <Button onClick={() => setIsSubmitDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userFeedbacks.map((feedback) => (
                    <Card key={feedback.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(feedback.type)}
                            <h3 className="font-medium">{feedback.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getTypeColor(feedback.type)} text-white`}>{feedback.type}</Badge>
                            <Badge className={`${getStatusColor(feedback.status)} text-white`}>{feedback.status}</Badge>
                            <Badge className={`${getPriorityColor(feedback.priority)} text-white`}>
                              {feedback.priority}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{feedback.description}</p>

                        {feedback.adminResponse && (
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm font-medium mb-1">Admin Response:</p>
                            <p className="text-sm">{feedback.adminResponse}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                          <span>Submitted {feedback.submittedAt.toLocaleDateString()}</span>
                          <span>Updated {feedback.updatedAt.toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-feedback" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <Select value={selectedType || "all"} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="bug">Bug Reports</SelectItem>
                    <SelectItem value="feature">Feature Requests</SelectItem>
                    <SelectItem value="improvement">Improvements</SelectItem>
                    <SelectItem value="general">General Feedback</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus || "all"} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-review">In Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy || "date"} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Sort by Date</SelectItem>
                    <SelectItem value="priority">Sort by Priority</SelectItem>
                    <SelectItem value="status">Sort by Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Feedback List */}
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => (
              <Card key={feedback.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(feedback.type)}
                      <h3 className="font-medium">{feedback.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getTypeColor(feedback.type)} text-white`}>{feedback.type}</Badge>
                      <Badge className={`${getStatusColor(feedback.status)} text-white`}>{feedback.status}</Badge>
                      <Badge className={`${getPriorityColor(feedback.priority)} text-white`}>{feedback.priority}</Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{feedback.description}</p>

                  {feedback.adminResponse && (
                    <div className="bg-muted p-3 rounded-lg mb-3">
                      <p className="text-sm font-medium mb-1">Admin Response:</p>
                      <p className="text-sm">{feedback.adminResponse}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Submitted {feedback.submittedAt.toLocaleDateString()}</span>
                    <span>Updated {feedback.updatedAt.toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFeedbacks.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Feedback Found</h3>
                <p className="text-muted-foreground">Try adjusting your filters to see more feedback.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
