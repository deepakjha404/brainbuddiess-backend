"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Quiz } from "@/lib/quiz-store"
import { Clock, Users, Trophy, Target, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

interface QuizCardProps {
  quiz: Quiz
}

export function QuizCard({ quiz }: QuizCardProps) {
  const router = useRouter()

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

  const formatTimeLimit = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const isContestActive = quiz.isContest && quiz.contestEndDate && quiz.contestEndDate > new Date()

  const handleStartQuiz = () => {
    router.push(`/quizzes/${quiz.id}`)
  }

  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <CardTitle className="text-lg whitespace-normal break-words">{quiz.title}</CardTitle>
              {quiz.isContest && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                >
                  <Trophy className="h-3 w-3 mr-1" />
                  Contest
                </Badge>
              )}
            </div>
            <CardDescription className="text-sm line-clamp-2">{quiz.description}</CardDescription>
          </div>
          <Badge className={getDifficultyColor(quiz.difficulty)} variant="secondary">
            {quiz.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col flex-1">
        {/* Subject and Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{quiz.subject}</Badge>
          {quiz.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {quiz.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{quiz.tags.length - 2}
            </Badge>
          )}
        </div>

        {/* Quiz Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formatTimeLimit(quiz.timeLimit)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span>{quiz.totalPoints} pts</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{quiz.participants} taken</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <span>{quiz.averageScore}% avg</span>
          </div>
        </div>

        {/* Average Score Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Average Score</span>
            <span>{quiz.averageScore}%</span>
          </div>
          <Progress value={quiz.averageScore} className="h-2" />
        </div>

        {/* Contest End Date */}
        {quiz.isContest && quiz.contestEndDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{isContestActive ? `Ends ${quiz.contestEndDate.toLocaleDateString()}` : "Contest ended"}</span>
          </div>
        )}

        {/* Created By */}
        <div className="text-sm text-muted-foreground">Created by {quiz.createdBy}</div>

        {/* Start Button */}
        <div className="mt-auto pt-2">
          <Button onClick={handleStartQuiz} className="w-full" disabled={quiz.isContest && !isContestActive}>
            {quiz.isContest && !isContestActive ? "Contest Ended" : "Start Quiz"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
