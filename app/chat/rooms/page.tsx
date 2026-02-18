"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { useChatStore } from "@/lib/chat-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Plus, Users, Shield } from "lucide-react"
import { CreatePrivateRoomDialog } from "@/components/chat/create-private-room-dialog"

export default function ChatRoomsPage() {
  const router = useRouter()
  const { rooms, currentRoom, setCurrentRoom, createPrivateRoom } = useChatStore()

  const publicRooms = useMemo(() => rooms.filter((r) => r.type !== "private"), [rooms])

  const handleJoinRoom = (room: any) => {
    setCurrentRoom(room)
    router.push("/chat/room")
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Chat Rooms</h1>
        <p className="text-muted-foreground">Browse and join active chat rooms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rooms List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Available Rooms
              </CardTitle>
              <div className="flex items-center gap-2">
                <Input placeholder="Search rooms..." className="w-56" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {publicRooms.length === 0 ? (
                <p className="text-sm text-muted-foreground">No rooms available right now.</p>
              ) : (
                publicRooms.map((room) => (
                  <div key={room.id} className="flex items-center justify-between p-3 rounded-md border">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{room.name}</span>
                        {room.type === "dashboard" && (
                          <Badge variant="secondary">Dashboard</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {room.participants.length} online
                        </span>
                        <span>Created {new Date(room.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                                         <div className="flex items-center gap-2">
                       <Button size="sm" variant={currentRoom?.id === room.id ? "default" : "outline"} onClick={() => handleJoinRoom(room)}>
                         {currentRoom?.id === room.id ? "In Room" : "Join"}
                       </Button>
                     </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Create Private Room */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Private Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create a private chat room to talk with a specific person. They'll receive an invitation to join.
              </p>
              <CreatePrivateRoomDialog>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Private Room
                </Button>
              </CreatePrivateRoomDialog>
              <Separator />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" /> Respect others and follow community guidelines.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


