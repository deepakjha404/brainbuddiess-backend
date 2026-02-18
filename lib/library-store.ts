import { create } from "zustand"
import { persist } from "zustand/middleware"

export type BookCategory =
  | "Data Structures & Algorithms"
  | "Database Systems"
  | "Operating Systems"
  | "Computer Networks"
  | "Software Engineering"
  | "Object-Oriented Programming"
  | "Web Development"
  | "Machine Learning"
  | "Cybersecurity"
  | "Mathematics for CS"

export type BookFormat = "PDF" | "EPUB" | "DOCX" | "TXT"

export interface Book {
  id: string
  title: string
  author: string
  subject: string
  category: BookCategory
  format: BookFormat
  description: string
  coverImage?: string
  pdfUrl: string
  pages: number
  fileSize: string
  uploadedBy: {
    id: string
    name: string
    role: string
  }
  uploadedAt: string
  downloads: number
  rating: number
  tags: string[]
  semester?: number
  isbn?: string
}

export interface ReadingProgress {
  bookId: string
  currentPage: number
  totalPages: number
  lastReadAt: string
  bookmarks: {
    page: number
    note?: string
    createdAt: string
  }[]
}

export interface WordDefinition {
  word: string
  phonetic?: string
  meanings: {
    partOfSpeech: string
    definitions: {
      definition: string
      example?: string
      synonyms?: string[]
    }[]
  }[]
}

interface LibraryState {
  books: Book[]
  readingProgress: ReadingProgress[]
  isLoading: boolean
  searchQuery: string
  selectedCategory: string
  selectedBook: Book | null
  wordDefinition: WordDefinition | null
  isLoadingDefinition: boolean
  currentPage: number
  totalPages: number
  fetchBooks: () => void
  searchBooks: (query: string) => void
  filterByCategory: (category: string) => void
  selectBook: (book: Book | null) => void
  updateReadingProgress: (bookId: string, currentPage: number) => void
  addBookmark: (bookId: string, page: number, note?: string) => void
  removeBookmark: (bookId: string, page: number) => void
  lookupWord: (word: string) => Promise<void>
  clearDefinition: () => void
  getFilteredBooks: () => Book[]
  setPage: (page: number) => void
}

const mockBooks: Book[] = [
  {
    id: "1",
    title: "Introduction to Algorithms (CLRS)",
    author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
    subject: "Data Structures & Algorithms",
    category: "Data Structures & Algorithms",
    format: "PDF",
    description: "Comprehensive textbook covering fundamental algorithms and data structures used in computer science.",
    coverImage: "/algorithms-clrs.png",
    pdfUrl: "/books/algorithms-clrs.pdf",
    pages: 1312,
    fileSize: "15.2 MB",
    uploadedBy: {
      id: "admin1",
      name: "Dr. Rajesh Kumar",
      role: "admin",
    },
    uploadedAt: "2024-01-15",
    downloads: 1247,
    rating: 4.9,
    tags: ["algorithms", "data-structures", "complexity", "sorting", "graphs"],
    semester: 3,
    isbn: "978-0262033848",
  },
  {
    id: "2",
    title: "Database System Concepts",
    author: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
    subject: "Database Management Systems",
    category: "Database Systems",
    format: "PDF",
    description:
      "Comprehensive introduction to database systems covering relational model, SQL, normalization, and transactions.",
    coverImage: "/database-concepts.png",
    pdfUrl: "/books/database-concepts.pdf",
    pages: 1376,
    fileSize: "18.7 MB",
    uploadedBy: {
      id: "teacher1",
      name: "Prof. Priya Sharma",
      role: "teacher",
    },
    uploadedAt: "2024-01-20",
    downloads: 892,
    rating: 4.7,
    tags: ["database", "SQL", "RDBMS", "normalization", "transactions"],
    semester: 4,
    isbn: "978-0078022159",
  },
  {
    id: "3",
    title: "Operating System Concepts",
    author: "Abraham Silberschatz, Peter Baer Galvin, Greg Gagne",
    subject: "Operating Systems",
    category: "Operating Systems",
    format: "PDF",
    description:
      "Fundamental concepts of operating systems including process management, memory management, and file systems.",
    coverImage: "/os-concepts.png",
    pdfUrl: "/books/os-concepts.pdf",
    pages: 976,
    fileSize: "12.4 MB",
    uploadedBy: {
      id: "teacher2",
      name: "Prof. Anita Desai",
      role: "teacher",
    },
    uploadedAt: "2024-01-25",
    downloads: 1156,
    rating: 4.8,
    tags: ["operating-systems", "processes", "memory", "scheduling", "deadlock"],
    semester: 4,
    isbn: "978-1118063330",
  },
  {
    id: "4",
    title: "Computer Networking: A Top-Down Approach",
    author: "James Kurose, Keith Ross",
    subject: "Computer Networks",
    category: "Computer Networks",
    format: "PDF",
    description:
      "Modern approach to computer networking covering Internet protocols, network security, and wireless networks.",
    coverImage: "/networking-kurose.png",
    pdfUrl: "/books/networking-kurose.pdf",
    pages: 864,
    fileSize: "14.1 MB",
    uploadedBy: {
      id: "teacher3",
      name: "Dr. Vikram Singh",
      role: "teacher",
    },
    uploadedAt: "2024-02-01",
    downloads: 743,
    rating: 4.6,
    tags: ["networking", "protocols", "TCP/IP", "security", "wireless"],
    semester: 5,
    isbn: "978-0133594140",
  },
  {
    id: "5",
    title: "Software Engineering: A Practitioner's Approach",
    author: "Roger S. Pressman, Bruce R. Maxim",
    subject: "Software Engineering",
    category: "Software Engineering",
    format: "PDF",
    description: "Comprehensive guide to software engineering practices, methodologies, and project management.",
    coverImage: "/software-engineering-pressman.png",
    pdfUrl: "/books/software-engineering-pressman.pdf",
    pages: 976,
    fileSize: "16.8 MB",
    uploadedBy: {
      id: "teacher4",
      name: "Sneha Gupta",
      role: "teacher",
    },
    uploadedAt: "2024-02-05",
    downloads: 634,
    rating: 4.5,
    tags: ["software-engineering", "SDLC", "agile", "testing", "project-management"],
    semester: 6,
    isbn: "978-0078022128",
  },
  {
    id: "6",
    title: "Object-Oriented Programming with C++",
    author: "E. Balagurusamy",
    subject: "Object-Oriented Programming",
    category: "Object-Oriented Programming",
    format: "PDF",
    description: "Complete guide to object-oriented programming concepts using C++ with practical examples.",
    coverImage: "/oop-cpp-balagurusamy.png",
    pdfUrl: "/books/oop-cpp-balagurusamy.pdf",
    pages: 512,
    fileSize: "8.9 MB",
    uploadedBy: {
      id: "teacher5",
      name: "Dr. Amit Patel",
      role: "teacher",
    },
    uploadedAt: "2024-02-10",
    downloads: 1089,
    rating: 4.4,
    tags: ["OOP", "C++", "classes", "inheritance", "polymorphism"],
    semester: 3,
    isbn: "978-0070634381",
  },
  {
    id: "7",
    title: "Introduction to Machine Learning",
    author: "Alpaydin Ethem",
    subject: "Machine Learning",
    category: "Machine Learning",
    format: "PDF",
    description: "Comprehensive introduction to machine learning algorithms, techniques, and applications.",
    coverImage: "/ml-alpaydin.png",
    pdfUrl: "/books/ml-alpaydin.pdf",
    pages: 640,
    fileSize: "11.3 MB",
    uploadedBy: {
      id: "teacher6",
      name: "Dr. Amit Patel",
      role: "teacher",
    },
    uploadedAt: "2024-02-15",
    downloads: 567,
    rating: 4.7,
    tags: ["machine-learning", "AI", "algorithms", "neural-networks", "classification"],
    semester: 6,
    isbn: "978-0262012430",
  },
  {
    id: "8",
    title: "Discrete Mathematics and Its Applications",
    author: "Kenneth H. Rosen",
    subject: "Mathematics for Computer Science",
    category: "Mathematics for CS",
    format: "PDF",
    description:
      "Essential mathematical foundations for computer science including logic, sets, functions, and graph theory.",
    coverImage: "/discrete-math-rosen.png",
    pdfUrl: "/books/discrete-math-rosen.pdf",
    pages: 1072,
    fileSize: "13.7 MB",
    uploadedBy: {
      id: "teacher7",
      name: "Dr. Mathematics Prof",
      role: "teacher",
    },
    uploadedAt: "2024-01-10",
    downloads: 923,
    rating: 4.6,
    tags: ["discrete-math", "logic", "sets", "graphs", "combinatorics"],
    semester: 1,
    isbn: "978-0073383095",
  },
  {
    id: "9",
    title: "Web Development with HTML, CSS, and JavaScript",
    author: "Jon Duckett",
    subject: "Web Development",
    category: "Web Development",
    format: "PDF",
    description: "Modern web development techniques covering HTML5, CSS3, JavaScript, and responsive design.",
    coverImage: "/web-dev-duckett.png",
    pdfUrl: "/books/web-dev-duckett.pdf",
    pages: 736,
    fileSize: "45.2 MB",
    uploadedBy: {
      id: "teacher4",
      name: "Sneha Gupta",
      role: "teacher",
    },
    uploadedAt: "2024-02-20",
    downloads: 812,
    rating: 4.5,
    tags: ["web-development", "HTML", "CSS", "JavaScript", "responsive"],
    semester: 5,
    isbn: "978-1118531648",
  },
  {
    id: "10",
    title: "Cybersecurity Fundamentals",
    author: "Charles J. Brooks, Christopher Grow, Philip Craig, Donald Short",
    subject: "Cybersecurity",
    category: "Cybersecurity",
    format: "PDF",
    description: "Comprehensive guide to cybersecurity principles, threats, and defense mechanisms.",
    coverImage: "/cybersecurity-fundamentals.png",
    pdfUrl: "/books/cybersecurity-fundamentals.pdf",
    pages: 592,
    fileSize: "9.8 MB",
    uploadedBy: {
      id: "teacher8",
      name: "Dr. Security Expert",
      role: "teacher",
    },
    uploadedAt: "2024-02-25",
    downloads: 445,
    rating: 4.3,
    tags: ["cybersecurity", "security", "encryption", "threats", "defense"],
    semester: 7,
    isbn: "978-0789759405",
  },
]

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      books: mockBooks,
      readingProgress: [],
      isLoading: false,
      searchQuery: "",
      selectedCategory: "",
      selectedBook: null,
      wordDefinition: null,
      isLoadingDefinition: false,
      currentPage: 1,
      totalPages: Math.ceil(mockBooks.length / 12), // 12 books per page

      fetchBooks: () => {
        set({ isLoading: true })
        // Simulate API call
        setTimeout(() => {
          set({ isLoading: false })
        }, 1000)
      },

      searchBooks: (query: string) => {
        set({ searchQuery: query })
      },

      filterByCategory: (category: string) => {
        set({ selectedCategory: category })
      },

      selectBook: (book: Book | null) => {
        set({ selectedBook: book })
      },

      updateReadingProgress: (bookId: string, currentPage: number) => {
        set((state) => {
          const existingProgress = state.readingProgress.find((p) => p.bookId === bookId)
          const book = state.books.find((b) => b.id === bookId)

          if (existingProgress) {
            return {
              readingProgress: state.readingProgress.map((p) =>
                p.bookId === bookId ? { ...p, currentPage, lastReadAt: new Date().toISOString() } : p,
              ),
            }
          } else if (book) {
            return {
              readingProgress: [
                ...state.readingProgress,
                {
                  bookId,
                  currentPage,
                  totalPages: book.pages,
                  lastReadAt: new Date().toISOString(),
                  bookmarks: [],
                },
              ],
            }
          }
          return state
        })
      },

      addBookmark: (bookId: string, page: number, note?: string) => {
        set((state) => ({
          readingProgress: state.readingProgress.map((p) =>
            p.bookId === bookId
              ? {
                  ...p,
                  bookmarks: [
                    ...p.bookmarks,
                    {
                      page,
                      note,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : p,
          ),
        }))
      },

      removeBookmark: (bookId: string, page: number) => {
        set((state) => ({
          readingProgress: state.readingProgress.map((p) =>
            p.bookId === bookId
              ? {
                  ...p,
                  bookmarks: p.bookmarks.filter((b) => b.page !== page),
                }
              : p,
          ),
        }))
      },

      lookupWord: async (word: string) => {
        set({ isLoadingDefinition: true })

        // Mock dictionary API response
        const mockDefinition: WordDefinition = {
          word: word.toLowerCase(),
          phonetic: `/${word.toLowerCase()}/`,
          meanings: [
            {
              partOfSpeech: "noun",
              definitions: [
                {
                  definition: `A technical term related to computer science: ${word}`,
                  example: `The ${word} is an important concept in computer science.`,
                  synonyms: ["concept", "term", "element"],
                },
              ],
            },
          ],
        }

        setTimeout(() => {
          set({
            wordDefinition: mockDefinition,
            isLoadingDefinition: false,
          })
        }, 1000)
      },

      clearDefinition: () => {
        set({ wordDefinition: null })
      },

      setPage: (page: number) => {
        set({ currentPage: page })
      },

      getFilteredBooks: () => {
        const { books, searchQuery, selectedCategory } = get()

        return books.filter((book) => {
          const matchesSearch =
            !searchQuery ||
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

          const matchesCategory = !selectedCategory || book.category === selectedCategory

          return matchesSearch && matchesCategory
        })
      },
    }),
    {
      name: "library-store",
    },
  ),
)
