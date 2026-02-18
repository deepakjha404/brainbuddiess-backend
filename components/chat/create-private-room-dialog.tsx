"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useChatStore } from "@/lib/chat-store"
import { useAuthStore } from "@/lib/auth-store"
import { Plus, Users } from "lucide-react"

interface CreatePrivateRoomDialogProps {
  children: React.ReactNode
}

export function CreatePrivateRoomDialog({ children }: CreatePrivateRoomDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [roomName, setRoomName] = useState("")
  const [participantEmail, setParticipantEmail] = useState("")
  const [description, setDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const { createPrivateRoom } = useChatStore()
  const { user } = useAuthStore()

  const handleCreateRoom = async () => {
    if (!participantEmail.trim() || !user) return

    setIsCreating(true)
    try {
      // Create a unique room name if none provided
      const finalRoomName = roomName.trim() || `Private Chat with ${participantEmail}`
      
      // Create the private room
      createPrivateRoom(participantEmail, finalRoomName, description)
      
      // Reset form
      setRoomName("")
      setParticipantEmail("")
      setDescription("")
      setOpen(false)
      
      // Redirect to room chat page
      router.push("/chat/room")
    } catch (error) {
      console.error("Failed to create private room:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const canCreate = participantEmail.trim() && !isCreating

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Private Chat Room
          </DialogTitle>
          <DialogDescription>
            Create a private chat room to talk with a specific person. They'll receive an invitation to join.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="room-name">Room Name (optional)</Label>
            <Input
              id="room-name"
              placeholder="Enter room name (optional)"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="participant-email">Participant Email</Label>
            <Input
              id="participant-email"
              type="email"
              placeholder="Enter participant's email"
              value={participantEmail}
              onChange={(e) => setParticipantEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What's this chat about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateRoom} disabled={!canCreate}>
            {isCreating ? "Creating..." : "Create Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
