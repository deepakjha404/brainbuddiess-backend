"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLearningRoomsStore } from "@/lib/learning-rooms-store";
import { useAuthStore } from "@/lib/auth-store";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MessageSquare,
  Users,
  Settings,
  Phone,
  Send,
  Crown,
  LogOut,
  Hash,
} from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  student: "#60a5fa",
  volunteer: "#7ee840",
  teacher: "#c084fc",
  admin: "#fb923c",
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const {
    currentRoom,
    messages,
    leaveRoom,
    sendMessage,
    toggleMute,
    toggleVideo,
  } = useLearningRoomsStore();
  const { user } = useAuthStore();

  const [messageInput, setMessageInput] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");

  useEffect(() => {
    if (!currentRoom || currentRoom.id !== roomId)
      router.push("/learning-rooms");
  }, [currentRoom, roomId, router]);

  if (!currentRoom || !user) return null;

  const currentParticipant = currentRoom.participants.find(
    (p) => p.id === user.id,
  );
  const isHost = currentParticipant?.isHost ?? false;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      sendMessage(messageInput.trim());
      setMessageInput("");
    }
  };
  const handleLeaveRoom = () => {
    leaveRoom();
    router.push("/learning-rooms");
  };

  const isAV = currentRoom.type === "video" || currentRoom.type === "voice";

  return (
    <DashboardLayout>
      <div className="rp-page">
        {/* ── Header ── */}
        <div className="rp-header">
          <div className="rp-header-left">
            <div className="rp-room-type-tag">
              {currentRoom.type === "video" ? (
                <Video size={11} />
              ) : currentRoom.type === "voice" ? (
                <Mic size={11} />
              ) : (
                <Hash size={11} />
              )}
              {currentRoom.type} room
            </div>
            <h1 className="rp-title">{currentRoom.title}</h1>
            <p className="rp-desc">{currentRoom.description}</p>
            <div className="rp-tags">
              <span className="rp-tag rp-tag-subject">
                {currentRoom.subject}
              </span>
              {currentRoom.tags.map((tag) => (
                <span key={tag} className="rp-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button className="rp-leave-btn" onClick={handleLeaveRoom}>
            <LogOut size={14} /> Leave room
          </button>
        </div>

        {/* ── Main layout ── */}
        <div className="rp-layout">
          {/* ── Left: AV + Chat ── */}
          <div className="rp-main">
            {/* Video / Voice area */}
            {isAV && (
              <div className="rp-av-card">
                <div className="rp-card-head">
                  {currentRoom.type === "video" ? (
                    <Video size={14} />
                  ) : (
                    <Mic size={14} />
                  )}
                  {currentRoom.type === "video"
                    ? "Video Conference"
                    : "Voice Chat"}
                </div>

                {/* Participant tiles */}
                <div className="rp-video-grid">
                  {currentRoom.participants.map((p) => (
                    <div key={p.id} className="rp-video-tile">
                      {currentRoom.type === "video" && p.hasVideo ? (
                        <div className="rp-video-placeholder">
                          <span>{p.name}'s video</span>
                        </div>
                      ) : (
                        <div
                          className="rp-avatar-tile"
                          style={{
                            borderColor:
                              (ROLE_COLORS[p.role] ?? "#00d4aa") + "44",
                            background:
                              (ROLE_COLORS[p.role] ?? "#00d4aa") + "10",
                          }}
                        >
                          <span
                            style={{ color: ROLE_COLORS[p.role] ?? "#00d4aa" }}
                          >
                            {p.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </span>
                        </div>
                      )}
                      <div className="rp-tile-overlay">
                        <div className="rp-tile-name">
                          {p.isHost && (
                            <Crown size={10} style={{ color: "#fbbf24" }} />
                          )}
                          <span>{p.name}</span>
                        </div>
                        <div className="rp-tile-icons">
                          {p.isMuted ? (
                            <MicOff size={11} style={{ color: "#f87171" }} />
                          ) : (
                            <Mic size={11} style={{ color: "#00d4aa" }} />
                          )}
                          {currentRoom.type === "video" &&
                            (p.hasVideo ? (
                              <Video size={11} style={{ color: "#00d4aa" }} />
                            ) : (
                              <VideoOff
                                size={11}
                                style={{ color: "#f87171" }}
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <div className="rp-controls">
                  <button
                    className={`rp-ctrl-btn ${currentParticipant?.isMuted ? "rp-ctrl-danger" : "rp-ctrl-normal"}`}
                    onClick={toggleMute}
                  >
                    {currentParticipant?.isMuted ? (
                      <MicOff size={18} />
                    ) : (
                      <Mic size={18} />
                    )}
                  </button>
                  {currentRoom.type === "video" && (
                    <button
                      className={`rp-ctrl-btn ${currentParticipant?.hasVideo ? "rp-ctrl-normal" : "rp-ctrl-danger"}`}
                      onClick={toggleVideo}
                    >
                      {currentParticipant?.hasVideo ? (
                        <Video size={18} />
                      ) : (
                        <VideoOff size={18} />
                      )}
                    </button>
                  )}
                  <button
                    className="rp-ctrl-btn rp-ctrl-danger rp-ctrl-leave"
                    onClick={handleLeaveRoom}
                  >
                    <Phone size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Chat */}
            <div className="rp-chat-card">
              <div className="rp-card-head">
                <MessageSquare size={14} /> Chat
              </div>
              <ScrollArea className="rp-chat-scroll">
                <div className="rp-chat-messages">
                  {messages.map((msg) =>
                    msg.type === "system" ? (
                      <div key={msg.id} className="rp-msg-system">
                        {msg.content}
                      </div>
                    ) : (
                      <div key={msg.id} className="rp-msg">
                        <div className="rp-msg-meta">
                          <span
                            className="rp-msg-role"
                            style={{
                              color: ROLE_COLORS[msg.userRole] ?? "#00d4aa",
                              borderColor:
                                (ROLE_COLORS[msg.userRole] ?? "#00d4aa") + "35",
                              background:
                                (ROLE_COLORS[msg.userRole] ?? "#00d4aa") + "10",
                            }}
                          >
                            {msg.userRole}
                          </span>
                          <span className="rp-msg-name">{msg.userName}</span>
                          <span className="rp-msg-time">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <p className="rp-msg-text">{msg.content}</p>
                      </div>
                    ),
                  )}
                </div>
              </ScrollArea>
              <form className="rp-chat-form" onSubmit={handleSendMessage}>
                <input
                  className="rp-chat-input"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <button type="submit" className="rp-chat-send">
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="rp-sidebar">
            {/* Participants */}
            <div className="rp-side-card">
              <div className="rp-card-head">
                <Users size={14} />
                Participants
                <span className="rp-part-count">
                  {currentRoom.participants.length}/
                  {currentRoom.maxParticipants}
                </span>
              </div>
              <div className="rp-participants">
                {currentRoom.participants.map((p) => {
                  const rc = ROLE_COLORS[p.role] ?? "#00d4aa";
                  return (
                    <div key={p.id} className="rp-participant">
                      <div
                        className="rp-part-avatar"
                        style={{
                          borderColor: rc + "44",
                          background: rc + "10",
                          color: rc,
                        }}
                      >
                        {p.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                      <div className="rp-part-info">
                        <div className="rp-part-name">
                          {p.isHost && (
                            <Crown size={10} style={{ color: "#fbbf24" }} />
                          )}
                          {p.name}
                        </div>
                        <div className="rp-part-role" style={{ color: rc }}>
                          {p.role}
                        </div>
                      </div>
                      <div className="rp-part-status">
                        {p.isMuted ? (
                          <MicOff size={12} style={{ color: "#f87171" }} />
                        ) : (
                          <Mic size={12} style={{ color: "#00d4aa" }} />
                        )}
                        {currentRoom.type === "video" &&
                          (p.hasVideo ? (
                            <Video size={12} style={{ color: "#00d4aa" }} />
                          ) : (
                            <VideoOff size={12} style={{ color: "#f87171" }} />
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Room Info */}
            <div className="rp-side-card">
              <div className="rp-card-head">Room info</div>
              <div className="rp-info-rows">
                <div className="rp-info-row">
                  <span className="rp-info-key">Host</span>
                  <span className="rp-info-val">{currentRoom.hostName}</span>
                </div>
                <div className="rp-info-sep" />
                <div className="rp-info-row">
                  <span className="rp-info-key">Type</span>
                  <span
                    className="rp-info-val"
                    style={{ textTransform: "capitalize" }}
                  >
                    {currentRoom.type}
                  </span>
                </div>
                <div className="rp-info-sep" />
                <div className="rp-info-row">
                  <span className="rp-info-key">Created</span>
                  <span className="rp-info-val">
                    {currentRoom.createdAt.toLocaleDateString()}{" "}
                    {currentRoom.createdAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              {isHost && (
                <button className="rp-settings-btn">
                  <Settings size={13} /> Room settings
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
