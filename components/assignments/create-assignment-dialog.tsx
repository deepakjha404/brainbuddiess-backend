"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { type AssignmentType, useAssignmentStore } from "@/lib/assignment-store"
import { useAuthStore } from "@/lib/auth-store"

interface CreateAssignmentDialogProps {
  children: React.ReactNode
}

const assignmentTypes: AssignmentType[] = ["essay", "problem-set", "project", "quiz", "presentation", "other"]

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Literature",
  "History",
  "Computer Science",
  "Philosophy",
  "Art",
  "Other",
]

export function CreateAssignmentDialog({ children }: CreateAssignmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<AssignmentType>("essay")
  const [subject, setSubject] = useState("Mathematics")
  const [instructions, setInstructions] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [maxPoints, setMaxPoints] = useState(100)
  const [allowLateSubmissions, setAllowLateSubmissions] = useState(true)
  const [latePenalty, setLatePenalty] = useState(10)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { createAssignment } = useAssignmentStore()
  const { user } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title.trim() || !description.trim() || !dueDate) return

    setIsSubmitting(true)

    try {
      const assignmentId = createAssignment({
        title: title.trim(),
        description: description.trim(),
        type,
        subject,
        instructions: instructions.trim(),
        dueDate: new Date(dueDate),
        maxPoints,
        status: "published",
        attachments: [],
        allowLateSubmissions,
        latePenalty,
      })

      if (assignmentId) {
        // Reset form
        setTitle("")
        setDescription("")
        setType("essay")
        setSubject("Mathematics")
        setInstructions("")
        setDueDate("")
        setMaxPoints(100)
        setAllowLateSubmissions(true)
        setLatePenalty(10)
        setOpen(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title</Label>
              <Input
                id="title"
                placeholder="Enter assignment title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Assignment Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as AssignmentType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assignmentTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1).replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the assignment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPoints">Maximum Points</Label>
              <Input
                id="maxPoints"
                type="number"
                min="1"
                max="1000"
                value={maxPoints}
                onChange={(e) => setMaxPoints(Number.parseInt(e.target.value) || 100)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Detailed Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="Provide detailed instructions for students..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              min={today}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowLate">Allow Late Submissions</Label>
                <p className="text-sm text-muted-foreground">Students can submit after the due date</p>
              </div>
              <Switch id="allowLate" checked={allowLateSubmissions} onCheckedChange={setAllowLateSubmissions} />
            </div>

            {allowLateSubmissions && (
              <div className="space-y-2">
                <Label htmlFor="latePenalty">Late Penalty (% per day)</Label>
                <Input
                  id="latePenalty"
                  type="number"
                  min="0"
                  max="100"
                  value={latePenalty}
                  onChange={(e) => setLatePenalty(Number.parseInt(e.target.value) || 0)}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim() || !description.trim() || !dueDate}>
              {isSubmitting ? "Creating..." : "Create Assignment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
