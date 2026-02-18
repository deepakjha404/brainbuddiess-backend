import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderRole: "student" | "volunteer" | "teacher" | "admin"
  content: string
  timestamp: Date
  type: "text" | "image" | "file"
}

export interface ChatRoom {
  id: string
  name: string
  type: "random" | "dashboard" | "private"
  participants: string[]
  messages: ChatMessage[]
  isActive: boolean
  createdAt: Date
}

interface ChatState {
  currentRoom: ChatRoom | null
  rooms: ChatRoom[]
  isSearchingForMatch: boolean
  connectedUsers: string[]
  setCurrentRoom: (room: ChatRoom | null) => void
  addMessage: (roomId: string, message: Omit<ChatMessage, "id" | "timestamp">) => void
  startRandomMatch: () => void
  stopRandomMatch: () => void
  joinDashboardChat: () => void
  createPrivateRoom: (participantId: string, roomName?: string, description?: string) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      currentRoom: null,
      rooms: [
        {
          id: "dashboard-main",
          name: "Dashboard Chat",
          type: "dashboard",
          participants: ["user1", "user2", "user3"],
          messages: [
            {
              id: "1",
              senderId: "user2",
              senderName: "Alex Chen",
              senderRole: "student",
              content: "Hey everyone! Anyone working on the calculus assignment?",
              timestamp: new Date(Date.now() - 3600000),
              type: "text",
            },
            {
              id: "2",
              senderId: "user3",
              senderName: "Sarah Wilson",
              senderRole: "volunteer",
              content: "I can help with calculus! What specific topic are you struggling with?",
              timestamp: new Date(Date.now() - 3000000),
              type: "text",
            },
          ],
          isActive: true,
          createdAt: new Date(Date.now() - 86400000),
        },
      ],
      isSearchingForMatch: false,
      connectedUsers: ["Alex Chen", "Sarah Wilson", "Mike Johnson", "Emma Davis"],

      setCurrentRoom: (room) => set({ currentRoom: room }),

      addMessage: (roomId, messageData) => {
        
        const newMessage: ChatMessage = {
          ...messageData,
          id: Date.now().toString(),
          timestamp: new Date(),
        }

        set((state) => ({
          rooms: state.rooms.map((room) =>
            room.id === roomId ? { ...room, messages: [...room.messages, newMessage] } : room,
          ),
          currentRoom:
            state.currentRoom?.id === roomId
              ? { ...state.currentRoom, messages: [...state.currentRoom.messages, newMessage] }
              : state.currentRoom,
        }))
      },

      startRandomMatch: () => {
        set({ isSearchingForMatch: true })
        // Simulate finding a match after 3 seconds
        setTimeout(() => {
          const matchedRoom: ChatRoom = {
            id: `random-${Date.now()}`,
            name: "Random Chat",
            type: "random",
            participants: ["current-user", "matched-user"],
            messages: [
              {
                id: "1",
                senderId: "matched-user",
                senderName: "Random Student",
                senderRole: "student",
                content: "Hi! Nice to meet you!",
                timestamp: new Date(),
                type: "text",
              },
            ],
            isActive: true,
            createdAt: new Date(),
          }

          set((state) => ({
            isSearchingForMatch: false,
            rooms: [...state.rooms, matchedRoom],
            currentRoom: matchedRoom,
          }))
        }, 3000)
      },

      stopRandomMatch: () => set({ isSearchingForMatch: false }),

      joinDashboardChat: () => {
        const dashboardRoom = get().rooms.find((room) => room.id === "dashboard-main")
        if (dashboardRoom) {
          set({ currentRoom: dashboardRoom })
        }
      },

      createPrivateRoom: (participantId, roomName, description) => {
        const privateRoom: ChatRoom = {
          id: `private-${Date.now()}`,
          name: roomName || `Private Chat with ${participantId}`,
          type: "private",
          participants: ["current-user", participantId],
          messages: [],
          isActive: true,
          createdAt: new Date(),
        }

        set((state) => ({
          rooms: [...state.rooms, privateRoom],
          currentRoom: privateRoom,
        }))
      },
    }),
    {
      name: "chat-storage",
    },
  ),
)
