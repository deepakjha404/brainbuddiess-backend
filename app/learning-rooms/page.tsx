"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { RoomCard } from "@/components/learning-rooms/room-card";
import { CreateRoomDialog } from "@/components/learning-rooms/create-room-dialog";
import { RoomFilters } from "@/components/learning-rooms/room-filters";
import { useLearningRoomsStore } from "@/lib/learning-rooms-store";
import { Video, Mic, Users, Clock, Plus } from "lucide-react";

export default function LearningRoomsPage() {
  const { getRooms } = useLearningRoomsStore();
  const [filteredRooms, setFilteredRooms] = useState(getRooms());

  const totalRooms = getRooms().length;
  const activeRooms = getRooms().filter((r) => r.status === "active").length;
  const totalParticipants = getRooms().reduce(
    (sum, r) => sum + r.participants.length,
    0,
  );
  const videoRooms = getRooms().filter((r) => r.type === "video").length;
  const voiceTextRooms = getRooms().filter(
    (r) => r.type === "voice" || r.type === "text",
  ).length;

  const STATS = [
    {
      label: "Total Rooms",
      value: totalRooms,
      sub: `${activeRooms} currently active`,
      icon: Users,
      color: "#00d4aa",
    },
    {
      label: "Active Participants",
      value: totalParticipants,
      sub: "Across all rooms",
      icon: Clock,
      color: "#38bdf8",
    },
    {
      label: "Video Rooms",
      value: videoRooms,
      sub: "Face-to-face learning",
      icon: Video,
      color: "#c084fc",
    },
    {
      label: "Voice & Text",
      value: voiceTextRooms,
      sub: "Audio & chat rooms",
      icon: Mic,
      color: "#7ee840",
    },
  ];

  return (
    <DashboardLayout>
      <div className="lr-page">
        {/* ── Header ── */}
        <div className="lr-header">
          <div className="lr-header-left">
            <div className="lr-eyebrow">Platform</div>
            <h1 className="lr-title">Learning Rooms</h1>
            <p className="lr-sub">
              Join collaborative study sessions or create your own room.
            </p>
          </div>
          <CreateRoomDialog />
        </div>

        {/* ── Stats ── */}
        <div className="lr-stats-grid">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div className="lr-stat-card" key={s.label}>
                <div className="lr-stat-top">
                  <span className="lr-stat-label">{s.label}</span>
                  <div
                    className="lr-stat-icon"
                    style={{
                      color: s.color,
                      background: s.color + "12",
                      borderColor: s.color + "30",
                    }}
                  >
                    <Icon size={14} />
                  </div>
                </div>
                <div className="lr-stat-val" style={{ color: s.color }}>
                  {s.value}
                </div>
                <div className="lr-stat-sub">{s.sub}</div>
              </div>
            );
          })}
        </div>

        {/* ── Filters ── */}
        <div className="lr-filters-card">
          <div className="lr-filters-head">
            <span className="lr-section-label">Find rooms</span>
          </div>
          <RoomFilters onFilteredRooms={setFilteredRooms} />
        </div>

        {/* ── Rooms Grid ── */}
        <div className="lr-rooms-section">
          <div className="lr-rooms-header">
            <div className="lr-rooms-count">
              Available rooms
              <span className="lr-rooms-badge">{filteredRooms.length}</span>
            </div>
            <div className="lr-legend">
              <div className="lr-legend-item">
                <div
                  className="lr-legend-dot"
                  style={{ background: "#00d4aa" }}
                />{" "}
                Active
              </div>
              <div className="lr-legend-item">
                <div
                  className="lr-legend-dot"
                  style={{ background: "#fbbf24" }}
                />{" "}
                Waiting
              </div>
              <div className="lr-legend-item">
                <div
                  className="lr-legend-dot"
                  style={{ background: "#f87171" }}
                />{" "}
                Full
              </div>
            </div>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="lr-empty">
              <div className="lr-empty-icon">
                <Users size={26} />
              </div>
              <div className="lr-empty-title">No rooms found</div>
              <div className="lr-empty-sub">
                Try adjusting your filters or create a new room to get started.
              </div>
              <CreateRoomDialog />
            </div>
          ) : (
            <div className="lr-rooms-grid">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
