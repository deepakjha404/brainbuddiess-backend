import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Note {
  id: string
  title: string
  content: string
  subject: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isPinned: boolean
  color: "yellow" | "blue" | "green" | "pink" | "purple" | "orange"
}

interface NotesState {
  notes: Note[]
  searchQuery: string
  selectedSubject: string
  selectedTag: string
  sortBy: "date" | "title" | "subject"
  filteredNotes: Note[]
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  togglePin: (id: string) => void
  setSearchQuery: (query: string) => void
  setSelectedSubject: (subject: string) => void
  setSelectedTag: (tag: string) => void
  setSortBy: (sortBy: "date" | "title" | "subject") => void
  applyFilters: () => void
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [
        {
          id: "1",
          title: "Calculus Integration Rules",
          content: "Key integration formulas:\n∫x^n dx = x^(n+1)/(n+1) + C\n∫e^x dx = e^x + C\n∫1/x dx = ln|x| + C",
          subject: "Mathematics",
          tags: ["calculus", "integration", "formulas"],
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(Date.now() - 86400000),
          isPinned: true,
          color: "blue",
        },
        {
          id: "2",
          title: "Physics - Newton's Laws",
          content:
            "1. Law of Inertia: An object at rest stays at rest\n2. F = ma\n3. For every action, there is an equal and opposite reaction",
          subject: "Physics",
          tags: ["mechanics", "laws", "newton"],
          createdAt: new Date(Date.now() - 172800000),
          updatedAt: new Date(Date.now() - 172800000),
          isPinned: false,
          color: "green",
        },
        {
          id: "3",
          title: "Data Structures - Arrays vs Linked Lists",
          content:
            "Arrays: O(1) access, O(n) insertion/deletion\nLinked Lists: O(n) access, O(1) insertion/deletion at known position",
          subject: "Computer Science",
          tags: ["data-structures", "arrays", "linked-lists"],
          createdAt: new Date(Date.now() - 259200000),
          updatedAt: new Date(Date.now() - 259200000),
          isPinned: false,
          color: "purple",
        },
      ],
      searchQuery: "",
      selectedSubject: "",
      selectedTag: "",
      sortBy: "date",
      filteredNotes: [],

      addNote: (noteData) => {
        const newNote: Note = {
          ...noteData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ notes: [newNote, ...state.notes] }))
        get().applyFilters()
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) => (note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note)),
        }))
        get().applyFilters()
      },

      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter((note) => note.id !== id) }))
        get().applyFilters()
      },

      togglePin: (id) => {
        set((state) => ({
          notes: state.notes.map((note) => (note.id === id ? { ...note, isPinned: !note.isPinned } : note)),
        }))
        get().applyFilters()
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query })
        get().applyFilters()
      },

      setSelectedSubject: (subject) => {
        set({ selectedSubject: subject })
        get().applyFilters()
      },

      setSelectedTag: (tag) => {
        set({ selectedTag: tag })
        get().applyFilters()
      },

      setSortBy: (sortBy) => {
        set({ sortBy })
        get().applyFilters()
      },

      applyFilters: () => {
        const { notes, searchQuery, selectedSubject, selectedTag, sortBy } = get()

        const filtered = notes.filter((note) => {
          const matchesSearch =
            !searchQuery ||
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase())

          const matchesSubject = !selectedSubject || note.subject === selectedSubject
          const matchesTag = !selectedTag || note.tags.includes(selectedTag)

          return matchesSearch && matchesSubject && matchesTag
        })

        // Sort notes
        filtered.sort((a, b) => {
          // Pinned notes always come first
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1

          switch (sortBy) {
            case "title":
              return a.title.localeCompare(b.title)
            case "subject":
              return a.subject.localeCompare(b.subject)
            case "date":
            default: {
              const bDate = typeof b.updatedAt === "string" ? new Date(b.updatedAt) : b.updatedAt;
              const aDate = typeof a.updatedAt === "string" ? new Date(a.updatedAt) : a.updatedAt;
              return bDate.getTime() - aDate.getTime();
            }
          }
        })

        set({ filteredNotes: filtered })
      },
    }),
    {
      name: "notes-storage",
    },
  ),
)
