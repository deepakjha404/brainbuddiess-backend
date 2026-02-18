"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuizStore } from "@/lib/quiz-store"
import { Trophy, Clock, Target, Medal } from "lucide-react"

interface LeaderboardProps {
  quizId?: string
}

export function Leaderboard({ quizId }: LeaderboardProps) {
  const { getQuizLeaderboard, getGlobalLeaderboard } = useQuizStore()

  const quizLeaderboard = quizId ? getQuizLeaderboard(quizId) : []
  const globalLeaderboard = getGlobalLeaderboard()

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "volunteer":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "teacher":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const LeaderboardList = ({ entries }: { entries: any[] }) => (
    <div className="space-y-3">
      {entries.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No entries yet. Be the first to take a quiz!</p>
        </div>
      ) : (
        entries.map((entry, index) => (
          <div
            key={entry.userId}
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border shadow-sm transition hover:shadow-md bg-white dark:bg-muted/30 ${
              index < 3
                ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                : ""
            }`}
          >
            {/* Rank */}
            <div className="flex items-center justify-center w-10 h-10">
              {index === 0 ? (
                <Trophy className="h-8 w-8 text-yellow-500" />
              ) : index === 1 ? (
                <Medal className="h-8 w-8 text-gray-400" />
              ) : index === 2 ? (
                <Medal className="h-8 w-8 text-amber-600" />
              ) : (
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-lg font-bold text-muted-foreground">{index + 1}</span>
              )}
            </div>

            {/* Avatar & User Info */}
            <div className="flex items-center flex-1 min-w-0 gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {entry.userName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2">
                  <p className="font-semibold truncate text-lg">{entry.userName}</p>
                  <Badge className={getRoleColor(entry.userRole)} variant="secondary">
                    {entry.userRole}
                  </Badge>
                  {entry.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {entry.badge}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    <span>{entry.score} pts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(entry.timeSpent)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Percentage/Score */}
            <div className="flex flex-col items-center min-w-[70px]">
              <div className="text-2xl font-extrabold text-primary">
                {entry.percentage}%
              </div>
              <span className="text-xs text-muted-foreground mt-1">Score</span>
            </div>
          </div>
        ))
      )}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
        <CardDescription>Top performers and quiz champions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={quizId ? "quiz" : "global"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {quizId && <TabsTrigger value="quiz">This Quiz</TabsTrigger>}
            <TabsTrigger value="global">Global Rankings</TabsTrigger>
          </TabsList>

          {quizId && (
            <TabsContent value="quiz" className="mt-6">
              <LeaderboardList entries={quizLeaderboard} />
            </TabsContent>
          )}

          <TabsContent value="global" className="mt-6">
            <LeaderboardList entries={globalLeaderboard} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
