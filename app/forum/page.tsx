"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { QuestionCard } from "@/components/forum/question-card"
import { AskQuestionDialog } from "@/components/forum/ask-question-dialog"
import { ForumFilters } from "@/components/forum/forum-filters"
import { useForumStore, type QuestionCategory, type QuestionStatus } from "@/lib/forum-store"
import { useAuthStore } from "@/lib/auth-store"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | "All">("All")
  const [selectedStatus, setSelectedStatus] = useState<QuestionStatus | "All">("All")
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([])

  const { questions, searchQuestions, voteQuestion, votes } = useForumStore()
  const { user } = useAuthStore()

  useEffect(() => {
    if (searchQuery || selectedCategory !== "All" || selectedStatus !== "All") {
      const results = searchQuestions(
        searchQuery,
        selectedCategory === "All" ? undefined : selectedCategory,
        selectedStatus === "All" ? undefined : selectedStatus,
      )
      setFilteredQuestions(results)
    } else {
      setFilteredQuestions(questions)
    }
  }, [searchQuery, selectedCategory, selectedStatus, questions, searchQuestions])

  const getUserVote = (questionId: string) => {
    if (!user) return null
    const vote = votes.find((v) => v.userId === user.id && v.targetId === questionId && v.targetType === "question")
    return vote ? vote.value : null
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setSelectedStatus("All")
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Q&A Forum</h1>
            <p className="text-muted-foreground mt-1">Get help from volunteers and teachers, or help others learn</p>
          </div>
          <AskQuestionDialog>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ask Question
            </Button>
          </AskQuestionDialog>
        </div>

        <ForumFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onClearFilters={handleClearFilters}
        />

        <div className="mt-6">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {searchQuery || selectedCategory !== "All" || selectedStatus !== "All"
                  ? "No questions match your filters"
                  : "No questions yet"}
              </p>
              <AskQuestionDialog>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ask the First Question
                </Button>
              </AskQuestionDialog>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onVote={voteQuestion}
                  userVote={getUserVote(question.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
