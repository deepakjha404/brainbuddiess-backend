"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, Download, Users, Filter, Grid3X3, List, Bookmark } from "lucide-react"
import { useLibraryStore } from "@/lib/library-store"
import { BookCard } from "@/components/library/book-card"
import { PDFViewer } from "@/components/library/pdf-viewer"
import { LibraryFilters } from "@/components/library/library-filters"

const subjects = [
  "All Subjects",
  "Data Structures",
  "Algorithms",
  "Database Management",
  "Operating Systems",
  "Computer Networks",
  "Software Engineering",
  "Web Development",
  "Machine Learning",
  "Artificial Intelligence",
  "Cybersecurity",
  "Mobile Development",
]

export default function LibraryPage() {
  const {
    books,
    isLoading,
    currentPage,
    totalPages,
    searchQuery,
    selectedSubject,
    selectedBook,
    fetchBooks,
    searchBooks,
    filterBySubject,
    setPage,
    selectBook,
  } = useLibraryStore()

  const [localSearchQuery, setLocalSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFormat, setSelectedFormat] = useState("All Formats")
  const [selectedRating, setSelectedRating] = useState("All Ratings")
  const [sortBy, setSortBy] = useState("relevance")

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchBooks(localSearchQuery)
  }

  const handleClearFilters = () => {
    setLocalSearchQuery("")
    setSelectedFormat("All Formats")
    setSelectedRating("All Ratings")
    setSortBy("relevance")
    searchBooks("")
    filterBySubject("")
  }

  const totalBooks = books.length
  const totalDownloads = books.reduce((sum, book) => sum + book.downloads, 0)
  const uniqueAuthors = new Set(books.map((book) => book.author)).size

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Virtual Library
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Access thousands of educational resources, textbooks, and research materials in our comprehensive digital library
              </p>
            </div>

          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <Card className="bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-muted rounded-lg">
                  <BookOpen className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">{totalBooks}</p>
                  <p className="text-sm text-muted-foreground">Total Books</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-muted rounded-lg">
                  <Download className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">
                    {totalDownloads.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Downloads</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-muted rounded-lg">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">{uniqueAuthors}</p>
                  <p className="text-sm text-muted-foreground">Authors</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-muted rounded-lg">
                  <Filter className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">
                    {subjects.length - 1}
                  </p>
                  <p className="text-sm text-muted-foreground">Subjects</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search and Filters */}
        <LibraryFilters
          searchQuery={localSearchQuery}
          selectedSubject={selectedSubject || "All Subjects"}
          selectedFormat={selectedFormat}
          selectedRating={selectedRating}
          sortBy={sortBy}
          onSearchChange={setLocalSearchQuery}
          onSubjectChange={(value) => filterBySubject(value === "All Subjects" ? "" : value)}
          onFormatChange={setSelectedFormat}
          onRatingChange={setSelectedRating}
          onSortChange={setSortBy}
          onClearFilters={handleClearFilters}
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            Showing {books.length} of {totalBooks} books
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">View:</span>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Books Grid/List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">Loading your library...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No books found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adjusting your search terms or filters to find what you're looking for
              </p>
            </div>
          ) : (
            <>
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" 
                  : "grid-cols-1"
              }`}>
                {books.map((book) => (
                  <BookCard key={book.id} book={book} onView={selectBook} viewMode={viewMode} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-8">
                  <Button 
                    variant="outline" 
                    onClick={() => setPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="px-6"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(page)}
                        className="w-12"
                      >
                        {page}
                      </Button>
                    )
                  })}
                  <Button
                    variant="outline"
                    onClick={() => setPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-6"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      <PDFViewer book={selectedBook} open={!!selectedBook} onClose={() => selectBook(null)} />
    </div>
  )
}
