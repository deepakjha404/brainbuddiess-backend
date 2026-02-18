"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronUp, ChevronDown, MessageSquare, Eye, Clock, CheckCircle, ArrowLeft } from "lucide-react"
import { useForumStore } from "@/lib/forum-store"
import { useAuthStore } from "@/lib/auth-store"
import { AuthGuard } from "@/components/auth/auth-guard"
import { formatDistanceToNow } from "date-fns"

export default function QuestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const questionId = params.id as string

  const [answerContent, setAnswerContent] = useState("")
  const [commentContent, setCommentContent] = useState("")
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null)
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  const { getQuestion, postAnswer, addComment, voteQuestion, voteAnswer, acceptAnswer, incrementViews, votes } =
    useForumStore()
  const { user } = useAuthStore()

  const question = getQuestion(questionId)

  useEffect(() => {
    if (question) {
      incrementViews(questionId)
    }
  }, [question, questionId, incrementViews])

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Question Not Found</h1>
          <Button onClick={() => router.push("/forum")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forum
          </Button>
        </div>
      </div>
    )
  }

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

  const getUserVote = (targetId: string, targetType: "question" | "answer") => {
    if (!user) return null
    const vote = votes.find((v) => v.userId === user.id && v.targetId === targetId && v.targetType === targetType)
    return vote ? vote.value : null
  }

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !answerContent.trim()) return

    setIsSubmittingAnswer(true)
    try {
      const answerId = postAnswer(questionId, answerContent.trim())
      if (answerId) {
        setAnswerContent("")
      }
    } finally {
      setIsSubmittingAnswer(false)
    }
  }

  const handleSubmitComment = async (answerId: string) => {
    if (!user || !commentContent.trim()) return

    setIsSubmittingComment(true)
    try {
      const commentId = addComment(answerId, commentContent.trim())
      if (commentId) {
        setCommentContent("")
        setActiveCommentId(null)
      }
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const canAcceptAnswer = user && user.id === question.authorId

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => router.push("/forum")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </Button>

        {/* Question */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-3">{question.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{question.content}</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => voteQuestion(question.id, 1)}
                  className={`p-2 h-10 w-10 ${getUserVote(question.id, "question") === 1 ? "text-green-600" : ""}`}
                >
                  <ChevronUp className="h-5 w-5" />
                </Button>
                <span className="font-bold text-lg">{question.votes}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => voteQuestion(question.id, -1)}
                  className={`p-2 h-10 w-10 ${getUserVote(question.id, "question") === -1 ? "text-red-600" : ""}`}
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {question.authorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span>{question.authorName}</span>
                <Badge className={getRoleBadgeColor(question.authorRole)}>{question.authorRole}</Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{question.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {question.answers.length} {question.answers.length === 1 ? "Answer" : "Answers"}
          </h2>

          {question.answers.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No answers yet. Be the first to help!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {question.answers
                .sort((a, b) => {
                  if (a.isAccepted && !b.isAccepted) return -1
                  if (!a.isAccepted && b.isAccepted) return 1
                  return b.votes - a.votes
                })
                .map((answer) => (
                  <Card key={answer.id} className={answer.isAccepted ? "border-green-200 bg-green-50/50" : ""}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => voteAnswer(answer.id, 1)}
                            className={`p-2 h-10 w-10 ${getUserVote(answer.id, "answer") === 1 ? "text-green-600" : ""}`}
                          >
                            <ChevronUp className="h-5 w-5" />
                          </Button>
                          <span className="font-bold text-lg">{answer.votes}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => voteAnswer(answer.id, -1)}
                            className={`p-2 h-10 w-10 ${getUserVote(answer.id, "answer") === -1 ? "text-red-600" : ""}`}
                          >
                            <ChevronDown className="h-5 w-5" />
                          </Button>
                          {canAcceptAnswer && !question.acceptedAnswerId && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => acceptAnswer(question.id, answer.id)}
                              className="mt-2 text-xs"
                            >
                              Accept
                            </Button>
                          )}
                          {answer.isAccepted && (
                            <div className="mt-2 flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-xs font-medium">Accepted</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="prose max-w-none mb-4">
                            <p className="whitespace-pre-wrap">{answer.content}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {answer.authorName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{answer.authorName}</span>
                              <Badge className={`text-xs ${getRoleBadgeColor(answer.authorRole)}`}>
                                {answer.authorRole}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{formatDistanceToNow(answer.createdAt, { addSuffix: true })}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveCommentId(activeCommentId === answer.id ? null : answer.id)}
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Comment ({answer.comments.length})
                              </Button>
                            </div>
                          </div>

                          {/* Comments */}
                          {answer.comments.length > 0 && (
                            <div className="mt-4 pl-4 border-l-2 border-muted space-y-3">
                              {answer.comments.map((comment) => (
                                <div key={comment.id} className="text-sm">
                                  <p className="mb-1">{comment.content}</p>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <span>{comment.authorName}</span>
                                    <Badge className={`text-xs ${getRoleBadgeColor(comment.authorRole)}`}>
                                      {comment.authorRole}
                                    </Badge>
                                    <span>{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Comment Form */}
                          {activeCommentId === answer.id && (
                            <div className="mt-4 pl-4 border-l-2 border-muted">
                              <div className="flex gap-2">
                                <Textarea
                                  placeholder="Add a comment..."
                                  value={commentContent}
                                  onChange={(e) => setCommentContent(e.target.value)}
                                  rows={2}
                                  className="flex-1"
                                />
                                <div className="flex flex-col gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleSubmitComment(answer.id)}
                                    disabled={!commentContent.trim() || isSubmittingComment}
                                  >
                                    {isSubmittingComment ? "..." : "Post"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setActiveCommentId(null)
                                      setCommentContent("")
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>

        {/* Answer Form */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Your Answer</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <Textarea
                placeholder="Write your answer here... Be detailed and helpful!"
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                rows={6}
                required
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={!answerContent.trim() || isSubmittingAnswer}>
                  {isSubmittingAnswer ? "Posting..." : "Post Answer"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
