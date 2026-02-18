"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useLearningRoomsStore, type RoomType } from "@/lib/learning-rooms-store"
import { Search, Filter, X } from "lucide-react"

interface RoomFiltersProps {
  onFilteredRooms: (rooms: any[]) => void
}

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Literature",
  "History",
  "Computer Science",
  "Art",
  "Music",
  "Other",
]

export function RoomFilters({ onFilteredRooms }: RoomFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<RoomType | "all">("all")
  const [showActiveOnly, setShowActiveOnly] = useState(false)

  const { searchRooms, getRooms } = useLearningRoomsStore()

  const applyFilters = () => {
    let filteredRooms = searchRooms(
      searchQuery,
      selectedSubject === "all" ? undefined : selectedSubject,
      selectedType === "all" ? undefined : selectedType,
    )

    if (showActiveOnly) {
      filteredRooms = filteredRooms.filter((room) => room.status === "active")
    }

    onFilteredRooms(filteredRooms)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedSubject("all")
    setSelectedType("all")
    setShowActiveOnly(false)
    onFilteredRooms(getRooms())
  }

  const hasActiveFilters = searchQuery || selectedSubject !== "all" || selectedType !== "all" || showActiveOnly

  useEffect(() => {
    applyFilters()
  }, [searchQuery, selectedSubject, selectedType, showActiveOnly])

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search rooms by title, description, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={(value: RoomType | "all") => setSelectedType(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="voice">Voice</SelectItem>
            <SelectItem value="text">Text</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={showActiveOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setShowActiveOnly(!showActiveOnly)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Active Only
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary">
              Search: "{searchQuery}"
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
            </Badge>
          )}
          {selectedSubject !== "all" && (
            <Badge variant="secondary">
              Subject: {selectedSubject}
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSelectedSubject("all")} />
            </Badge>
          )}
          {selectedType !== "all" && (
            <Badge variant="secondary">
              Type: {selectedType}
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSelectedType("all")} />
            </Badge>
          )}
          {showActiveOnly && (
            <Badge variant="secondary">
              Active rooms only
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setShowActiveOnly(false)} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
