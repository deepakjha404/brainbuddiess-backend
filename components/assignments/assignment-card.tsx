"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, FileText, Users, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import type { Assignment } from "@/lib/assignment-store"
import { format } from "date-fns"
import Link from "next/link"
import { useAuthStore } from "@/lib/auth-store"

interface AssignmentCardProps {
  assignment: Assignment
  showSubmissionStatus?: boolean
}

export function AssignmentCard({ assignment, showSubmissionStatus = false }: AssignmentCardProps) {
  const { user } = useAuthStore()

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "essay":
        return "bg-purple-100 text-purple-800"
      case "problem-set":
        return "bg-blue-100 text-blue-800"
      case "project":
        return "bg-green-100 text-green-800"
      case "quiz":
        return "bg-orange-100 text-orange-800"
      case "presentation":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSubmissionStatus = () => {
    if (!user || user.role !== "student") return null
    const submission = assignment.submissions.find((s) => s.studentId === user.id)

    if (!submission) {
      const isOverdue = new Date() > assignment.dueDate
      return {
        status: isOverdue ? "overdue" : "pending",
        icon: isOverdue ? XCircle : Clock,
        color: isOverdue ? "text-red-600" : "text-yellow-600",
        text: isOverdue ? "Overdue" : "Not Submitted",
      }
    }

    switch (submission.status) {
      case "submitted":
        return {
          status: "submitted",
          icon: CheckCircle,
          color: "text-blue-600",
          text: "Submitted",
        }
      case "graded":
        return {
          status: "graded",
          icon: CheckCircle,
          color: "text-green-600",
          text: `Graded (${submission.grade}/${assignment.maxPoints})`,
        }
      case "late":
        return {
          status: "late",
          icon: AlertCircle,
          color: "text-orange-600",
          text: "Late Submission",
        }
      default:
        return null
    }
  }

  const submissionStatus = showSubmissionStatus ? getSubmissionStatus() : null
  const isOverdue = new Date() > assignment.dueDate
  const daysUntilDue = Math.ceil((assignment.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link href={`/assignments/${assignment.id}`} className="hover:underline">
              <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">{assignment.title}</h3>
            </Link>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{assignment.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={getTypeBadgeColor(assignment.type)}>{assignment.type}</Badge>
              <Badge variant="outline">{assignment.subject}</Badge>
              <Badge className={getStatusBadgeColor(assignment.status)}>{assignment.status}</Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{assignment.maxPoints} pts</div>
            {submissionStatus && (
              <div className={`flex items-center gap-1 text-xs mt-1 ${submissionStatus.color}`}>
                <submissionStatus.icon className="h-3 w-3" />
                <span>{submissionStatus.text}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {assignment.createdByName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span>{assignment.createdByName}</span>
            </div>
            {assignment.attachments.length > 0 && (
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>
                  {assignment.attachments.length} file{assignment.attachments.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {assignment.submissions.length} submission{assignment.submissions.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                Due {format(assignment.dueDate, "MMM d, yyyy")}
              </span>
            </div>
            {!isOverdue && daysUntilDue <= 7 && (
              <div className="flex items-center gap-1 text-orange-600">
                <Clock className="h-4 w-4" />
                <span className="font-medium">
                  {daysUntilDue === 0 ? "Due today" : `${daysUntilDue} day${daysUntilDue !== 1 ? "s" : ""} left`}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
