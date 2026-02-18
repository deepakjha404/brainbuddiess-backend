"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Play,
  Clock,
  Star,
  BookOpen,
  CheckCircle,
  IndianRupee,
  Download,
  Share2,
  Heart,
  GraduationCap,
  Target,
  List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useCourseStore } from "@/lib/course-store"
import { useAuthStore } from "@/lib/auth-store"

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const { getCourse, enrollInCourse, loading } = useCourseStore()
  const { user } = useAuthStore()

  const [course, setCourse] = useState(getCourse(courseId))
  const [enrolling, setEnrolling] = useState(false)
  const [showEnrollDialog, setShowEnrollDialog] = useState(false)

  useEffect(() => {
    const foundCourse = getCourse(courseId)
    if (!foundCourse) {
      router.push("/courses")
      return
    }
    setCourse(foundCourse)
  }, [courseId, getCourse, router])

  const handleEnroll = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    setEnrolling(true)
    const success = await enrollInCourse(courseId)

    if (success) {
      setShowEnrollDialog(false)
      setCourse(getCourse(courseId))
    }
    setEnrolling(false)
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <Badge variant="secondary" className="mb-2">
              Semester {course.semester} • {course.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              <span className="font-medium">{course.instructor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
              <span className="text-muted-foreground">({course.studentsEnrolled} students)</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>{course.totalLessons} lessons</span>
            </div>
          </div>

          {course.isEnrolled && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Your Progress</span>
                <span className="text-sm text-muted-foreground">
                  {course.completedLessons}/{course.totalLessons} lessons completed
                </span>
              </div>
              <Progress value={course.progress || 0} className="h-2" />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {course.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Course Preview/Enrollment Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <div className="relative">
              <img
                src={course.thumbnail || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                <Button size="lg" className="bg-white/20 hover:bg-white/30">
                  <Play className="h-6 w-6 mr-2" />
                  Preview Course
                </Button>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-6 w-6" />
                  <span className="text-2xl font-bold">₹{course.price}</span>
                  {course.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">₹{course.originalPrice}</span>
                  )}
                </div>
                {course.originalPrice && (
                  <Badge variant="destructive">
                    {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>

              {course.isEnrolled ? (
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resources
                  </Button>
                </div>
              ) : (
                <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      Enroll Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Enroll in {course.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Course Price:</span>
                        <span className="font-bold">₹{course.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Platform Fee:</span>
                        <span>₹0</span>
                      </div>
                      <hr />
                      <div className="flex items-center justify-between font-bold">
                        <span>Total:</span>
                        <span>₹{course.price}</span>
                      </div>
                      <Button className="w-full" onClick={handleEnroll} disabled={enrolling}>
                        {enrolling ? "Processing..." : "Complete Enrollment"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Mobile and desktop access</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Details Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="instructor">Instructor</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Learning Outcomes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <List className="h-5 w-5" />
                    Prerequisites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.prerequisites.map((prerequisite, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{prerequisite}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="curriculum" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
              <p className="text-muted-foreground">
                {course.totalLessons} lessons • {course.duration} total length
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {course.syllabus.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{topic}</h4>
                        <p className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 5) + 3} lessons • {Math.floor(Math.random() * 60) + 30} min
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructor" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>About the Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <img
                  src={course.instructorAvatar || "/placeholder.svg"}
                  alt={course.instructor}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-lg">{course.instructor}</h3>
                  <p className="text-muted-foreground mb-4">Senior Professor, Computer Science Department</p>
                  <p className="text-sm">
                    With over 15 years of experience in computer science education and industry,
                    {course.instructor} has taught thousands of students and contributed to numerous research
                    publications in the field of {course.category.toLowerCase()}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Reviews</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">{course.rating}</span>
                </div>
                <span className="text-muted-foreground">Based on {course.studentsEnrolled} reviews</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <img
                        src={`/generic-placeholder-graphic.png?height=40&width=40`}
                        alt="Student"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">Student {index + 1}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Excellent course! The instructor explains complex concepts very clearly and the practical
                          examples are really helpful for understanding.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
