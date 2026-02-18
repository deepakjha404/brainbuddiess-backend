"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useLearningRoomsStore, type LearningRoom } from "@/lib/learning-rooms-store"
import { Video, Mic, MessageSquare, Users, Clock, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

interface RoomCardProps {
  room: LearningRoom
}

export function RoomCard({ room }: RoomCardProps) {
  const { joinRoom } = useLearningRoomsStore()
  const router = useRouter()

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "voice":
        return <Mic className="h-4 w-4" />
      case "text":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "waiting":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "full":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const handleJoinRoom = () => {
    if (room.isPrivate) {
      // In a real app, this would show a password dialog
      const password = prompt("Enter room password:")
      if (!password) return

      const success = joinRoom(room.id, password)
      if (success) {
        router.push(`/learning-rooms/${room.id}`)
      } else {
        alert("Invalid password or room is full")
      }
    } else {
      const success = joinRoom(room.id)
      if (success) {
        router.push(`/learning-rooms/${room.id}`)
      } else {
        alert("Unable to join room - it may be full")
      }
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getRoomTypeIcon(room.type)}
              <CardTitle className="text-lg">{room.title}</CardTitle>
              {room.isPrivate && <Lock className="h-4 w-4 text-muted-foreground" />}
            </div>
            <CardDescription className="text-sm">{room.description}</CardDescription>
          </div>
          <Badge className={getStatusColor(room.status)} variant="secondary">
            {room.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subject and Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{room.subject}</Badge>
          {room.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {room.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{room.tags.length - 2}
            </Badge>
          )}
        </div>

        {/* Host Info */}
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {room.hostName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">Hosted by {room.hostName}</span>
        </div>

        {/* Room Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>
                {room.participants.length}/{room.maxParticipants}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatTimeAgo(room.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Participants Preview */}
        {room.participants.length > 0 && (
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {room.participants.slice(0, 3).map((participant) => (
                <Avatar key={participant.id} className="h-6 w-6 border-2 border-background">
                  <AvatarFallback className="text-xs">
                    {participant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            {room.participants.length > 3 && (
              <span className="text-xs text-muted-foreground">+{room.participants.length - 3} more</span>
            )}
          </div>
        )}

        {/* Join Button */}
        <Button onClick={handleJoinRoom} className="w-full" disabled={room.status === "full"}>
          {room.status === "full" ? "Room Full" : "Join Room"}
        </Button>
      </CardContent>
    </Card>
  )
}
