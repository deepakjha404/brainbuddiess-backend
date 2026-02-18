import { create } from "zustand"
import { volunteerAPI } from "./api"
import { toast } from "sonner"

export interface Question {
  id: string
  title: string
  description: string
  subject: string
  difficulty: "easy" | "medium" | "hard"
  askedBy: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: string
  answers: Answer[]
  isAnswered: boolean
  points: number
}

export interface Answer {
  id: string
  content: string
  answeredBy: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  createdAt: string
  isAccepted: boolean
  upvotes: number
  downvotes: number
}

export interface VolunteerRanking {
  id: string
  name: string
  avatar?: string
  points: number
  answersCount: number
  acceptedAnswers: number
  badges: string[]
  rank: number
}

interface VolunteerState {
  questions: Question[]
  leaderboard: VolunteerRanking[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  filters: {
    subject: string
    difficulty: string
  }
  fetchQuestions: () => Promise<void>
  fetchLeaderboard: () => Promise<void>
  submitAnswer: (questionId: string, answer: string) => Promise<boolean>
  askQuestion: (title: string, description: string, subject: string, difficulty: string) => Promise<boolean>
  setFilters: (filters: Partial<VolunteerState["filters"]>) => void
  setPage: (page: number) => void
}

export const useVolunteerStore = create<VolunteerState>((set, get) => ({
  questions: [],
  leaderboard: [],
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
  filters: {
    subject: "",
    difficulty: "",
  },

  fetchQuestions: async () => {
    set({ isLoading: true })
    try {
      const { currentPage, filters } = get()
      const response = await volunteerAPI.getQuestions(
        currentPage,
        10,
        filters.subject || undefined,
        filters.difficulty || undefined,
      )

      set({
        questions: response.data.questions,
        totalPages: response.data.totalPages,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      toast.error("Failed to fetch questions")
    }
  },

  fetchLeaderboard: async () => {
    try {
      const response = await volunteerAPI.getLeaderboard()
      set({ leaderboard: response.data })
    } catch (error) {
      toast.error("Failed to fetch leaderboard")
    }
  },

  submitAnswer: async (questionId: string, answer: string) => {
    try {
      await volunteerAPI.submitAnswer(questionId, answer)
      toast.success("Answer submitted successfully!")
      get().fetchQuestions() // Refresh questions
      return true
    } catch (error) {
      toast.error("Failed to submit answer")
      return false
    }
  },

  askQuestion: async (title: string, description: string, subject: string, difficulty: string) => {
    try {
      await volunteerAPI.askQuestion(title, description, subject, difficulty)
      toast.success("Question posted successfully!")
      get().fetchQuestions() // Refresh questions
      return true
    } catch (error) {
      toast.error("Failed to post question")
      return false
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1,
    }))
    get().fetchQuestions()
  },

  setPage: (page) => {
    set({ currentPage: page })
    get().fetchQuestions()
  },
}))
