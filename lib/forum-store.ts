import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useAuthStore } from "./auth-store"

export type QuestionStatus = "open" | "answered" | "closed"
export type QuestionCategory =
  | "Mathematics"
  | "Physics"
  | "Chemistry"
  | "Biology"
  | "Literature"
  | "History"
  | "Computer Science"
  | "Other"

export interface Question {
  id: string
  title: string
  content: string
  category: QuestionCategory
  tags: string[]
  authorId: string
  authorName: string
  authorRole: string
  status: QuestionStatus
  createdAt: Date
  updatedAt: Date
  views: number
  votes: number
  answers: Answer[]
  acceptedAnswerId?: string
}

export interface Answer {
  id: string
  questionId: string
  content: string
  authorId: string
  authorName: string
  authorRole: string
  createdAt: Date
  updatedAt: Date
  votes: number
  isAccepted: boolean
  comments: Comment[]
}

export interface Comment {
  id: string
  content: string
  authorId: string
  authorName: string
  authorRole: string
  createdAt: Date
}

export interface Vote {
  id: string
  userId: string
  targetId: string // question or answer id
  targetType: "question" | "answer"
  value: 1 | -1
}

interface ForumState {
  questions: Question[]
  votes: Vote[]
  searchQuery: string
  selectedCategory: QuestionCategory | "All"
  selectedStatus: QuestionStatus | "All"
  postQuestion: (title: string, content: string, category: QuestionCategory, tags: string[]) => string
  postAnswer: (questionId: string, content: string) => string
  addComment: (answerId: string, content: string) => string
  voteQuestion: (questionId: string, value: 1 | -1) => void
  voteAnswer: (answerId: string, value: 1 | -1) => void
  acceptAnswer: (questionId: string, answerId: string) => void
  getQuestions: () => Question[]
  getQuestion: (id: string) => Question | undefined
  searchQuestions: (query: string, category?: QuestionCategory, status?: QuestionStatus) => Question[]
  incrementViews: (questionId: string) => void
}

// Mock data
const mockQuestions: Question[] = [
  {
    id: "1",
    title: "How to solve quadratic equations using the quadratic formula?",
    content:
      "I'm struggling with understanding when and how to use the quadratic formula. Can someone explain the steps and provide an example?",
    category: "Mathematics",
    tags: ["algebra", "quadratic", "formula"],
    authorId: "1",
    authorName: "Alex Student",
    authorRole: "student",
    status: "answered",
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 43200000),
    views: 45,
    votes: 8,
    acceptedAnswerId: "a1",
    answers: [
      {
        id: "a1",
        questionId: "1",
        content:
          "The quadratic formula is x = (-b ± √(b²-4ac)) / 2a. Here's how to use it:\n\n1. Identify a, b, and c from your equation ax² + bx + c = 0\n2. Substitute into the formula\n3. Simplify under the square root first\n4. Calculate both solutions using + and - \n\nExample: For x² - 5x + 6 = 0\na=1, b=-5, c=6\nx = (5 ± √(25-24)) / 2 = (5 ± 1) / 2\nSo x = 3 or x = 2",
        authorId: "2",
        authorName: "Sarah Volunteer",
        authorRole: "volunteer",
        createdAt: new Date(Date.now() - 43200000),
        updatedAt: new Date(Date.now() - 43200000),
        votes: 12,
        isAccepted: true,
        comments: [
          {
            id: "c1",
            content: "This explanation is really clear! Thank you so much.",
            authorId: "1",
            authorName: "Alex Student",
            authorRole: "student",
            createdAt: new Date(Date.now() - 21600000),
          },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "What is the difference between kinetic and potential energy?",
    content: "I keep getting confused about these two types of energy. Can someone explain with real-world examples?",
    category: "Physics",
    tags: ["energy", "kinetic", "potential", "mechanics"],
    authorId: "5",
    authorName: "Emma Wilson",
    authorRole: "student",
    status: "open",
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
    views: 23,
    votes: 5,
    answers: [
      {
        id: "a2",
        questionId: "2",
        content:
          "Great question! Here's the key difference:\n\n**Kinetic Energy**: Energy of motion (KE = ½mv²)\n- A moving car\n- A thrown ball\n- Running water\n\n**Potential Energy**: Stored energy due to position (PE = mgh for gravitational)\n- A book on a shelf\n- A stretched rubber band\n- Water behind a dam\n\nThey convert into each other - like a pendulum swinging back and forth!",
        authorId: "3",
        authorName: "Dr. Mike Teacher",
        authorRole: "teacher",
        createdAt: new Date(Date.now() - 1800000),
        updatedAt: new Date(Date.now() - 1800000),
        votes: 7,
        isAccepted: false,
        comments: [],
      },
    ],
  },
  {
    id: "3",
    title: "How do I balance chemical equations?",
    content: "I understand the concept but I always mess up the numbers. Any tips or systematic approach?",
    category: "Chemistry",
    tags: ["equations", "balancing", "stoichiometry"],
    authorId: "6",
    authorName: "John Smith",
    authorRole: "student",
    status: "open",
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 7200000),
    views: 31,
    votes: 3,
    answers: [],
  },
]

const mockVotes: Vote[] = [
  { id: "v1", userId: "1", targetId: "1", targetType: "question", value: 1 },
  { id: "v2", userId: "3", targetId: "a1", targetType: "answer", value: 1 },
  { id: "v3", userId: "5", targetId: "2", targetType: "question", value: 1 },
]

export const useForumStore = create<ForumState>()(
  persist(
    (set, get) => ({
      questions: mockQuestions,
      votes: mockVotes,
      searchQuery: "",
      selectedCategory: "All",
      selectedStatus: "All",

      postQuestion: (title: string, content: string, category: QuestionCategory, tags: string[]) => {
        const user = useAuthStore.getState().user
        if (!user) return ""

        const newQuestion: Question = {
          id: Date.now().toString(),
          title,
          content,
          category,
          tags,
          authorId: user.id,
          authorName: user.name,
          authorRole: user.role,
          status: "open",
          createdAt: new Date(),
          updatedAt: new Date(),
          views: 0,
          votes: 0,
          answers: [],
        }

        set((state) => ({
          questions: [newQuestion, ...state.questions],
        }))

        return newQuestion.id
      },

      postAnswer: (questionId: string, content: string) => {
        const user = useAuthStore.getState().user
        if (!user) return ""

        const newAnswer: Answer = {
          id: Date.now().toString(),
          questionId,
          content,
          authorId: user.id,
          authorName: user.name,
          authorRole: user.role,
          createdAt: new Date(),
          updatedAt: new Date(),
          votes: 0,
          isAccepted: false,
          comments: [],
        }

        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  answers: [...q.answers, newAnswer],
                  updatedAt: new Date(),
                  status: "answered" as QuestionStatus,
                }
              : q,
          ),
        }))

        return newAnswer.id
      },

      addComment: (answerId: string, content: string) => {
        const user = useAuthStore.getState().user
        if (!user) return ""

        const newComment: Comment = {
          id: Date.now().toString(),
          content,
          authorId: user.id,
          authorName: user.name,
          authorRole: user.role,
          createdAt: new Date(),
        }

        set((state) => ({
          questions: state.questions.map((q) => ({
            ...q,
            answers: q.answers.map((a) => (a.id === answerId ? { ...a, comments: [...a.comments, newComment] } : a)),
          })),
        }))

        return newComment.id
      },

      voteQuestion: (questionId: string, value: 1 | -1) => {
        const user = useAuthStore.getState().user
        if (!user) return

        const existingVote = get().votes.find(
          (v) => v.userId === user.id && v.targetId === questionId && v.targetType === "question",
        )

        if (existingVote) {
          // Update existing vote
          set((state) => ({
            votes: state.votes.map((v) => (v.id === existingVote.id ? { ...v, value } : v)),
            questions: state.questions.map((q) =>
              q.id === questionId ? { ...q, votes: q.votes - existingVote.value + value } : q,
            ),
          }))
        } else {
          // Create new vote
          const newVote: Vote = {
            id: Date.now().toString(),
            userId: user.id,
            targetId: questionId,
            targetType: "question",
            value,
          }

          set((state) => ({
            votes: [...state.votes, newVote],
            questions: state.questions.map((q) => (q.id === questionId ? { ...q, votes: q.votes + value } : q)),
          }))
        }
      },

      voteAnswer: (answerId: string, value: 1 | -1) => {
        const user = useAuthStore.getState().user
        if (!user) return

        const existingVote = get().votes.find(
          (v) => v.userId === user.id && v.targetId === answerId && v.targetType === "answer",
        )

        if (existingVote) {
          // Update existing vote
          set((state) => ({
            votes: state.votes.map((v) => (v.id === existingVote.id ? { ...v, value } : v)),
            questions: state.questions.map((q) => ({
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, votes: a.votes - existingVote.value + value } : a,
              ),
            })),
          }))
        } else {
          // Create new vote
          const newVote: Vote = {
            id: Date.now().toString(),
            userId: user.id,
            targetId: answerId,
            targetType: "answer",
            value,
          }

          set((state) => ({
            votes: [...state.votes, newVote],
            questions: state.questions.map((q) => ({
              ...q,
              answers: q.answers.map((a) => (a.id === answerId ? { ...a, votes: a.votes + value } : a)),
            })),
          }))
        }
      },

      acceptAnswer: (questionId: string, answerId: string) => {
        const user = useAuthStore.getState().user
        const question = get().questions.find((q) => q.id === questionId)

        if (!user || !question || question.authorId !== user.id) return

        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  acceptedAnswerId: answerId,
                  status: "answered" as QuestionStatus,
                  answers: q.answers.map((a) => ({
                    ...a,
                    isAccepted: a.id === answerId,
                  })),
                }
              : q,
          ),
        }))
      },

      getQuestions: () => get().questions,

      getQuestion: (id: string) => get().questions.find((q) => q.id === id),

      searchQuestions: (query: string, category?: QuestionCategory, status?: QuestionStatus) => {
        const questions = get().questions
        return questions.filter((question) => {
          const matchesQuery =
            question.title.toLowerCase().includes(query.toLowerCase()) ||
            question.content.toLowerCase().includes(query.toLowerCase()) ||
            question.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))

          const matchesCategory = !category || category === "All" || question.category === category
          const matchesStatus = !status || status === "All" || question.status === status

          return matchesQuery && matchesCategory && matchesStatus
        })
      },

      incrementViews: (questionId: string) => {
        set((state) => ({
          questions: state.questions.map((q) => (q.id === questionId ? { ...q, views: q.views + 1 } : q)),
        }))
      },
    }),
    {
      name: "brainbuddies-forum",
    },
  ),
)
