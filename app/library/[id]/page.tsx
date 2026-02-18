"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkPlus,
  Search,
  ZoomIn,
  ZoomOut,
  Download,
  Share,
} from "lucide-react"
import { useLibraryStore } from "@/lib/library-store"
import { useAuthStore } from "@/lib/auth-store"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DictionaryLookup } from "@/components/library/dictionary-lookup"

export default function BookReaderPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string

  const [selectedText, setSelectedText] = useState("")
  const [bookmarkTitle, setBookmarkTitle] = useState("")
  const [bookmarkNote, setBookmarkNote] = useState("")
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false)
  const [zoom, setZoom] = useState(100)

  const {
    getBook,
    currentBook,
    currentPage,
    openBook,
    setCurrentPage,
    getReadingProgress,
    addBookmark,
    getBookmarks,
    removeBookmark,
  } = useLibraryStore()
  const { user } = useAuthStore()

  const book = getBook(bookId)
  const progress = user ? getReadingProgress(bookId) : undefined
  const bookmarks = user ? getBookmarks(bookId) : []

  useEffect(() => {
    if (book) {
      openBook(bookId)
    }
  }, [book, bookId, openBook])

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
          <Button onClick={() => router.push("/library")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
        </div>
      </div>
    )
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim())
    }
  }

  const handleAddBookmark = () => {
    if (!bookmarkTitle.trim()) return

    addBookmark(bookId, currentPage, bookmarkTitle.trim(), bookmarkNote.trim() || undefined)
    setBookmarkTitle("")
    setBookmarkNote("")
    setShowBookmarkDialog(false)
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= book.pages) {
      setCurrentPage(page)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.push("/library")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Library
                </Button>
                <div>
                  <h1 className="font-semibold truncate max-w-md">{book.title}</h1>
                  <p className="text-sm text-muted-foreground">by {book.author}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DictionaryLookup initialWord={selectedText}>
                  <Button variant="outline" size="sm" disabled={!selectedText}>
                    <Search className="h-4 w-4 mr-2" />
                    Lookup
                  </Button>
                </DictionaryLookup>

                <Dialog open={showBookmarkDialog} onOpenChange={setShowBookmarkDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <BookmarkPlus className="h-4 w-4 mr-2" />
                      Bookmark
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Bookmark</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          placeholder="Bookmark title..."
                          value={bookmarkTitle}
                          onChange={(e) => setBookmarkTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Note (optional)</label>
                        <Textarea
                          placeholder="Add a note about this bookmark..."
                          value={bookmarkNote}
                          onChange={(e) => setBookmarkNote(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowBookmarkDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddBookmark} disabled={!bookmarkTitle.trim()}>
                          Add Bookmark
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>

                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Reading Progress */}
              {progress && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Reading Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={progress.percentage} className="mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Page {progress.currentPage}</span>
                      <span>{progress.percentage}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{progress.timeSpent} minutes read</p>
                  </CardContent>
                </Card>
              )}

              {/* Bookmarks */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    Bookmarks ({bookmarks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bookmarks.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No bookmarks yet</p>
                  ) : (
                    <div className="space-y-2">
                      {bookmarks.slice(0, 5).map((bookmark) => (
                        <div key={bookmark.id} className="p-2 border rounded text-xs">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium line-clamp-1">{bookmark.title}</p>
                              <p className="text-muted-foreground">Page {bookmark.page}</p>
                              {bookmark.note && (
                                <p className="text-muted-foreground mt-1 line-clamp-2">{bookmark.note}</p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => goToPage(bookmark.page)}
                              className="h-6 w-6 p-0"
                            >
                              →
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Book Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Book Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pages:</span>
                    <span>{book.pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Format:</span>
                    <Badge variant="outline" className="text-xs">
                      {book.format}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge variant="secondary" className="text-xs">
                      {book.category}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Language:</span>
                    <span>{book.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Published:</span>
                    <span>{book.publishedYear}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        Page {currentPage} of {book.pages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage >= book.pages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground min-w-[3rem] text-center">{zoom}%</span>
                      <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 10))}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Mock PDF/Book Content */}
                  <div
                    className="min-h-[600px] bg-white border rounded-lg p-8 shadow-inner"
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
                    onMouseUp={handleTextSelection}
                  >
                    <div className="max-w-none prose prose-sm">
                      <h2 className="text-xl font-bold mb-4">
                        Chapter {Math.ceil(currentPage / 20)}: {book.title}
                      </h2>
                      <p className="mb-4">
                        This is a mock representation of page {currentPage} from "{book.title}" by {book.author}. In a
                        real implementation, this would display the actual PDF content or book text.
                      </p>
                      <p className="mb-4">The content would be loaded from the book's file URL: {book.fileUrl}</p>
                      <p className="mb-4">
                        You can select text to look up words in the dictionary, add bookmarks, and track your reading
                        progress as you navigate through the pages.
                      </p>
                      <p className="mb-4">
                        This book covers topics related to {book.category.toLowerCase()} and is suitable for{" "}
                        {book.difficulty.toLowerCase()} level readers.
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Page {currentPage} of {book.pages} • {book.format} Format
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
