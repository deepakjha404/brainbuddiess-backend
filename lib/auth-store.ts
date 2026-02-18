import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "student" | "volunteer" | "teacher" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  points?: number
  badges?: string[]
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>
  logout: () => void
  forgotPassword: (email: string) => Promise<boolean>
}

// Mock users for demo
const mockUsers = [
  {
    id: "1",
    email: "student@test.com",
    password: "password123",
    name: "Alex Student",
    role: "student" as UserRole,
    points: 1250,
    badges: ["Quick Learner", "Math Whiz"],
  },
  {
    id: "2",
    email: "volunteer@test.com",
    password: "password123",
    name: "Sarah Volunteer",
    role: "volunteer" as UserRole,
    points: 2100,
    badges: ["Helper", "Physics Expert"],
  },
  {
    id: "3",
    email: "teacher@test.com",
    password: "password123",
    name: "Dr. Mike Teacher",
    role: "teacher" as UserRole,
    points: 3500,
    badges: ["Educator", "Mentor"],
  },
  {
    id: "4",
    email: "admin@test.com",
    password: "password123",
    name: "Jane Admin",
    role: "admin" as UserRole,
    points: 5000,
    badges: ["Administrator", "System Expert"],
  },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const user = mockUsers.find((u) => u.email === email && u.password === password)

        if (user) {
          const { password: _, ...userWithoutPassword } = user
          set({ user: userWithoutPassword, isAuthenticated: true, isLoading: false })
          return true
        } else {
          set({ isLoading: false })
          return false
        }
      },

      register: async (email: string, password: string, name: string, role: UserRole) => {
        set({ isLoading: true })

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check if user already exists
        const existingUser = mockUsers.find((u) => u.email === email)
        if (existingUser) {
          set({ isLoading: false })
          return false
        }

        const newUser = {
          id: Date.now().toString(),
          email,
          name,
          role,
          points: 0,
          badges: [],
        }

        set({ user: newUser, isAuthenticated: true, isLoading: false })
        return true
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true })

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        set({ isLoading: false })
        return true // Always return true for demo
      },
    }),
    {
      name: "brainbuddies-auth",
    },
  ),
)
