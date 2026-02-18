import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Feedback {
  id: string
  type: "bug" | "feature" | "improvement" | "general"
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in-review" | "resolved" | "closed"
  submittedBy: string
  submittedAt: Date
  updatedAt: Date
  adminResponse?: string
  attachments?: string[]
}

interface FeedbackState {
  feedbacks: Feedback[]
  userFeedbacks: Feedback[]
  selectedType: string
  selectedStatus: string
  sortBy: "date" | "priority" | "status"
  submitFeedback: (feedback: Omit<Feedback, "id" | "submittedAt" | "updatedAt" | "status">) => void
  updateFeedbackStatus: (id: string, status: Feedback["status"], adminResponse?: string) => void
  getUserFeedbacks: (userId: string) => void
  setSelectedType: (type: string) => void
  setSelectedStatus: (status: string) => void
  setSortBy: (sortBy: "date" | "priority" | "status") => void
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set, get) => ({
      feedbacks: [
        {
          id: "1",
          type: "bug",
          title: "Quiz timer not working properly",
          description:
            "The quiz timer sometimes freezes and doesn't count down correctly, causing confusion during timed quizzes.",
          priority: "high",
          status: "in-review",
          submittedBy: "student1",
          submittedAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(Date.now() - 43200000),
          adminResponse: "We are investigating this issue and will have a fix soon.",
        },
        {
          id: "2",
          type: "feature",
          title: "Add dark mode to PDF viewer",
          description:
            "It would be great to have a dark mode option in the PDF viewer for better reading experience during night study sessions.",
          priority: "medium",
          status: "pending",
          submittedBy: "student2",
          submittedAt: new Date(Date.now() - 172800000),
          updatedAt: new Date(Date.now() - 172800000),
        },
        {
          id: "3",
          type: "improvement",
          title: "Better search in library",
          description:
            "The current search in library could be improved with filters for author, publication year, and better relevance ranking.",
          priority: "medium",
          status: "resolved",
          submittedBy: "student3",
          submittedAt: new Date(Date.now() - 259200000),
          updatedAt: new Date(Date.now() - 86400000),
          adminResponse: "We have implemented advanced search filters as requested.",
        },
      ],
      userFeedbacks: [],
      selectedType: "",
      selectedStatus: "",
      sortBy: "date",

      submitFeedback: (feedbackData) => {
        const newFeedback: Feedback = {
          ...feedbackData,
          id: Date.now().toString(),
          status: "pending",
          submittedAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ feedbacks: [newFeedback, ...state.feedbacks] }))
      },

      updateFeedbackStatus: (id, status, adminResponse) => {
        set((state) => ({
          feedbacks: state.feedbacks.map((feedback) =>
            feedback.id === id
              ? {
                  ...feedback,
                  status,
                  adminResponse,
                  updatedAt: new Date(),
                }
              : feedback,
          ),
        }))
      },

      getUserFeedbacks: (userId) => {
        const userFeedbacks = get().feedbacks.filter((feedback) => feedback.submittedBy === userId)
        set({ userFeedbacks })
      },

      setSelectedType: (type) => set({ selectedType: type }),
      setSelectedStatus: (status) => set({ selectedStatus: status }),
      setSortBy: (sortBy) => set({ sortBy }),
    }),
    {
      name: "feedback-storage",
    },
  ),
)
