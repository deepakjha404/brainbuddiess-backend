"use client"

import { useEffect, useRef, useState } from "react"
import { useChatStore } from "@/lib/chat-store"
import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { ArrowLeft, MessageCircle, Search, Loader2, Send, User, Shield } from "lucide-react"

export default function RandomChatPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const {
    currentRoom,
    isSearchingForMatch,
    startRandomMatch,
    stopRandomMatch,
    addMessage,
  } = useChatStore()

  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isInRandomRoom = currentRoom?.type === "random"

  useEffect(() => {
    if (currentRoom?.messages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [currentRoom?.messages])

  const handleSendMessage = () => {
    if (!message.trim() || !currentRoom || !user) return
    addMessage(currentRoom.id, {
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content: message.trim(),
      type: "text",
    })
    setMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const RoleBadge = ({ role }: { role: string }) => {
    const color =
      role === "admin"
        ? "bg-red-500"
        : role === "teacher"
        ? "bg-blue-500"
        : role === "volunteer"
        ? "bg-green-500"
        : "bg-purple-500"
    return (
      <Badge variant="secondary" className={`text-xs ${color} text-white`}>
        {role}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {isInRandomRoom && (
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="fixed top-4 left-4 z-50 px-2 py-1 text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Random Chat</h1>
        <p className="text-muted-foreground">Instantly connect with another learner for a quick chat</p>
      </div>

      {/* Search/Match Card */}
      {!isInRandomRoom ? (
        <Card className="bg-card">
          <CardContent className="p-8 text-center space-y-4">
            {isSearchingForMatch ? (
              <>
                <Loader2 className="h-10 w-10 mx-auto animate-spin text-primary" />
                <h3 className="text-xl font-semibold">Searching for a match...</h3>
                <p className="text-muted-foreground">We are finding someone available to chat with you.</p>
                <Button variant="outline" onClick={stopRandomMatch} className="mt-2">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-semibold">Start a random chat</h3>
                <p className="text-muted-foreground">Click below to get paired with another user.</p>
                <Button onClick={startRandomMatch} className="mt-2">
                  <Search className="h-4 w-4 mr-2" /> Find Match
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="h-[70vh] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {currentRoom?.name}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" /> Be respectful • No spam
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentRoom?.messages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        {msg.senderName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{msg.senderName}</span>
                        <RoleBadge role={msg.senderRole} />
                        <span className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm break-words">{msg.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


