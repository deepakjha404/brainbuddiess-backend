"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter } from "lucide-react"
import { AssignmentCard } from "@/components/assignments/assignment-card"
import { CreateAssignmentDialog } from "@/components/assignments/create-assignment-dialog"
import { useAssignmentStore, type AssignmentType, type AssignmentStatus } from "@/lib/assignment-store"
import { useAuthStore } from "@/lib/auth-store"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function AssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string>("All")
  const [selectedType, setSelectedType] = useState<AssignmentType | "All">("All")
  const [selectedStatus, setSelectedStatus] = useState<AssignmentStatus | "All">("All")
  const [filteredAssignments, setFilteredAssignments] = useState<any[]>([])

  const { assignments, searchAssignments, getAssignmentsByTeacher, getAssignmentsByStudent } = useAssignmentStore()
  const { user } = useAuthStore()

  const subjects = [
    "All",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Literature",
    "History",
    "Computer Science",
    "Philosophy",
    "Art",
    "Other",
  ]
  const types: (AssignmentType | "All")[] = ["All", "essay", "problem-set", "project", "quiz", "presentation", "other"]
  const statuses: (AssignmentStatus | "All")[] = ["All", "published", "draft", "closed"]

  useEffect(() => {
    if (!user) return

    let results: any[] = []

    if (user.role === "student") {
      results = getAssignmentsByStudent(user.id)
    } else if (user.role === "teacher" || user.role === "admin") {
      results = user.role === "teacher" ? getAssignmentsByTeacher(user.id) : assignments
    }

    if (searchQuery || selectedSubject !== "All" || selectedType !== "All" || selectedStatus !== "All") {
      results = searchAssignments(
        searchQuery,
        selectedSubject === "All" ? undefined : selectedSubject,
        selectedType === "All" ? undefined : selectedType,
        selectedStatus === "All" ? undefined : selectedStatus,
      ).filter((assignment) => {
        if (user.role === "student") {
          return assignment.status === "published"
        } else if (user.role === "teacher") {
          return assignment.createdBy === user.id
        }
        return true
      })
    }

    setFilteredAssignments(results)
  }, [
    searchQuery,
    selectedSubject,
    selectedType,
    selectedStatus,
    assignments,
    user,
    searchAssignments,
    getAssignmentsByTeacher,
    getAssignmentsByStudent,
  ])

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedSubject("All")
    setSelectedType("All")
    setSelectedStatus("All")
  }

  const getUpcomingAssignments = () => {
    return filteredAssignments.filter((assignment) => {
      const daysUntilDue = Math.ceil((assignment.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return daysUntilDue >= 0 && daysUntilDue <= 7
    })
  }

  const getOverdueAssignments = () => {
    return filteredAssignments.filter((assignment) => new Date() > assignment.dueDate)
  }

  if (!user) return null

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Assignments</h1>
            <p className="text-muted-foreground mt-1">
              {user.role === "student" ? "View and submit your assignments" : "Manage and grade assignments"}
            </p>
          </div>
          {(user.role === "teacher" || user.role === "admin") && (
            <CreateAssignmentDialog>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </CreateAssignmentDialog>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 p-4 bg-muted/50 rounded-lg mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as AssignmentType | "All")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "All" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(user.role === "teacher" || user.role === "admin") && (
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as AssignmentStatus | "All")}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "All" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button variant="outline" onClick={handleClearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Content */}
        {user.role === "student" ? (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Assignments ({filteredAssignments.length})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming ({getUpcomingAssignments().length})</TabsTrigger>
              <TabsTrigger value="overdue">Overdue ({getOverdueAssignments().length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredAssignments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No assignments found</p>
                </div>
              ) : (
                filteredAssignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} showSubmissionStatus={true} />
                ))
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              {getUpcomingAssignments().length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No upcoming assignments</p>
                </div>
              ) : (
                getUpcomingAssignments().map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} showSubmissionStatus={true} />
                ))
              )}
            </TabsContent>

            <TabsContent value="overdue" className="space-y-4">
              {getOverdueAssignments().length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No overdue assignments</p>
                </div>
              ) : (
                getOverdueAssignments().map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} showSubmissionStatus={true} />
                ))
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            {filteredAssignments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">No assignments found</p>
                <CreateAssignmentDialog>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Assignment
                  </Button>
                </CreateAssignmentDialog>
              </div>
            ) : (
              filteredAssignments.map((assignment) => <AssignmentCard key={assignment.id} assignment={assignment} />)
            )}
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
