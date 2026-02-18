"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useQuizStore } from "@/lib/quiz-store"
import { Leaderboard } from "@/components/quiz/leaderboard"
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Trophy, Target, Timer, AlertCircle } from "lucide-react"

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const {
    quizzes,
    currentQuiz,
    currentQuestionIndex,
    currentAnswers,
    timeRemaining,
    isQuizActive,
    startQuiz,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
  } = useQuizStore()

  const [selectedAnswer, setSelectedAnswer] = useState<string | number>("")
  const [quizResult, setQuizResult] = useState<any>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const quiz = quizzes.find((q) => q.id === quizId)

  useEffect(() => {
    if (!quiz) {
      router.push("/quizzes")
      return
    }

    if (!isQuizActive && !quizResult) {
      // Quiz not started yet, show quiz info
    }
  }, [quiz, isQuizActive, quizResult, router])

  useEffect(() => {
    if (isQuizActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        useQuizStore.setState((state) => ({
          timeRemaining: Math.max(0, state.timeRemaining - 1),
        }))
      }, 1000)

      return () => clearInterval(timer)
    } else if (isQuizActive && timeRemaining === 0) {
      // Time's up, auto-submit
      handleSubmitQuiz()
    }
  }, [isQuizActive, timeRemaining])

  useEffect(() => {
    if (currentQuiz && currentQuiz.questions[currentQuestionIndex]) {
      const questionId = currentQuiz.questions[currentQuestionIndex].id
      const existingAnswer = currentAnswers[questionId]
      setSelectedAnswer(existingAnswer || "")
    }
  }, [currentQuestionIndex, currentAnswers, currentQuiz])

  if (!quiz) {
    return null
  }

  const handleStartQuiz = () => {
    const success = startQuiz(quizId)
    if (success) {
      setQuizResult(null)
      setShowExplanation(false)
    }
  }

  const handleAnswerChange = (value: string | number) => {
    setSelectedAnswer(value)
    if (currentQuiz) {
      const questionId = currentQuiz.questions[currentQuestionIndex].id
      submitAnswer(questionId, value)
    }
  }

  const handleNextQuestion = () => {
    nextQuestion()
    setShowExplanation(false)
  }

  const handlePreviousQuestion = () => {
    previousQuestion()
    setShowExplanation(false)
  }

  const handleSubmitQuiz = () => {
    const result = submitQuiz()
    if (result) {
      setQuizResult(result)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  // Quiz Results View
  if (quizResult) {
    const getScoreColor = (percentage: number) => {
      if (percentage >= 90) return "text-green-600"
      if (percentage >= 70) return "text-yellow-600"
      return "text-red-600"
    }

    const getScoreMessage = (percentage: number) => {
      if (percentage >= 90) return "Excellent work! 🎉"
      if (percentage >= 70) return "Good job! 👍"
      if (percentage >= 50) return "Not bad, keep practicing! 📚"
      return "Keep studying and try again! 💪"
    }

    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Quiz Complete!</h1>
            <p className="text-muted-foreground">{quiz.title}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {quizResult.percentage >= 70 ? (
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    ) : (
                      <XCircle className="h-16 w-16 text-red-500" />
                    )}
                  </div>
                  <CardTitle className={`text-4xl font-bold ${getScoreColor(quizResult.percentage)}`}>
                    {quizResult.percentage}%
                  </CardTitle>
                  <CardDescription className="text-lg">{getScoreMessage(quizResult.percentage)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{quizResult.score}</div>
                      <div className="text-sm text-muted-foreground">Points Earned</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{formatTime(quizResult.timeSpent)}</div>
                      <div className="text-sm text-muted-foreground">Time Taken</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {Object.keys(quizResult.answers).length}/{quiz.questions.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Questions Answered</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Question Review</h3>
                    {quiz.questions.map((question, index) => {
                      const userAnswer = quizResult.answers[question.id]
                      const isCorrect = userAnswer === question.correctAnswer
                      return (
                        <div key={question.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">
                              {index + 1}. {question.question}
                            </h4>
                            {isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                            )}
                          </div>
                          {question.options && (
                            <div className="space-y-1 text-sm">
                              <div className="text-muted-foreground">
                                Your answer: {question.options[userAnswer as number] || "Not answered"}
                              </div>
                              <div className="text-green-600">
                                Correct answer: {question.options[question.correctAnswer as number]}
                              </div>
                            </div>
                          )}
                          {question.explanation && (
                            <div className="mt-2 p-2 bg-muted rounded text-sm">
                              <strong>Explanation:</strong> {question.explanation}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={() => router.push("/quizzes")} variant="outline" className="flex-1">
                      Back to Quizzes
                    </Button>
                    <Button onClick={handleStartQuiz} className="flex-1">
                      Retake Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Leaderboard quizId={quizId} />
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Quiz Taking View
  if (isQuizActive && currentQuiz) {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100
    const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1
    const allQuestionsAnswered = currentQuiz.questions.every((q) => currentAnswers[q.id] !== undefined)

    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Quiz Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{currentQuiz.title}</h1>
              <p className="text-muted-foreground">
                Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-lg font-mono">
                <Timer className="h-5 w-5" />
                <span className={timeRemaining < 300 ? "text-red-500" : ""}>{formatTime(timeRemaining)}</span>
              </div>
              {timeRemaining < 300 && (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Time Running Out!
                </Badge>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Question */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{currentQuestion.points} points</Badge>
                    <Badge variant="secondary">{currentQuestion.type.replace("-", " ")}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Multiple Choice */}
                  {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
                    <RadioGroup
                      value={selectedAnswer.toString()}
                      onValueChange={(value) => handleAnswerChange(Number.parseInt(value))}
                    >
                      <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  )}

                  {/* True/False */}
                  {currentQuestion.type === "true-false" && (
                    <RadioGroup
                      value={selectedAnswer.toString()}
                      onValueChange={(value) => handleAnswerChange(Number.parseInt(value))}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="true" />
                          <Label htmlFor="true" className="cursor-pointer">
                            True
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="false" />
                          <Label htmlFor="false" className="cursor-pointer">
                            False
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  )}

                  {/* Fill in the Blank */}
                  {currentQuestion.type === "fill-blank" && (
                    <Input
                      placeholder="Enter your answer..."
                      value={selectedAnswer as string}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                    />
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    {isLastQuestion ? (
                      <Button onClick={handleSubmitQuiz} disabled={!allQuestionsAnswered}>
                        Submit Quiz
                      </Button>
                    ) : (
                      <Button onClick={handleNextQuestion}>
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Question Navigator */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {currentQuiz.questions.map((_, index) => {
                      const isAnswered = currentAnswers[currentQuiz.questions[index].id] !== undefined
                      const isCurrent = index === currentQuestionIndex
                      return (
                        <Button
                          key={index}
                          variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
                          size="sm"
                          className="aspect-square p-0"
                          onClick={() => useQuizStore.setState({ currentQuestionIndex: index })}
                        >
                          {index + 1}
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quiz Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quiz Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subject:</span>
                    <span>{currentQuiz.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difficulty:</span>
                    <Badge className={getDifficultyColor(currentQuiz.difficulty)} variant="secondary" size="sm">
                      {currentQuiz.difficulty}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Points:</span>
                    <span>{currentQuiz.totalPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Answered:</span>
                    <span>
                      {Object.keys(currentAnswers).length}/{currentQuiz.questions.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Quiz Info View (before starting)
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/quizzes")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{quiz.title}</CardTitle>
                    <CardDescription className="text-base">{quiz.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getDifficultyColor(quiz.difficulty)} variant="secondary">
                      {quiz.difficulty}
                    </Badge>
                    {quiz.isContest && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                      >
                        <Trophy className="h-3 w-3 mr-1" />
                        Contest
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quiz Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{quiz.questions.length}</div>
                    <div className="text-sm text-muted-foreground">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{quiz.timeLimit}m</div>
                    <div className="text-sm text-muted-foreground">Time Limit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{quiz.totalPoints}</div>
                    <div className="text-sm text-muted-foreground">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{quiz.averageScore}%</div>
                    <div className="text-sm text-muted-foreground">Average Score</div>
                  </div>
                </div>

                <Separator />

                {/* Tags */}
                <div>
                  <h3 className="font-semibold mb-2">Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {quiz.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Instructions */}
                <div>
                  <h3 className="font-semibold mb-2">Instructions</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• You have {quiz.timeLimit} minutes to complete this quiz</li>
                    <li>• You can navigate between questions using the question navigator</li>
                    <li>• Make sure to answer all questions before submitting</li>
                    <li>• Your score will be calculated instantly upon submission</li>
                    {quiz.isContest && <li>• This is a contest - your score will appear on the leaderboard</li>}
                  </ul>
                </div>

                <Button onClick={handleStartQuiz} size="lg" className="w-full">
                  <Target className="mr-2 h-5 w-5" />
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Leaderboard quizId={quizId} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
