import { create } from "zustand"
import { useAuthStore } from "./auth-store"

export type RoomType = "voice" | "video" | "text"
export type RoomStatus = "active" | "waiting" | "full"

export interface Participant {
  id: string
  name: string
  role: "student" | "volunteer" | "teacher" | "admin"
  avatar?: string
  isHost: boolean
  isMuted?: boolean
  hasVideo?: boolean
  joinedAt: Date
}

export interface LearningRoom {
  id: string
  title: string
  description: string
  type: RoomType
  subject: string
  hostId: string
  hostName: string
  participants: Participant[]
  maxParticipants: number
  status: RoomStatus
  createdAt: Date
  tags: string[]
  isPrivate: boolean
  password?: string
}

export interface Message {
  id: string
  userId: string
  userName: string
  userRole: string
  content: string
  timestamp: Date
  type: "text" | "system"
}

interface LearningRoomsState {
  rooms: LearningRoom[]
  currentRoom: LearningRoom | null
  messages: Message[]
  isConnected: boolean
  createRoom: (roomData: Omit<LearningRoom, "id" | "participants" | "status" | "createdAt">) => string
  joinRoom: (roomId: string, password?: string) => boolean
  leaveRoom: () => void
  sendMessage: (content: string) => void
  toggleMute: () => void
  toggleVideo: () => void
  getRooms: () => LearningRoom[]
  searchRooms: (query: string, subject?: string, type?: RoomType) => LearningRoom[]
}

// Mock data
const mockRooms: LearningRoom[] = [
  {
    id: "1",
    title: "Advanced Mathematics Study Group",
    description: "Working through calculus problems together",
    type: "video",
    subject: "Mathematics",
    hostId: "3",
    hostName: "Dr. Mike Teacher",
    participants: [
      {
        id: "3",
        name: "Dr. Mike Teacher",
        role: "teacher",
        isHost: true,
        hasVideo: true,
        joinedAt: new Date(Date.now() - 1800000),
      },
      {
        id: "1",
        name: "Alex Student",
        role: "student",
        isHost: false,
        hasVideo: true,
        joinedAt: new Date(Date.now() - 900000),
      },
      {
        id: "5",
        name: "Emma Wilson",
        role: "student",
        isHost: false,
        hasVideo: false,
        isMuted: true,
        joinedAt: new Date(Date.now() - 600000),
      },
    ],
    maxParticipants: 10,
    status: "active",
    createdAt: new Date(Date.now() - 1800000),
    tags: ["calculus", "homework", "study-group"],
    isPrivate: false,
  },
  {
    id: "2",
    title: "Physics Q&A Session",
    description: "Ask questions about quantum mechanics",
    type: "voice",
    subject: "Physics",
    hostId: "2",
    hostName: "Sarah Volunteer",
    participants: [
      {
        id: "2",
        name: "Sarah Volunteer",
        role: "volunteer",
        isHost: true,
        joinedAt: new Date(Date.now() - 3600000),
      },
      {
        id: "6",
        name: "John Smith",
        role: "student",
        isHost: false,
        isMuted: false,
        joinedAt: new Date(Date.now() - 1200000),
      },
    ],
    maxParticipants: 8,
    status: "active",
    createdAt: new Date(Date.now() - 3600000),
    tags: ["quantum", "physics", "q&a"],
    isPrivate: false,
  },
  {
    id: "3",
    title: "Literature Discussion",
    description: "Discussing Shakespeare's Hamlet",
    type: "text",
    subject: "Literature",
    hostId: "3",
    hostName: "Dr. Mike Teacher",
    participants: [
      {
        id: "3",
        name: "Dr. Mike Teacher",
        role: "teacher",
        isHost: true,
        joinedAt: new Date(Date.now() - 2700000),
      },
      {
        id: "7",
        name: "Lisa Brown",
        role: "student",
        isHost: false,
        joinedAt: new Date(Date.now() - 1800000),
      },
      {
        id: "8",
        name: "Mike Davis",
        role: "student",
        isHost: false,
        joinedAt: new Date(Date.now() - 900000),
      },
    ],
    maxParticipants: 15,
    status: "active",
    createdAt: new Date(Date.now() - 2700000),
    tags: ["shakespeare", "hamlet", "discussion"],
    isPrivate: false,
  },
  {
    id: "4",
    title: "Chemistry Lab Help",
    description: "Need help with organic chemistry reactions",
    type: "video",
    subject: "Chemistry",
    hostId: "9",
    hostName: "Tom Student",
    participants: [
      {
        id: "9",
        name: "Tom Student",
        role: "student",
        isHost: true,
        hasVideo: true,
        joinedAt: new Date(Date.now() - 600000),
      },
    ],
    maxParticipants: 5,
    status: "waiting",
    createdAt: new Date(Date.now() - 600000),
    tags: ["chemistry", "organic", "help"],
    isPrivate: false,
  },
]

export const useLearningRoomsStore = create<LearningRoomsState>((set, get) => ({
  rooms: mockRooms,
  currentRoom: null,
  messages: [],
  isConnected: false,

  createRoom: (roomData) => {
    const user = useAuthStore.getState().user
    if (!user) return ""

    const newRoom: LearningRoom = {
      ...roomData,
      id: Date.now().toString(),
      participants: [
        {
          id: user.id,
          name: user.name,
          role: user.role,
          isHost: true,
          hasVideo: roomData.type === "video",
          joinedAt: new Date(),
        },
      ],
      status: "waiting",
      createdAt: new Date(),
    }

    set((state) => ({
      rooms: [...state.rooms, newRoom],
    }))

    return newRoom.id
  },

  joinRoom: (roomId, password) => {
    const user = useAuthStore.getState().user
    if (!user) return false

    const room = get().rooms.find((r) => r.id === roomId)
    if (!room) return false

    if (room.isPrivate && room.password !== password) return false
    if (room.participants.length >= room.maxParticipants) return false

    const isAlreadyInRoom = room.participants.some((p) => p.id === user.id)
    if (isAlreadyInRoom) {
      set({ currentRoom: room, isConnected: true })
      return true
    }

    const newParticipant: Participant = {
      id: user.id,
      name: user.name,
      role: user.role,
      isHost: false,
      hasVideo: room.type === "video",
      isMuted: false,
      joinedAt: new Date(),
    }

    const updatedRoom = {
      ...room,
      participants: [...room.participants, newParticipant],
      status: "active" as RoomStatus,
    }

    set((state) => ({
      rooms: state.rooms.map((r) => (r.id === roomId ? updatedRoom : r)),
      currentRoom: updatedRoom,
      isConnected: true,
      messages: [
        ...state.messages,
        {
          id: Date.now().toString(),
          userId: "system",
          userName: "System",
          userRole: "system",
          content: `${user.name} joined the room`,
          timestamp: new Date(),
          type: "system",
        },
      ],
    }))

    return true
  },

  leaveRoom: () => {
    const user = useAuthStore.getState().user
    const currentRoom = get().currentRoom
    if (!user || !currentRoom) return

    const updatedParticipants = currentRoom.participants.filter((p) => p.id !== user.id)
    const updatedRoom = {
      ...currentRoom,
      participants: updatedParticipants,
      status: updatedParticipants.length === 0 ? ("waiting" as RoomStatus) : currentRoom.status,
    }

    set((state) => ({
      rooms: state.rooms.map((r) => (r.id === currentRoom.id ? updatedRoom : r)),
      currentRoom: null,
      isConnected: false,
      messages: [
        ...state.messages,
        {
          id: Date.now().toString(),
          userId: "system",
          userName: "System",
          userRole: "system",
          content: `${user.name} left the room`,
          timestamp: new Date(),
          type: "system",
        },
      ],
    }))
  },

  sendMessage: (content) => {
    const user = useAuthStore.getState().user
    if (!user || !get().currentRoom) return

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      content,
      timestamp: new Date(),
      type: "text",
    }

    set((state) => ({
      messages: [...state.messages, newMessage],
    }))
  },

  toggleMute: () => {
    const user = useAuthStore.getState().user
    const currentRoom = get().currentRoom
    if (!user || !currentRoom) return

    const updatedParticipants = currentRoom.participants.map((p) =>
      p.id === user.id ? { ...p, isMuted: !p.isMuted } : p,
    )

    const updatedRoom = { ...currentRoom, participants: updatedParticipants }

    set((state) => ({
      rooms: state.rooms.map((r) => (r.id === currentRoom.id ? updatedRoom : r)),
      currentRoom: updatedRoom,
    }))
  },

  toggleVideo: () => {
    const user = useAuthStore.getState().user
    const currentRoom = get().currentRoom
    if (!user || !currentRoom) return

    const updatedParticipants = currentRoom.participants.map((p) =>
      p.id === user.id ? { ...p, hasVideo: !p.hasVideo } : p,
    )

    const updatedRoom = { ...currentRoom, participants: updatedParticipants }

    set((state) => ({
      rooms: state.rooms.map((r) => (r.id === currentRoom.id ? updatedRoom : r)),
      currentRoom: updatedRoom,
    }))
  },

  getRooms: () => get().rooms,

  searchRooms: (query, subject, type) => {
    const rooms = get().rooms
    return rooms.filter((room) => {
      const matchesQuery =
        room.title.toLowerCase().includes(query.toLowerCase()) ||
        room.description.toLowerCase().includes(query.toLowerCase()) ||
        room.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))

      const matchesSubject = !subject || room.subject === subject
      const matchesType = !type || room.type === type

      return matchesQuery && matchesSubject && matchesType
    })
  },
}))
