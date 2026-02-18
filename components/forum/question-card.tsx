"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronUp, ChevronDown, MessageSquare, Eye, Clock, CheckCircle } from "lucide-react"
import type { Question } from "@/lib/forum-store"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface QuestionCardProps {
  question: Question
  onVote?: (questionId: string, value: 1 | -1) => void
  userVote?: 1 | -1 | null
}

export function QuestionCard({ question, onVote, userVote }: QuestionCardProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800"
      case "volunteer":
        return "bg-green-100 text-green-800"
      case "teacher":
        return "bg-purple-100 text-purple-800"
      case "admin":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800"
      case "answered":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link href={`/forum/${question.id}`} className="hover:underline">
              <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">{question.title}</h3>
            </Link>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{question.content}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVote?.(question.id, 1)}
              className={`p-1 h-8 w-8 ${userVote === 1 ? "text-green-600" : ""}`}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <span className="font-medium text-sm">{question.votes}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVote?.(question.id, -1)}
              className={`p-1 h-8 w-8 ${userVote === -1 ? "text-red-600" : ""}`}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {question.authorName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span>{question.authorName}</span>
              <Badge className={`text-xs ${getRoleBadgeColor(question.authorRole)}`}>{question.authorRole}</Badge>
            </div>
            <Badge className={getStatusColor(question.status)}>
              {question.status === "answered" && question.acceptedAnswerId && <CheckCircle className="h-3 w-3 mr-1" />}
              {question.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{question.answers.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{question.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(question.createdAt, { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
