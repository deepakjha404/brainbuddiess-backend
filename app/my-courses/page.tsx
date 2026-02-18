"use client"

import { useState, useEffect } from "react"
import { Play, Clock, BookOpen, Award, Download, MoreVertical, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCourseStore } from "@/lib/course-store"
import Link from "next/link"

export default function MyCoursesPage() {
  const { getEnrolledCourses, certificates, updateProgress } = useCourseStore()
  const [enrolledCourses, setEnrolledCourses] = useState(getEnrolledCourses())

  useEffect(() => {
    setEnrolledCourses(getEnrolledCourses())
  }, [getEnrolledCourses])

  const inProgressCourses = enrolledCourses.filter((course) => (course.progress || 0) < 100)
  const completedCourses = enrolledCourses.filter((course) => (course.progress || 0) >= 100)

  const handleContinueLearning = (courseId: string) => {
    // Simulate progress update
    const currentCourse = enrolledCourses.find((c) => c.id === courseId)
    if (currentCourse) {
      const newProgress = Math.min((currentCourse.progress || 0) + 10, 100)
      const newCompletedLessons = Math.floor((newProgress / 100) * currentCourse.totalLessons)
      updateProgress(courseId, newProgress, newCompletedLessons)
      setEnrolledCourses(getEnrolledCourses())
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Courses</h1>
        <p className="text-muted-foreground">Continue your learning journey and track your progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">{enrolledCourses.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{inProgressCourses.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedCourses.length}</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Certificates</p>
                <p className="text-2xl font-bold">{certificates.length}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Courses ({enrolledCourses.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgressCourses.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedCourses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <CourseGrid courses={enrolledCourses} onContinue={handleContinueLearning} certificates={certificates} />
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          <CourseGrid courses={inProgressCourses} onContinue={handleContinueLearning} certificates={certificates} />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <CourseGrid courses={completedCourses} onContinue={handleContinueLearning} certificates={certificates} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CourseGrid({ courses, onContinue, certificates }: any) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No courses found</h3>
        <p className="text-muted-foreground mb-4">Start learning by enrolling in courses from our catalog</p>
        <Link href="/courses">
          <Button>Browse Courses</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course: any) => {
        const certificate = certificates.find((cert: any) => cert.courseId === course.id)
        const progress = course.progress || 0
        const isCompleted = progress >= 100

        return (
          <Card key={course.id} className="group hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={course.thumbnail || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="bg-white/90">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Download Resources
                    </DropdownMenuItem>
                    {certificate && (
                      <DropdownMenuItem>
                        <Award className="h-4 w-4 mr-2" />
                        Download Certificate
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {isCompleted && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-500">
                    <Award className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              )}
            </div>

            <CardHeader>
              <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              <p className="text-sm text-muted-foreground">by {course.instructor}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {course.completedLessons || 0} of {course.totalLessons} lessons completed
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.totalLessons} lessons</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/courses/${course.id}`} className="flex-1">
                  <Button className="w-full" variant={isCompleted ? "outline" : "default"}>
                    <Play className="h-4 w-4 mr-2" />
                    {isCompleted ? "Review" : "Continue"}
                  </Button>
                </Link>
                {!isCompleted && (
                  <Button variant="outline" onClick={() => onContinue(course.id)} className="px-3">
                    +10%
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
