"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Trophy, Users, MessageSquare, Award } from "lucide-react"
import { useVolunteerStore, type Question } from "@/lib/volunteer-store"
import { QuestionCard } from "@/components/volunteer/question-card"
import { AskQuestionDialog } from "@/components/volunteer/ask-question-dialog"
import { QuestionDetailsDialog } from "@/components/volunteer/question-details-dialog"
import { useAuthStore } from "@/lib/auth-store"

const subjects = [
  "All Subjects",
  "Data Structures",
  "Algorithms",
  "Database Management",
  "Operating Systems",
  "Computer Networks",
  "Software Engineering",
  "Web Development",
  "Machine Learning",
]

export default function VolunteerPage() {
  const { user } = useAuthStore()
  const {
    questions,
    leaderboard,
    isLoading,
    currentPage,
    totalPages,
    filters,
    fetchQuestions,
    fetchLeaderboard,
    setFilters,
    setPage,
  } = useVolunteerStore()

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchQuestions()
    fetchLeaderboard()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // In a real app, this would trigger a search API call
  }

  const filteredQuestions = questions.filter(
    (question) =>
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Volunteer Q&A Forum</h1>
          <p className="text-muted-foreground">Help fellow students and earn points</p>
        </div>
        <AskQuestionDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{questions.length}</p>
                <p className="text-sm text-muted-foreground">Total Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{leaderboard.length}</p>
                <p className="text-sm text-muted-foreground">Active Volunteers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{user?.points || 0}</p>
                <p className="text-sm text-muted-foreground">Your Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{leaderboard.findIndex((v) => v.id === user?.id) + 1 || "-"}</p>
                <p className="text-sm text-muted-foreground">Your Rank</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="questions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.subject}
              onValueChange={(value) => setFilters({ subject: value === "All Subjects" ? "" : value })}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.difficulty}
              onValueChange={(value) => setFilters({ difficulty: value === "All" ? "" : value })}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading questions...</div>
            ) : filteredQuestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No questions found. Be the first to ask one!</div>
            ) : (
              filteredQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} onViewDetails={setSelectedQuestion} />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Top Volunteers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((volunteer, index) => (
                  <div key={volunteer.id} className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{volunteer.name}</h3>
                        {volunteer.badges.map((badge) => (
                          <Badge key={badge} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {volunteer.answersCount} answers • {volunteer.acceptedAnswers} accepted
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg">{volunteer.points}</p>
                      <p className="text-sm text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedQuestion && (
        <QuestionDetailsDialog
          question={selectedQuestion}
          open={!!selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
        />
      )}
    </div>
  )
}
