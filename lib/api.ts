import axios from "axios"

const API_BASE_URL = "http://localhost:9000"

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("brainbuddies-token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("brainbuddies-token")
      localStorage.removeItem("brainbuddies-auth")
      window.location.href = "/auth/login"
    }
    return Promise.reject(error)
  },
)

// Auth API endpoints
export const authAPI = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),

  register: (email: string, password: string, name: string, role: string) =>
    api.post("/auth/register", { email, password, name, role }),

  forgotPassword: (email: string) => api.post("/auth/forgot-password", { email }),

  getProfile: () => api.get("/auth/profile"),
}

// Volunteer API endpoints
export const volunteerAPI = {
  getQuestions: (page = 1, limit = 10, subject?: string, difficulty?: string) =>
    api.get("/volunteer/questions", { params: { page, limit, subject, difficulty } }),

  submitAnswer: (questionId: string, answer: string) => api.post("/volunteer/answers", { questionId, answer }),

  getLeaderboard: () => api.get("/volunteer/leaderboard"),

  askQuestion: (title: string, description: string, subject: string, difficulty: string) =>
    api.post("/volunteer/questions", { title, description, subject, difficulty }),
}

// Quiz API endpoints
export const quizAPI = {
  getQuizzes: (page = 1, limit = 10, subject?: string, difficulty?: string) =>
    api.get("/quizzes", { params: { page, limit, subject, difficulty } }),

  getQuiz: (id: string) => api.get(`/quizzes/${id}`),

  submitQuiz: (id: string, answers: Record<string, any>) => api.post(`/quizzes/${id}/submit`, { answers }),

  getLeaderboard: (quizId?: string) => api.get("/leaderboard", { params: { quizId } }),
}

// Learning Rooms API endpoints
export const roomsAPI = {
  getRooms: (type?: string, subject?: string) => api.get("/rooms", { params: { type, subject } }),

  createRoom: (name: string, type: string, subject: string, maxParticipants: number) =>
    api.post("/rooms", { name, type, subject, maxParticipants }),

  joinRoom: (id: string) => api.post(`/rooms/${id}/join`),

  leaveRoom: (id: string) => api.post(`/rooms/${id}/leave`),
}

// Library API endpoints
export const libraryAPI = {
  getBooks: (search?: string, subject?: string, page = 1, limit = 10) =>
    api.get("/library", { params: { search, subject, page, limit } }),

  getBook: (id: string) => api.get(`/library/${id}`),
}

// Dictionary API endpoint
export const dictionaryAPI = {
  getDefinition: (word: string) => api.get("/dictionary", { params: { word } }),
}

// Notes API endpoints
export const notesAPI = {
  getApprovedNotes: (subject?: string, page = 1, limit = 10) =>
    api.get("/notes/approved", { params: { subject, page, limit } }),
}

// Assignments API endpoints
export const assignmentsAPI = {
  getAssignments: () => api.get("/assignments"),

  submitAssignment: (id: string, submission: FormData) =>
    api.post(`/assignments/${id}/submit`, submission, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getAssignmentStatus: (id: string) => api.get(`/assignments/${id}/status`),
}

// Feedback API endpoints
export const feedbackAPI = {
  submitFeedback: (message: string, type: string) => api.post("/feedback/submit", { message, type }),

  getAllFeedback: () => api.get("/feedback/all"),
}

// Chat API endpoints
export const chatAPI = {
  getMessages: (roomId?: string) => api.get("/chat/messages", { params: { roomId } }),

  sendMessage: (message: string, roomId?: string) => api.post("/chat/send", { message, roomId }),
}

// Random Chat API endpoint
export const randomChatAPI = {
  startRandomChat: () => api.post("/random-chat/start"),
}
