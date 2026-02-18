"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calendar, Clock, FileText, Upload, Download, Users, CheckCircle, AlertCircle } from "lucide-react"
import { useAssignmentStore } from "@/lib/assignment-store"
import { useAuthStore } from "@/lib/auth-store"
import { AuthGuard } from "@/components/auth/auth-guard"
import { formatDistanceToNow, format } from "date-fns"

export default function AssignmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const assignmentId = params.id as string

  const [submissionContent, setSubmissionContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [gradeInput, setGradeInput] = useState("")
  const [feedbackInput, setFeedbackInput] = useState("")
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null)

  const { getAssignment, getSubmission, getSubmissionsByAssignment, submitAssignment, gradeSubmission } =
    useAssignmentStore()
  const { user } = useAuthStore()

  const assignment = getAssignment(assignmentId)
  const userSubmission = user ? getSubmission(assignmentId, user.id) : undefined
  const allSubmissions = getSubmissionsByAssignment(assignmentId)

  if (!assignment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Assignment Not Found</h1>
          <Button onClick={() => router.push("/assignments")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </Button>
        </div>
      </div>
    )
  }

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !submissionContent.trim()) return

    setIsSubmitting(true)
    try {
      const submissionId = submitAssignment(assignmentId, submissionContent.trim(), [])
      if (submissionId) {
        setSubmissionContent("")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGradeSubmission = (submissionId: string) => {
    const grade = Number.parseInt(gradeInput)
    if (isNaN(grade) || grade < 0 || grade > assignment.maxPoints) return

    gradeSubmission(submissionId, grade, feedbackInput.trim() || undefined)
    setGradeInput("")
    setFeedbackInput("")
    setSelectedSubmissionId(null)
  }

  const getSubmissionStatusIcon = (status: string, isLate: boolean) => {
    if (isLate) return <AlertCircle className="h-4 w-4 text-orange-600" />

    switch (status) {
      case "submitted":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "graded":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const isOverdue = new Date() > assignment.dueDate
  const canSubmit = user?.role === "student" && !userSubmission && (assignment.allowLateSubmissions || !isOverdue)
  const canGrade = user && (user.role === "teacher" || user.role === "admin") && user.id === assignment.createdBy

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" onClick={() => router.push("/assignments")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assignments
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignment Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">{assignment.title}</h1>
                    <p className="text-muted-foreground mb-4">{assignment.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{assignment.type.replace("-", " ")}</Badge>
                      <Badge variant="secondary">{assignment.subject}</Badge>
                      <Badge
                        className={
                          assignment.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {assignment.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{assignment.maxPoints}</div>
                    <div className="text-sm text-muted-foreground">points</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3">Instructions</h3>
                  <div className="whitespace-pre-wrap text-sm">{assignment.instructions}</div>
                </div>

                {assignment.attachments.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Attachments</h4>
                    <div className="space-y-2">
                      {assignment.attachments.map((file) => (
                        <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Student Submission Form */}
            {canSubmit && (
              <Card>
                <CardHeader>
                  <CardTitle>Submit Assignment</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitAssignment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="submission">Your Submission</Label>
                      <Textarea
                        id="submission"
                        placeholder="Enter your submission content here..."
                        value={submissionContent}
                        onChange={(e) => setSubmissionContent(e.target.value)}
                        rows={8}
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Upload className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        File uploads will be available in the full implementation
                      </span>
                    </div>

                    {isOverdue && assignment.allowLateSubmissions && (
                      <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm text-orange-800">
                          This assignment is overdue. Late penalty: {assignment.latePenalty}% per day.
                        </span>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmitting || !submissionContent.trim()}>
                        {isSubmitting ? "Submitting..." : "Submit Assignment"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* User's Submission Status */}
            {userSubmission && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getSubmissionStatusIcon(userSubmission.status, userSubmission.isLate)}
                    Your Submission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Submitted {formatDistanceToNow(userSubmission.submittedAt, { addSuffix: true })}
                      </p>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="whitespace-pre-wrap">{userSubmission.content}</p>
                      </div>
                    </div>

                    {userSubmission.status === "graded" && (
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">Grade & Feedback</h4>
                          <div className="text-lg font-bold">
                            {userSubmission.grade}/{assignment.maxPoints}
                          </div>
                        </div>
                        {userSubmission.feedback && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="whitespace-pre-wrap">{userSubmission.feedback}</p>
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                          Graded by {userSubmission.gradedByName}{" "}
                          {userSubmission.gradedAt && formatDistanceToNow(userSubmission.gradedAt, { addSuffix: true })}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Teacher: All Submissions */}
            {canGrade && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Submissions ({allSubmissions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {allSubmissions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No submissions yet</p>
                  ) : (
                    <div className="space-y-4">
                      {allSubmissions.map((submission) => (
                        <div key={submission.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {submission.studentName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{submission.studentName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {getSubmissionStatusIcon(submission.status, submission.isLate)}
                                  <span className="ml-1">
                                    Submitted {formatDistanceToNow(submission.submittedAt, { addSuffix: true })}
                                  </span>
                                </p>
                              </div>
                            </div>
                            {submission.status === "graded" && (
                              <div className="text-right">
                                <div className="font-bold">
                                  {submission.grade}/{assignment.maxPoints}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {Math.round((submission.grade! / assignment.maxPoints) * 100)}%
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="p-3 bg-muted/50 rounded-lg mb-3">
                            <p className="whitespace-pre-wrap text-sm">{submission.content}</p>
                          </div>

                          {submission.status === "graded" ? (
                            submission.feedback && (
                              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm whitespace-pre-wrap">{submission.feedback}</p>
                              </div>
                            )
                          ) : (
                            <div className="space-y-3">
                              {selectedSubmissionId === submission.id ? (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <Label htmlFor="grade">Grade (out of {assignment.maxPoints})</Label>
                                      <Input
                                        id="grade"
                                        type="number"
                                        min="0"
                                        max={assignment.maxPoints}
                                        value={gradeInput}
                                        onChange={(e) => setGradeInput(e.target.value)}
                                        placeholder="Enter grade..."
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="feedback">Feedback (optional)</Label>
                                    <Textarea
                                      id="feedback"
                                      value={feedbackInput}
                                      onChange={(e) => setFeedbackInput(e.target.value)}
                                      placeholder="Provide feedback to the student..."
                                      rows={3}
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => handleGradeSubmission(submission.id)}
                                      disabled={!gradeInput || isNaN(Number.parseInt(gradeInput))}
                                    >
                                      Submit Grade
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedSubmissionId(null)
                                        setGradeInput("")
                                        setFeedbackInput("")
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <Button variant="outline" onClick={() => setSelectedSubmissionId(submission.id)}>
                                  Grade Submission
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Assignment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Assignment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Due Date</p>
                    <p className={`text-muted-foreground ${isOverdue ? "text-red-600 font-medium" : ""}`}>
                      {format(assignment.dueDate, "PPP 'at' p")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-muted-foreground">
                      {formatDistanceToNow(assignment.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {assignment.createdByName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Instructor</p>
                    <p className="text-muted-foreground">{assignment.createdByName}</p>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Late submissions:</span>
                    <span>{assignment.allowLateSubmissions ? "Allowed" : "Not allowed"}</span>
                  </div>
                  {assignment.allowLateSubmissions && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Late penalty:</span>
                      <span>{assignment.latePenalty}% per day</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submission Stats */}
            {canGrade && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Submission Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total submissions:</span>
                    <span className="font-medium">{allSubmissions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Graded:</span>
                    <span className="font-medium">{allSubmissions.filter((s) => s.status === "graded").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending:</span>
                    <span className="font-medium">{allSubmissions.filter((s) => s.status === "submitted").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Late submissions:</span>
                    <span className="font-medium">{allSubmissions.filter((s) => s.isLate).length}</span>
                  </div>
                  {allSubmissions.filter((s) => s.status === "graded").length > 0 && (
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Average grade:</span>
                        <span className="font-medium">
                          {Math.round(
                            allSubmissions.filter((s) => s.status === "graded").reduce((sum, s) => sum + s.grade!, 0) /
                              allSubmissions.filter((s) => s.status === "graded").length,
                          )}
                          /{assignment.maxPoints}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
