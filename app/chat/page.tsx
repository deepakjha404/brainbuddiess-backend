"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useChatStore } from "@/lib/chat-store"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Users, Search, Send, Loader2 } from "lucide-react"

export default function ChatPage() {
  const { user } = useAuthStore()
  const {
    currentRoom,
    rooms,
    isSearchingForMatch,
    connectedUsers,
    setCurrentRoom,
    addMessage,
    startRandomMatch,
    stopRandomMatch,
    joinDashboardChat,
  } = useChatStore()

  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500"
      case "teacher":
        return "bg-blue-500"
      case "volunteer":
        return "bg-green-500"
      case "student":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Chat & Communication</h1>
        <p className="text-muted-foreground">Connect with other students, volunteers, and teachers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Chat Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={joinDashboardChat}
                variant={currentRoom?.type === "dashboard" ? "default" : "outline"}
                className="w-full justify-start"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Dashboard Chat
              </Button>

              <div className="space-y-2">
                <h4 className="font-medium">Random Chat</h4>
                {isSearchingForMatch ? (
                  <div className="space-y-2">
                    <Button onClick={stopRandomMatch} variant="outline" className="w-full bg-transparent">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Cancel Search
                    </Button>
                    <p className="text-sm text-muted-foreground">Searching for a match...</p>
                  </div>
                ) : (
                  <Button onClick={startRandomMatch} variant="outline" className="w-full justify-start bg-transparent">
                    <Search className="h-4 w-4 mr-2" />
                    Find Random Chat
                  </Button>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Online Users ({connectedUsers.length})</h4>
                <div className="space-y-1">
                  {connectedUsers.slice(0, 5).map((username, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {username}
                    </div>
                  ))}
                  {connectedUsers.length > 5 && (
                    <p className="text-xs text-muted-foreground">+{connectedUsers.length - 5} more online</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          {currentRoom ? (
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    {currentRoom.name}
                  </CardTitle>
                  <Badge variant="secondary">{currentRoom.participants.length} participants</Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {currentRoom.messages.map((msg) => (
                      <div key={msg.id} className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            {msg.senderName.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{msg.senderName}</span>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getRoleBadgeColor(msg.senderRole)} text-white`}
                            >
                              {msg.senderRole}
                            </Badge>
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
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <CardContent className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Chat Selected</h3>
                <p className="text-muted-foreground mb-4">Choose a chat option from the sidebar to start messaging</p>
                <Button onClick={joinDashboardChat}>Join Dashboard Chat</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
