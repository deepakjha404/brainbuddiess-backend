import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorAvatar: string
  price: number
  originalPrice?: number
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  category: string
  semester: number
  credits: number
  thumbnail: string
  rating: number
  studentsEnrolled: number
  totalLessons: number
  completedLessons?: number
  progress?: number
  isEnrolled?: boolean
  isPurchased?: boolean
  syllabus: string[]
  prerequisites: string[]
  learningOutcomes: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Enrollment {
  id: string
  courseId: string
  userId: string
  enrolledAt: string
  progress: number
  completedLessons: number
  lastAccessedAt: string
  certificateIssued?: boolean
  certificateId?: string
  paymentStatus: "pending" | "completed" | "failed"
  paymentId?: string
}

export interface Certificate {
  id: string
  courseId: string
  userId: string
  courseName: string
  studentName: string
  completionDate: string
  grade: string
  instructorName: string
}

interface CourseState {
  courses: Course[]
  enrollments: Enrollment[]
  certificates: Certificate[]
  selectedCourse: Course | null
  loading: boolean
  error: string | null

  // Actions
  fetchCourses: () => void
  getCourse: (id: string) => Course | undefined
  enrollInCourse: (courseId: string) => Promise<boolean>
  updateProgress: (courseId: string, progress: number, completedLessons: number) => void
  getEnrolledCourses: () => Course[]
  generateCertificate: (courseId: string) => Certificate | null
  searchCourses: (query: string) => Course[]
  filterCourses: (filters: {
    category?: string
    level?: string
    semester?: number
    priceRange?: [number, number]
  }) => Course[]
}

// Mock B.Tech CSE courses data
const mockCourses: Course[] = [
  {
    id: "1",
    title: "Data Structures and Algorithms",
    description:
      "Master fundamental data structures and algorithms essential for software development and competitive programming.",
    instructor: "Dr. Rajesh Kumar",
    instructorAvatar: "/placeholder.svg?height=40&width=40",
    price: 2999,
    originalPrice: 4999,
    duration: "12 weeks",
    level: "Intermediate",
    category: "Core Programming",
    semester: 3,
    credits: 4,
    thumbnail: "/data-structures-visual.png",
    rating: 4.8,
    studentsEnrolled: 1250,
    totalLessons: 48,
    syllabus: [
      "Arrays and Strings",
      "Linked Lists",
      "Stacks and Queues",
      "Trees and Binary Search Trees",
      "Graphs and Graph Algorithms",
      "Dynamic Programming",
      "Sorting and Searching",
      "Hash Tables",
    ],
    prerequisites: ["Programming Fundamentals", "Mathematics for CS"],
    learningOutcomes: [
      "Implement complex data structures",
      "Analyze algorithm complexity",
      "Solve coding interview problems",
      "Optimize program performance",
    ],
    tags: ["DSA", "Programming", "Algorithms", "Problem Solving"],
    createdAt: "2024-01-15",
    updatedAt: "2024-03-10",
  },
  {
    id: "2",
    title: "Database Management Systems",
    description: "Comprehensive course on database design, SQL, and modern database technologies.",
    instructor: "Prof. Priya Sharma",
    instructorAvatar: "/placeholder.svg?height=40&width=40",
    price: 2499,
    originalPrice: 3999,
    duration: "10 weeks",
    level: "Intermediate",
    category: "Database Systems",
    semester: 4,
    credits: 3,
    thumbnail: "/database-management.png",
    rating: 4.7,
    studentsEnrolled: 980,
    totalLessons: 35,
    syllabus: [
      "Database Fundamentals",
      "ER Modeling",
      "Relational Model",
      "SQL Queries",
      "Normalization",
      "Transactions and Concurrency",
      "NoSQL Databases",
      "Database Security",
    ],
    prerequisites: ["Programming Fundamentals"],
    learningOutcomes: [
      "Design efficient database schemas",
      "Write complex SQL queries",
      "Understand ACID properties",
      "Work with NoSQL databases",
    ],
    tags: ["SQL", "Database", "RDBMS", "NoSQL"],
    createdAt: "2024-01-20",
    updatedAt: "2024-03-05",
  },
  {
    id: "3",
    title: "Machine Learning Fundamentals",
    description: "Introduction to machine learning algorithms, implementation, and real-world applications.",
    instructor: "Dr. Amit Patel",
    instructorAvatar: "/placeholder.svg?height=40&width=40",
    price: 3999,
    originalPrice: 5999,
    duration: "14 weeks",
    level: "Advanced",
    category: "Artificial Intelligence",
    semester: 6,
    credits: 4,
    thumbnail: "/machine-learning-concept.png",
    rating: 4.9,
    studentsEnrolled: 750,
    totalLessons: 56,
    syllabus: [
      "Introduction to ML",
      "Linear Regression",
      "Classification Algorithms",
      "Decision Trees",
      "Neural Networks",
      "Deep Learning Basics",
      "Model Evaluation",
      "Feature Engineering",
    ],
    prerequisites: ["Statistics", "Linear Algebra", "Python Programming"],
    learningOutcomes: [
      "Build ML models from scratch",
      "Evaluate model performance",
      "Apply ML to real problems",
      "Understand deep learning concepts",
    ],
    tags: ["ML", "AI", "Python", "Deep Learning"],
    createdAt: "2024-02-01",
    updatedAt: "2024-03-15",
  },
  {
    id: "4",
    title: "Web Development with React",
    description: "Modern web development using React, Node.js, and full-stack technologies.",
    instructor: "Sneha Gupta",
    instructorAvatar: "/placeholder.svg?height=40&width=40",
    price: 2799,
    originalPrice: 4299,
    duration: "11 weeks",
    level: "Intermediate",
    category: "Web Development",
    semester: 5,
    credits: 3,
    thumbnail: "/react-web-development.png",
    rating: 4.6,
    studentsEnrolled: 1100,
    totalLessons: 42,
    syllabus: [
      "HTML/CSS/JavaScript",
      "React Fundamentals",
      "State Management",
      "React Router",
      "Node.js Backend",
      "Database Integration",
      "Authentication",
      "Deployment",
    ],
    prerequisites: ["Programming Fundamentals", "JavaScript Basics"],
    learningOutcomes: [
      "Build responsive web applications",
      "Create RESTful APIs",
      "Implement user authentication",
      "Deploy full-stack applications",
    ],
    tags: ["React", "JavaScript", "Node.js", "Full Stack"],
    createdAt: "2024-01-25",
    updatedAt: "2024-03-08",
  },
  {
    id: "5",
    title: "Computer Networks",
    description: "Understanding network protocols, architecture, and security in modern computing.",
    instructor: "Dr. Vikram Singh",
    instructorAvatar: "/placeholder.svg?height=40&width=40",
    price: 2299,
    originalPrice: 3499,
    duration: "9 weeks",
    level: "Intermediate",
    category: "Networks",
    semester: 5,
    credits: 3,
    thumbnail: "/computer-networks.png",
    rating: 4.5,
    studentsEnrolled: 850,
    totalLessons: 32,
    syllabus: [
      "Network Fundamentals",
      "OSI Model",
      "TCP/IP Protocol Suite",
      "Routing Algorithms",
      "Network Security",
      "Wireless Networks",
      "Network Performance",
      "Modern Protocols",
    ],
    prerequisites: ["Computer Organization"],
    learningOutcomes: [
      "Understand network protocols",
      "Configure network devices",
      "Analyze network performance",
      "Implement network security",
    ],
    tags: ["Networking", "Protocols", "Security", "TCP/IP"],
    createdAt: "2024-02-10",
    updatedAt: "2024-03-12",
  },
  {
    id: "6",
    title: "Operating Systems",
    description: "Deep dive into OS concepts, process management, memory management, and system calls.",
    instructor: "Prof. Anita Desai",
    instructorAvatar: "/placeholder.svg?height=40&width=40",
    price: 2599,
    originalPrice: 3799,
    duration: "10 weeks",
    level: "Intermediate",
    category: "System Programming",
    semester: 4,
    credits: 4,
    thumbnail: "/operating-systems-concept.png",
    rating: 4.7,
    studentsEnrolled: 920,
    totalLessons: 38,
    syllabus: [
      "OS Introduction",
      "Process Management",
      "CPU Scheduling",
      "Memory Management",
      "File Systems",
      "I/O Systems",
      "Deadlocks",
      "Security and Protection",
    ],
    prerequisites: ["Computer Organization", "C Programming"],
    learningOutcomes: [
      "Understand OS internals",
      "Implement system programs",
      "Analyze system performance",
      "Work with system calls",
    ],
    tags: ["OS", "System Programming", "Processes", "Memory"],
    createdAt: "2024-01-30",
    updatedAt: "2024-03-07",
  },
]

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      courses: mockCourses,
      enrollments: [],
      certificates: [],
      selectedCourse: null,
      loading: false,
      error: null,

      fetchCourses: () => {
        set({ loading: true, error: null })
        // Simulate API call
        setTimeout(() => {
          set({ courses: mockCourses, loading: false })
        }, 1000)
      },

      getCourse: (id: string) => {
        return get().courses.find((course) => course.id === id)
      },

      enrollInCourse: async (courseId: string): Promise<boolean> => {
        set({ loading: true, error: null })

        try {
          // Simulate payment processing
          await new Promise((resolve) => setTimeout(resolve, 2000))

          const enrollment: Enrollment = {
            id: `enrollment-${Date.now()}`,
            courseId,
            userId: "current-user",
            enrolledAt: new Date().toISOString(),
            progress: 0,
            completedLessons: 0,
            lastAccessedAt: new Date().toISOString(),
            paymentStatus: "completed",
            paymentId: `payment-${Date.now()}`,
          }

          set((state) => ({
            enrollments: [...state.enrollments, enrollment],
            courses: state.courses.map((course) =>
              course.id === courseId
                ? { ...course, isEnrolled: true, isPurchased: true, progress: 0, completedLessons: 0 }
                : course,
            ),
            loading: false,
          }))

          return true
        } catch (error) {
          set({ error: "Enrollment failed. Please try again.", loading: false })
          return false
        }
      },

      updateProgress: (courseId: string, progress: number, completedLessons: number) => {
        set((state) => ({
          enrollments: state.enrollments.map((enrollment) =>
            enrollment.courseId === courseId
              ? { ...enrollment, progress, completedLessons, lastAccessedAt: new Date().toISOString() }
              : enrollment,
          ),
          courses: state.courses.map((course) =>
            course.id === courseId ? { ...course, progress, completedLessons } : course,
          ),
        }))

        // Auto-generate certificate if course is completed
        if (progress >= 100) {
          get().generateCertificate(courseId)
        }
      },

      getEnrolledCourses: () => {
        const { courses, enrollments } = get()
        return courses.filter((course) => enrollments.some((enrollment) => enrollment.courseId === course.id))
      },

      generateCertificate: (courseId: string): Certificate | null => {
        const { courses, enrollments, certificates } = get()
        const course = courses.find((c) => c.id === courseId)
        const enrollment = enrollments.find((e) => e.courseId === courseId)

        if (!course || !enrollment || enrollment.progress < 100) {
          return null
        }

        // Check if certificate already exists
        const existingCert = certificates.find((c) => c.courseId === courseId && c.userId === "current-user")
        if (existingCert) {
          return existingCert
        }

        const certificate: Certificate = {
          id: `cert-${Date.now()}`,
          courseId,
          userId: "current-user",
          courseName: course.title,
          studentName: "Current User", // This would come from auth store
          completionDate: new Date().toISOString(),
          grade: "A", // This could be calculated based on performance
          instructorName: course.instructor,
        }

        set((state) => ({
          certificates: [...state.certificates, certificate],
          enrollments: state.enrollments.map((e) =>
            e.courseId === courseId ? { ...e, certificateIssued: true, certificateId: certificate.id } : e,
          ),
        }))

        return certificate
      },

      searchCourses: (query: string) => {
        const { courses } = get()
        if (!query.trim()) return courses

        return courses.filter(
          (course) =>
            course.title.toLowerCase().includes(query.toLowerCase()) ||
            course.description.toLowerCase().includes(query.toLowerCase()) ||
            course.instructor.toLowerCase().includes(query.toLowerCase()) ||
            course.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
        )
      },

      filterCourses: (filters) => {
        const { courses } = get()
        return courses.filter((course) => {
          if (filters.category && course.category !== filters.category) return false
          if (filters.level && course.level !== filters.level) return false
          if (filters.semester && course.semester !== filters.semester) return false
          if (filters.priceRange) {
            const [min, max] = filters.priceRange
            if (course.price < min || course.price > max) return false
          }
          return true
        })
      },
    }),
    {
      name: "course-store",
    },
  ),
)
