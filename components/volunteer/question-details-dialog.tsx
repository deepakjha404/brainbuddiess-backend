"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ThumbsUp, ThumbsDown, Award, Clock, Send, Loader2 } from "lucide-react"
import type { Question } from "@/lib/volunteer-store"
import { useVolunteerStore } from "@/lib/volunteer-store"
import { useAuthStore } from "@/lib/auth-store"
import { formatDistanceToNow } from "date-fns"

interface QuestionDetailsDialogProps {
  question: Question
  open: boolean
  onClose: () => void
}

export function QuestionDetailsDialog({ question, open, onClose }: QuestionDetailsDialogProps) {
  const { user } = useAuthStore()
  const { submitAnswer } = useVolunteerStore()
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return

    setIsSubmitting(true)
    const success = await submitAnswer(question.id, answer)
    if (success) {
      setAnswer("")
      onClose()
    }
    setIsSubmitting(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{question.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Question Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">{question.subject}</Badge>
              <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                <Award className="w-3 h-3 mr-1" />
                {question.points} points
              </Badge>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{question.description}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={question.askedBy.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">
                    {question.askedBy.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span>Asked by {question.askedBy.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>

          <Separator />

          {/* Answers */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Answers ({question.answers.length})</h3>

            {question.answers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No answers yet. Be the first to help!</p>
            ) : (
              <div className="space-y-4">
                {question.answers.map((answer) => (
                  <div key={answer.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={answer.answeredBy.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-sm">
                            {answer.answeredBy.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{answer.answeredBy.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{answer.answeredBy.role}</p>
                        </div>
                        {answer.isAccepted && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <Award className="w-3 h-3 mr-1" />
                            Accepted
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{answer.content}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {answer.upvotes}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <ThumbsDown className="w-4 h-4" />
                        {answer.downvotes}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Answer Form */}
          {user?.role === "volunteer" || user?.role === "teacher" || user?.role === "admin" ? (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold">Your Answer</h3>
                <Textarea
                  placeholder="Write your answer here. Be detailed and helpful!"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={6}
                />
                <div className="flex justify-end">
                  <Button onClick={handleSubmitAnswer} disabled={!answer.trim() || isSubmitting}>
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Send className="w-4 h-4 mr-2" />
                    Submit Answer
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Only volunteers, teachers, and admins can answer questions.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
