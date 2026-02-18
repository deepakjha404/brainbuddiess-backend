import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useAuthStore } from "./auth-store"

export type QuizDifficulty = "easy" | "medium" | "hard"
export type QuestionType = "multiple-choice" | "true-false" | "fill-blank"

export interface QuizQuestion {
  id: string
  question: string
  type: QuestionType
  options?: string[] // For multiple choice
  correctAnswer: string | number
  explanation?: string
  points: number
}

export interface Quiz {
  id: string
  title: string
  description: string
  subject: string
  difficulty: QuizDifficulty
  questions: QuizQuestion[]
  timeLimit: number // in minutes
  totalPoints: number
  createdBy: string
  createdAt: Date
  tags: string[]
  isContest: boolean
  contestEndDate?: Date
  participants: number
  averageScore: number
}

export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  userName: string
  userRole: string
  answers: Record<string, string | number>
  score: number
  totalPoints: number
  percentage: number
  timeSpent: number // in seconds
  completedAt: Date
  isContest: boolean
}

export interface LeaderboardEntry {
  userId: string
  userName: string
  userRole: string
  score: number
  percentage: number
  timeSpent: number
  completedAt: Date
  badge?: string
}

interface QuizState {
  quizzes: Quiz[]
  attempts: QuizAttempt[]
  currentQuiz: Quiz | null
  currentQuestionIndex: number
  currentAnswers: Record<string, string | number>
  timeRemaining: number
  isQuizActive: boolean
  startQuiz: (quizId: string) => boolean
  submitAnswer: (questionId: string, answer: string | number) => void
  nextQuestion: () => void
  previousQuestion: () => void
  submitQuiz: () => QuizAttempt | null
  getQuizLeaderboard: (quizId: string) => LeaderboardEntry[]
  getGlobalLeaderboard: () => LeaderboardEntry[]
  getUserStats: (userId: string) => any
  searchQuizzes: (query: string, subject?: string, difficulty?: QuizDifficulty) => Quiz[]
}

const mockQuizzes: Quiz[] = [
  {
    id: "1",
    title: "Data Structures and Algorithms Fundamentals",
    description: "Test your knowledge of arrays, linked lists, stacks, queues, and basic algorithms",
    subject: "Data Structures",
    difficulty: "medium",
    questions: [
      {
        id: "q1",
        question: "What is the time complexity of inserting an element at the beginning of a linked list?",
        type: "multiple-choice",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation:
          "Inserting at the beginning of a linked list only requires updating the head pointer, which is O(1).",
        points: 10,
      },
      {
        id: "q2",
        question: "Which data structure follows the LIFO (Last In First Out) principle?",
        type: "multiple-choice",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctAnswer: 1,
        explanation: "Stack follows LIFO principle where the last element added is the first one to be removed.",
        points: 10,
      },
      {
        id: "q3",
        question: "Binary search can only be applied on sorted arrays.",
        type: "true-false",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation:
          "Binary search requires the array to be sorted to work correctly by eliminating half the search space each time.",
        points: 5,
      },
    ],
    timeLimit: 15,
    totalPoints: 25,
    createdBy: "Dr. Rajesh Kumar",
    createdAt: new Date(Date.now() - 86400000),
    tags: ["DSA", "algorithms", "data-structures", "programming"],
    isContest: false,
    participants: 187,
    averageScore: 82.3,
  },
  {
    id: "2",
    title: "Database Management Systems Contest",
    description: "Weekly DBMS contest covering SQL, normalization, transactions, and database design",
    subject: "Database Systems",
    difficulty: "hard",
    questions: [
      {
        id: "q4",
        question: "Which normal form eliminates transitive dependencies?",
        type: "multiple-choice",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        correctAnswer: 2,
        explanation:
          "Third Normal Form (3NF) eliminates transitive dependencies where non-key attributes depend on other non-key attributes.",
        points: 15,
      },
      {
        id: "q5",
        question: "ACID properties ensure database transaction reliability.",
        type: "true-false",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation:
          "ACID (Atomicity, Consistency, Isolation, Durability) properties ensure reliable database transactions.",
        points: 10,
      },
      {
        id: "q6",
        question: "What does SQL stand for?",
        type: "fill-blank",
        correctAnswer: "Structured Query Language",
        explanation: "SQL stands for Structured Query Language, used for managing relational databases.",
        points: 5,
      },
    ],
    timeLimit: 25,
    totalPoints: 30,
    createdBy: "Prof. Priya Sharma",
    createdAt: new Date(Date.now() - 172800000),
    tags: ["DBMS", "SQL", "database", "contest", "normalization"],
    isContest: true,
    contestEndDate: new Date(Date.now() + 604800000), // 1 week from now
    participants: 143,
    averageScore: 71.8,
  },
  {
    id: "3",
    title: "Operating Systems Basics",
    description: "Fundamental concepts in OS including processes, memory management, and scheduling",
    subject: "Operating Systems",
    difficulty: "medium",
    questions: [
      {
        id: "q7",
        question: "What is a deadlock in operating systems?",
        type: "multiple-choice",
        options: [
          "A process that runs indefinitely",
          "A situation where processes wait for each other indefinitely",
          "A crashed process",
          "A process with high priority",
        ],
        correctAnswer: 1,
        explanation:
          "Deadlock occurs when processes are blocked forever, waiting for resources held by other processes in the set.",
        points: 10,
      },
      {
        id: "q8",
        question: "Virtual memory allows programs larger than physical memory to run.",
        type: "true-false",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Virtual memory uses disk space to extend physical memory, allowing larger programs to execute.",
        points: 5,
      },
    ],
    timeLimit: 12,
    totalPoints: 15,
    createdBy: "Prof. Anita Desai",
    createdAt: new Date(Date.now() - 259200000),
    tags: ["OS", "processes", "memory", "scheduling"],
    isContest: false,
    participants: 156,
    averageScore: 78.9,
  },
  {
    id: "4",
    title: "Computer Networks Challenge",
    description: "Test your knowledge of networking protocols, OSI model, and network security",
    subject: "Computer Networks",
    difficulty: "hard",
    questions: [
      {
        id: "q9",
        question: "Which layer of the OSI model handles routing?",
        type: "multiple-choice",
        options: ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"],
        correctAnswer: 2,
        explanation: "The Network Layer (Layer 3) is responsible for routing packets between different networks.",
        points: 10,
      },
      {
        id: "q10",
        question: "TCP is a connection-oriented protocol.",
        type: "true-false",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "TCP establishes a connection before data transmission and ensures reliable delivery.",
        points: 5,
      },
      {
        id: "q11",
        question: "What does HTTP stand for?",
        type: "fill-blank",
        correctAnswer: "HyperText Transfer Protocol",
        explanation: "HTTP is the protocol used for transferring web pages and other resources on the World Wide Web.",
        points: 5,
      },
    ],
    timeLimit: 18,
    totalPoints: 20,
    createdBy: "Dr. Vikram Singh",
    createdAt: new Date(Date.now() - 345600000),
    tags: ["networking", "protocols", "OSI", "TCP", "HTTP"],
    isContest: false,
    participants: 98,
    averageScore: 65.4,
  },
  {
    id: "5",
    title: "Object-Oriented Programming Contest",
    description: "Weekly OOP contest covering classes, inheritance, polymorphism, and design patterns",
    subject: "Object-Oriented Programming",
    difficulty: "medium",
    questions: [
      {
        id: "q12",
        question: "Which OOP principle allows a class to inherit properties from another class?",
        type: "multiple-choice",
        options: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
        correctAnswer: 1,
        explanation: "Inheritance allows a class to acquire properties and methods from a parent class.",
        points: 10,
      },
      {
        id: "q13",
        question: "Method overloading is an example of compile-time polymorphism.",
        type: "true-false",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Method overloading is resolved at compile time, making it compile-time polymorphism.",
        points: 10,
      },
    ],
    timeLimit: 15,
    totalPoints: 20,
    createdBy: "Dr. Amit Patel",
    createdAt: new Date(Date.now() - 432000000),
    tags: ["OOP", "inheritance", "polymorphism", "contest", "java", "cpp"],
    isContest: true,
    contestEndDate: new Date(Date.now() + 432000000), // 5 days from now
    participants: 167,
    averageScore: 74.2,
  },
  {
    id: "6",
    title: "Software Engineering Fundamentals",
    description: "Software development lifecycle, testing, and project management concepts",
    subject: "Software Engineering",
    difficulty: "easy",
    questions: [
      {
        id: "q14",
        question: "Which SDLC model follows a linear sequential approach?",
        type: "multiple-choice",
        options: ["Agile", "Waterfall", "Spiral", "RAD"],
        correctAnswer: 1,
        explanation:
          "Waterfall model follows a linear sequential approach where each phase must be completed before the next begins.",
        points: 5,
      },
      {
        id: "q15",
        question: "Unit testing is performed by developers.",
        type: "true-false",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Unit testing is typically performed by developers to test individual components or modules.",
        points: 5,
      },
    ],
    timeLimit: 10,
    totalPoints: 10,
    createdBy: "Sneha Gupta",
    createdAt: new Date(Date.now() - 518400000),
    tags: ["SDLC", "testing", "software-engineering", "waterfall", "agile"],
    isContest: false,
    participants: 203,
    averageScore: 88.1,
  },
]

const mockAttempts: QuizAttempt[] = [
  {
    id: "a1",
    quizId: "1",
    userId: "1",
    userName: "Arjun Patel",
    userRole: "student",
    answers: { q1: 0, q2: 1, q3: 0 },
    score: 25,
    totalPoints: 25,
    percentage: 100,
    timeSpent: 720, // 12 minutes
    completedAt: new Date(Date.now() - 3600000),
    isContest: false,
  },
  {
    id: "a2",
    quizId: "2",
    userId: "2",
    userName: "Priya Sharma",
    userRole: "student",
    answers: { q4: 2, q5: 0, q6: "Structured Query Language" },
    score: 30,
    totalPoints: 30,
    percentage: 100,
    timeSpent: 1200, // 20 minutes
    completedAt: new Date(Date.now() - 7200000),
    isContest: true,
  },
  {
    id: "a3",
    quizId: "3",
    userId: "1",
    userName: "Arjun Patel",
    userRole: "student",
    answers: { q7: 1, q8: 0 },
    score: 15,
    totalPoints: 15,
    percentage: 100,
    timeSpent: 480, // 8 minutes
    completedAt: new Date(Date.now() - 10800000),
    isContest: false,
  },
]

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      quizzes: mockQuizzes,
      attempts: mockAttempts,
      currentQuiz: null,
      currentQuestionIndex: 0,
      currentAnswers: {},
      timeRemaining: 0,
      isQuizActive: false,

      startQuiz: (quizId: string) => {
        const quiz = get().quizzes.find((q) => q.id === quizId)
        if (!quiz) return false

        set({
          currentQuiz: quiz,
          currentQuestionIndex: 0,
          currentAnswers: {},
          timeRemaining: quiz.timeLimit * 60, // Convert to seconds
          isQuizActive: true,
        })

        return true
      },

      submitAnswer: (questionId: string, answer: string | number) => {
        set((state) => ({
          currentAnswers: {
            ...state.currentAnswers,
            [questionId]: answer,
          },
        }))
      },

      nextQuestion: () => {
        const { currentQuiz, currentQuestionIndex } = get()
        if (!currentQuiz || currentQuestionIndex >= currentQuiz.questions.length - 1) return

        set({ currentQuestionIndex: currentQuestionIndex + 1 })
      },

      previousQuestion: () => {
        const { currentQuestionIndex } = get()
        if (currentQuestionIndex <= 0) return

        set({ currentQuestionIndex: currentQuestionIndex - 1 })
      },

      submitQuiz: () => {
        const user = useAuthStore.getState().user
        const { currentQuiz, currentAnswers, timeRemaining } = get()

        if (!user || !currentQuiz) return null

        // Calculate score
        let score = 0
        currentQuiz.questions.forEach((question) => {
          const userAnswer = currentAnswers[question.id]
          if (userAnswer === question.correctAnswer) {
            score += question.points
          }
        })

        const percentage = Math.round((score / currentQuiz.totalPoints) * 100)
        const timeSpent = currentQuiz.timeLimit * 60 - timeRemaining

        const attempt: QuizAttempt = {
          id: Date.now().toString(),
          quizId: currentQuiz.id,
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          answers: currentAnswers,
          score,
          totalPoints: currentQuiz.totalPoints,
          percentage,
          timeSpent,
          completedAt: new Date(),
          isContest: currentQuiz.isContest,
        }

        set((state) => ({
          attempts: [...state.attempts, attempt],
          currentQuiz: null,
          currentQuestionIndex: 0,
          currentAnswers: {},
          timeRemaining: 0,
          isQuizActive: false,
        }))

        return attempt
      },

      getQuizLeaderboard: (quizId: string) => {
        const attempts = get().attempts.filter((a) => a.quizId === quizId)
        return attempts
          .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score
            return a.timeSpent - b.timeSpent // Faster time wins if same score
          })
          .slice(0, 10)
          .map((attempt, index) => ({
            ...attempt,
            badge:
              index === 0 ? "🥇 Champion" : index === 1 ? "🥈 Runner-up" : index === 2 ? "🥉 Third Place" : undefined,
          }))
      },

      getGlobalLeaderboard: () => {
        const attempts = get().attempts
        const userStats = new Map()

        attempts.forEach((attempt) => {
          const existing = userStats.get(attempt.userId)
          if (!existing || attempt.score > existing.score) {
            userStats.set(attempt.userId, attempt)
          }
        })

        return Array.from(userStats.values())
          .sort((a, b) => b.score - a.score)
          .slice(0, 20)
          .map((attempt, index) => ({
            ...attempt,
            badge:
              index === 0
                ? "👑 Quiz Master"
                : index < 5
                  ? "⭐ Top Performer"
                  : index < 10
                    ? "🎯 High Achiever"
                    : undefined,
          }))
      },

      getUserStats: (userId: string) => {
        const userAttempts = get().attempts.filter((a) => a.userId === userId)
        const totalQuizzes = userAttempts.length
        const averageScore =
          totalQuizzes > 0 ? userAttempts.reduce((sum, a) => sum + a.percentage, 0) / totalQuizzes : 0
        const bestScore = totalQuizzes > 0 ? Math.max(...userAttempts.map((a) => a.percentage)) : 0
        const contestsWon = userAttempts.filter((a) => a.isContest && a.percentage === 100).length

        return {
          totalQuizzes,
          averageScore: Math.round(averageScore),
          bestScore,
          contestsWon,
          totalPoints: userAttempts.reduce((sum, a) => sum + a.score, 0),
        }
      },

      searchQuizzes: (query: string, subject?: string, difficulty?: QuizDifficulty) => {
        const quizzes = get().quizzes
        return quizzes.filter((quiz) => {
          const matchesQuery =
            quiz.title.toLowerCase().includes(query.toLowerCase()) ||
            quiz.description.toLowerCase().includes(query.toLowerCase()) ||
            quiz.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))

          const matchesSubject = !subject || quiz.subject === subject
          const matchesDifficulty = !difficulty || quiz.difficulty === difficulty

          return matchesQuery && matchesSubject && matchesDifficulty
        })
      },
    }),
    {
      name: "brainbuddies-quiz",
    },
  ),
)
