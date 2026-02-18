"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useQuizStore, type QuizDifficulty } from "@/lib/quiz-store"
import { Search, X, Trophy } from "lucide-react"

interface QuizFiltersProps {
  onFilteredQuizzes: (quizzes: any[]) => void
}

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Literature",
  "History",
  "Computer Science",
  "Art",
  "Music",
  "Other",
]

export function QuizFilters({ onFilteredQuizzes }: QuizFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficulty | "all">("all")
  const [showContestsOnly, setShowContestsOnly] = useState(false)

  const { searchQuizzes, quizzes } = useQuizStore()

  const applyFilters = () => {
    let filteredQuizzes = searchQuizzes(
      searchQuery,
      selectedSubject === "all" ? undefined : selectedSubject,
      selectedDifficulty === "all" ? undefined : selectedDifficulty,
    )

    if (showContestsOnly) {
      filteredQuizzes = filteredQuizzes.filter((quiz) => quiz.isContest)
    }

    onFilteredQuizzes(filteredQuizzes)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedSubject("all")
    setSelectedDifficulty("all")
    setShowContestsOnly(false)
    onFilteredQuizzes(quizzes)
  }

  const hasActiveFilters = searchQuery || selectedSubject !== "all" || selectedDifficulty !== "all" || showContestsOnly

  useEffect(() => {
    applyFilters()
  }, [searchQuery, selectedSubject, selectedDifficulty, showContestsOnly])

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search quizzes by title, description, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row flex-wrap gap-3 md:items-center md:gap-4">
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedDifficulty}
          onValueChange={(value: QuizDifficulty | "all") => setSelectedDifficulty(value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={showContestsOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setShowContestsOnly(!showContestsOnly)}
        >
          <Trophy className="mr-2 h-4 w-4" />
          Contests Only
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary">
              Search: "{searchQuery}"
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
            </Badge>
          )}
          {selectedSubject !== "all" && (
            <Badge variant="secondary">
              Subject: {selectedSubject}
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSelectedSubject("all")} />
            </Badge>
          )}
          {selectedDifficulty !== "all" && (
            <Badge variant="secondary">
              Difficulty: {selectedDifficulty}
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSelectedDifficulty("all")} />
            </Badge>
          )}
          {showContestsOnly && (
            <Badge variant="secondary">
              Contests only
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setShowContestsOnly(false)} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
