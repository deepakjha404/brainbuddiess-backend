"use client"

import { useState, useEffect } from "react"
import { Search, Filter, BookOpen, Clock, Users, Star, IndianRupee, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useCourseStore, type Course } from "@/lib/course-store"
import Link from "next/link"

export default function CoursesPage() {
  const { courses, loading, fetchCourses, searchCourses, filterCourses } = useCourseStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    semester: 0,
    priceRange: [0, 6000] as [number, number],
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  useEffect(() => {
    let result = courses

    if (searchQuery) {
      result = searchCourses(searchQuery)
    }

    result = filterCourses({
      category: filters.category || undefined,
      level: filters.level || undefined,
      semester: filters.semester || undefined,
      priceRange: filters.priceRange,
    })

    setFilteredCourses(result)
  }, [searchQuery, filters, courses, searchCourses, filterCourses])

  const categories = [
    "Core Programming",
    "Database Systems",
    "Artificial Intelligence",
    "Web Development",
    "Networks",
    "System Programming",
  ]
  const levels = ["Beginner", "Intermediate", "Advanced"]
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8]

  const clearFilters = () => {
    setFilters({
      category: "",
      level: "",
      semester: 0,
      priceRange: [0, 6000],
    })
    setSearchQuery("")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">B.Tech CSE Courses</h1>
        <p className="text-muted-foreground">
          Master computer science with our comprehensive course catalog designed for B.Tech students
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses, instructors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Level</label>
                <Select
                  value={filters.level}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Semester</label>
                <Select
                  value={filters.semester.toString()}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, semester: Number.parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Semesters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Semesters</SelectItem>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester.toString()}>
                        Semester {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                </label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))}
                  max={6000}
                  min={0}
                  step={100}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredCourses.length} of {courses.length} courses
        </p>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="group hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={course.thumbnail || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90">
                  Semester {course.semester}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Badge
                  variant={
                    course.level === "Beginner"
                      ? "default"
                      : course.level === "Intermediate"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {course.level}
                </Badge>
              </div>
            </div>

            <CardHeader>
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>{course.instructor}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.studentsEnrolled}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm">{course.totalLessons} lessons</span>
                <span className="text-sm">•</span>
                <span className="text-sm">{course.credits} credits</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {course.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <IndianRupee className="h-4 w-4" />
                  <span className="font-bold text-lg">{course.price}</span>
                </div>
                {course.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">₹{course.originalPrice}</span>
                )}
              </div>
              <Link href={`/courses/${course.id}`}>
                <Button>{course.isEnrolled ? "Continue" : "Enroll Now"}</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  )
}
