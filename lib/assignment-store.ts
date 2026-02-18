import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useAuthStore } from "./auth-store"

export type AssignmentStatus = "draft" | "published" | "closed"
export type SubmissionStatus = "pending" | "submitted" | "graded" | "late"
export type AssignmentType = "essay" | "problem-set" | "project" | "quiz" | "presentation" | "other"

export interface Assignment {
  id: string
  title: string
  description: string
  type: AssignmentType
  subject: string
  instructions: string
  dueDate: Date
  maxPoints: number
  status: AssignmentStatus
  createdBy: string
  createdByName: string
  createdAt: Date
  updatedAt: Date
  attachments: AssignmentFile[]
  allowLateSubmissions: boolean
  latePenalty: number // percentage per day
  submissions: Submission[]
}

export interface Submission {
  id: string
  assignmentId: string
  studentId: string
  studentName: string
  submittedAt: Date
  status: SubmissionStatus
  content: string
  attachments: SubmissionFile[]
  grade?: number
  feedback?: string
  gradedAt?: Date
  gradedBy?: string
  gradedByName?: string
  isLate: boolean
}

export interface AssignmentFile {
  id: string
  name: string
  url: string
  size: number
  type: string
}

export interface SubmissionFile {
  id: string
  name: string
  url: string
  size: number
  type: string
}

interface AssignmentState {
  assignments: Assignment[]
  submissions: Submission[]
  createAssignment: (assignmentData: Omit<Assignment, "id" | "createdAt" | "updatedAt" | "submissions">) => string
  updateAssignment: (id: string, updates: Partial<Assignment>) => void
  deleteAssignment: (id: string) => void
  submitAssignment: (assignmentId: string, content: string, attachments: SubmissionFile[]) => string
  gradeSubmission: (submissionId: string, grade: number, feedback?: string) => void
  getAssignment: (id: string) => Assignment | undefined
  getAssignmentsByTeacher: (teacherId: string) => Assignment[]
  getAssignmentsByStudent: (studentId: string) => Assignment[]
  getSubmission: (assignmentId: string, studentId: string) => Submission | undefined
  getSubmissionsByAssignment: (assignmentId: string) => Submission[]
  searchAssignments: (query: string, subject?: string, type?: AssignmentType, status?: AssignmentStatus) => Assignment[]
}

// Mock data
const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Calculus Problem Set #3",
    description: "Solve integration problems using various techniques",
    type: "problem-set",
    subject: "Mathematics",
    instructions:
      "Complete all problems in the attached worksheet. Show all work and explain your reasoning for each step. Pay special attention to problems 5-8 which cover integration by parts.",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    maxPoints: 100,
    status: "published",
    createdBy: "3",
    createdByName: "Dr. Mike Teacher",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    attachments: [
      {
        id: "f1",
        name: "calculus_problems_set3.pdf",
        url: "/files/calculus_problems_set3.pdf",
        size: 245760,
        type: "application/pdf",
      },
    ],
    allowLateSubmissions: true,
    latePenalty: 10,
    submissions: [],
  },
  {
    id: "2",
    title: "Physics Lab Report: Pendulum Motion",
    description: "Analyze pendulum motion data and write a comprehensive lab report",
    type: "project",
    subject: "Physics",
    instructions:
      "Based on the pendulum experiment conducted in class, write a detailed lab report including: hypothesis, methodology, data analysis, results, and conclusions. Include graphs and error analysis.",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    maxPoints: 150,
    status: "published",
    createdBy: "3",
    createdByName: "Dr. Mike Teacher",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    attachments: [
      {
        id: "f2",
        name: "lab_report_template.docx",
        url: "/files/lab_report_template.docx",
        size: 32768,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
      {
        id: "f3",
        name: "pendulum_data.xlsx",
        url: "/files/pendulum_data.xlsx",
        size: 15360,
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
    allowLateSubmissions: false,
    latePenalty: 0,
    submissions: [],
  },
  {
    id: "3",
    title: "Essay: The Great Gatsby Analysis",
    description: "Write a literary analysis essay on themes in The Great Gatsby",
    type: "essay",
    subject: "Literature",
    instructions:
      "Write a 1500-word essay analyzing the major themes in F. Scott Fitzgerald's 'The Great Gatsby'. Focus on at least two themes and support your analysis with specific examples from the text. Use MLA format and include a works cited page.",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    maxPoints: 200,
    status: "published",
    createdBy: "3",
    createdByName: "Dr. Mike Teacher",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    attachments: [],
    allowLateSubmissions: true,
    latePenalty: 5,
    submissions: [],
  },
]

const mockSubmissions: Submission[] = [
  {
    id: "s1",
    assignmentId: "1",
    studentId: "1",
    studentName: "Alex Student",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "graded",
    content: "I have completed all the integration problems. Please see attached work.",
    attachments: [
      {
        id: "sf1",
        name: "alex_calculus_solutions.pdf",
        url: "/submissions/alex_calculus_solutions.pdf",
        size: 180224,
        type: "application/pdf",
      },
    ],
    grade: 85,
    feedback:
      "Good work overall! Your integration by parts solutions are correct, but be more careful with the constant of integration in problems 6-7.",
    gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    gradedBy: "3",
    gradedByName: "Dr. Mike Teacher",
    isLate: false,
  },
  {
    id: "s2",
    assignmentId: "2",
    studentId: "5",
    studentName: "Emma Wilson",
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "submitted",
    content: "Please find my lab report attached. I included all required sections and analysis.",
    attachments: [
      {
        id: "sf2",
        name: "emma_pendulum_report.docx",
        url: "/submissions/emma_pendulum_report.docx",
        size: 245760,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    ],
    isLate: false,
  },
]

export const useAssignmentStore = create<AssignmentState>()(
  persist(
    (set, get) => ({
      assignments: mockAssignments,
      submissions: mockSubmissions,

      createAssignment: (assignmentData) => {
        const user = useAuthStore.getState().user
        if (!user || (user.role !== "teacher" && user.role !== "admin")) return ""

        const newAssignment: Assignment = {
          ...assignmentData,
          id: Date.now().toString(),
          createdBy: user.id,
          createdByName: user.name,
          createdAt: new Date(),
          updatedAt: new Date(),
          submissions: [],
        }

        set((state) => ({
          assignments: [...state.assignments, newAssignment],
        }))

        return newAssignment.id
      },

      updateAssignment: (id, updates) => {
        set((state) => ({
          assignments: state.assignments.map((assignment) =>
            assignment.id === id ? { ...assignment, ...updates, updatedAt: new Date() } : assignment,
          ),
        }))
      },

      deleteAssignment: (id) => {
        set((state) => ({
          assignments: state.assignments.filter((assignment) => assignment.id !== id),
          submissions: state.submissions.filter((submission) => submission.assignmentId !== id),
        }))
      },

      submitAssignment: (assignmentId, content, attachments) => {
        const user = useAuthStore.getState().user
        if (!user || user.role !== "student") return ""

        const assignment = get().assignments.find((a) => a.id === assignmentId)
        if (!assignment) return ""

        const isLate = new Date() > assignment.dueDate
        const status: SubmissionStatus = isLate ? "late" : "submitted"

        const newSubmission: Submission = {
          id: Date.now().toString(),
          assignmentId,
          studentId: user.id,
          studentName: user.name,
          submittedAt: new Date(),
          status,
          content,
          attachments,
          isLate,
        }

        set((state) => ({
          submissions: [...state.submissions, newSubmission],
        }))

        return newSubmission.id
      },

      gradeSubmission: (submissionId, grade, feedback) => {
        const user = useAuthStore.getState().user
        if (!user || (user.role !== "teacher" && user.role !== "admin")) return

        set((state) => ({
          submissions: state.submissions.map((submission) =>
            submission.id === submissionId
              ? {
                  ...submission,
                  grade,
                  feedback,
                  status: "graded" as SubmissionStatus,
                  gradedAt: new Date(),
                  gradedBy: user.id,
                  gradedByName: user.name,
                }
              : submission,
          ),
        }))
      },

      getAssignment: (id) => get().assignments.find((assignment) => assignment.id === id),

      getAssignmentsByTeacher: (teacherId) =>
        get().assignments.filter((assignment) => assignment.createdBy === teacherId),

      getAssignmentsByStudent: (studentId) => {
        const assignments = get().assignments.filter((assignment) => assignment.status === "published")
        const submissions = get().submissions

        return assignments.map((assignment) => {
          const submission = submissions.find((s) => s.assignmentId === assignment.id && s.studentId === studentId)
          return {
            ...assignment,
            submissions: submission ? [submission] : [],
          }
        })
      },

      getSubmission: (assignmentId, studentId) =>
        get().submissions.find(
          (submission) => submission.assignmentId === assignmentId && submission.studentId === studentId,
        ),

      getSubmissionsByAssignment: (assignmentId) =>
        get().submissions.filter((submission) => submission.assignmentId === assignmentId),

      searchAssignments: (query, subject, type, status) => {
        const assignments = get().assignments
        return assignments.filter((assignment) => {
          const matchesQuery =
            assignment.title.toLowerCase().includes(query.toLowerCase()) ||
            assignment.description.toLowerCase().includes(query.toLowerCase()) ||
            assignment.instructions.toLowerCase().includes(query.toLowerCase())

          const matchesSubject = !subject || assignment.subject === subject
          const matchesType = !type || assignment.type === type
          const matchesStatus = !status || assignment.status === status

          return matchesQuery && matchesSubject && matchesType && matchesStatus
        })
      },
    }),
    {
      name: "brainbuddies-assignments",
    },
  ),
)
