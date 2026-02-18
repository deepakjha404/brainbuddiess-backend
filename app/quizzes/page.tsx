"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { QuizCard } from "@/components/quiz/quiz-card"
import { QuizFilters } from "@/components/quiz/quiz-filters"
import { Leaderboard } from "@/components/quiz/leaderboard"
import { useQuizStore } from "@/lib/quiz-store"
import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, TrendingUp, Star } from "lucide-react"

export default function QuizzesPage() {
  const { quizzes, getUserStats } = useQuizStore()
  const { user } = useAuthStore()
  const [filteredQuizzes, setFilteredQuizzes] = useState(quizzes)

  const userStats = user ? getUserStats(user.id) : null

  const totalQuizzes = quizzes.length
  const contestQuizzes = quizzes.filter((quiz) => quiz.isContest).length
  const averageDifficulty =
    quizzes.reduce((acc, quiz) => {
      const difficultyScore = quiz.difficulty === "easy" ? 1 : quiz.difficulty === "medium" ? 2 : 3
      return acc + difficultyScore
    }, 0) / quizzes.length

  const getDifficultyLabel = (score: number) => {
    if (score < 1.5) return "Easy"
    if (score < 2.5) return "Medium"
    return "Hard"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quizzes & Contests</h1>
            <p className="text-muted-foreground">Test your knowledge and compete with others</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Quizzes</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuizzes}</div>
              <p className="text-xs text-muted-foreground">{contestQuizzes} active contests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Difficulty</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getDifficultyLabel(averageDifficulty)}</div>
              <p className="text-xs text-muted-foreground">Across all subjects</p>
            </CardContent>
          </Card>

          {userStats && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Your Average</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.averageScore}%</div>
                  <p className="text-xs text-muted-foreground">{userStats.totalQuizzes} quizzes taken</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.bestScore}%</div>
                  <p className="text-xs text-muted-foreground">{userStats.contestsWon} contests won</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Find Quizzes</CardTitle>
                <CardDescription>Filter and search for quizzes that match your interests</CardDescription>
              </CardHeader>
              <CardContent>
                <QuizFilters onFilteredQuizzes={setFilteredQuizzes} />
              </CardContent>
            </Card>

            {/* Quizzes Grid */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-2">
                <h2 className="text-xl font-semibold">Available Quizzes ({filteredQuizzes.length})</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Easy
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Medium
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Hard
                  </Badge>
                </div>
              </div>

              {filteredQuizzes.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Target className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No quizzes found</h3>
                    <p className="text-muted-foreground text-center">
                      Try adjusting your filters to find quizzes that match your interests.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredQuizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Leaderboard />

            {/* User Progress */}
            {userStats && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>Track your quiz performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Quizzes Completed</span>
                    <span className="text-2xl font-bold">{userStats.totalQuizzes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Points</span>
                    <span className="text-2xl font-bold">{userStats.totalPoints}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Contests Won</span>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-2xl font-bold">{userStats.contestsWon}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Participants</span>
                  <span className="font-medium">{quizzes.reduce((sum, quiz) => sum + quiz.participants, 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Contests</span>
                  <span className="font-medium">{contestQuizzes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Subjects Available</span>
                  <span className="font-medium">{new Set(quizzes.map((quiz) => quiz.subject)).size}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
