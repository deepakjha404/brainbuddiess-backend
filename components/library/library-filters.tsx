"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  Filter, 
  X, 
  BookOpen, 
  Star, 
  Calendar,
  Download,
  FileText,
  Users,
  Tag
} from "lucide-react"

interface LibraryFiltersProps {
  searchQuery: string
  selectedSubject: string
  selectedFormat: string
  selectedRating: string
  sortBy: string
  onSearchChange: (query: string) => void
  onSubjectChange: (subject: string) => void
  onFormatChange: (format: string) => void
  onRatingChange: (rating: string) => void
  onSortChange: (sort: string) => void
  onClearFilters: () => void
}

const subjects = [
  "All Subjects",
  "Data Structures & Algorithms",
  "Database Systems",
  "Operating Systems",
  "Computer Networks",
  "Software Engineering",
  "Object-Oriented Programming",
  "Web Development",
  "Machine Learning",
  "Cybersecurity",
  "Mathematics for CS",
]

const formats = [
  "All Formats",
  "PDF",
  "EPUB",
  "DOCX",
  "TXT",
]

const ratings = [
  "All Ratings",
  "4+ Stars",
  "3+ Stars",
  "2+ Stars",
]

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "title", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "author", label: "Author A-Z" },
  { value: "rating", label: "Highest Rated" },
  { value: "downloads", label: "Most Downloaded" },
  { value: "date", label: "Recently Added" },
  { value: "pages", label: "Pages (Low to High)" },
  { value: "pages-desc", label: "Pages (High to Low)" },
]

export function LibraryFilters({
  searchQuery,
  selectedSubject,
  selectedFormat,
  selectedRating,
  sortBy,
  onSearchChange,
  onSubjectChange,
  onFormatChange,
  onRatingChange,
  onSortChange,
  onClearFilters,
}: LibraryFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const hasActiveFilters = searchQuery || selectedSubject !== "All Subjects" || selectedFormat !== "All Formats" || selectedRating !== "All Ratings"

  return (
    <Card className="bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filters
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "Hide" : "Show"} Advanced
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search books, authors, topics, or ISBN..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 h-12 text-base bg-background"
          />
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select value={selectedSubject} onValueChange={onSubjectChange}>
            <SelectTrigger className="h-12 bg-background">
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

          <Select value={selectedFormat} onValueChange={onFormatChange}>
            <SelectTrigger className="h-12 bg-background">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              {formats.map((format) => (
                <SelectItem key={format} value={format}>
                  {format}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedRating} onValueChange={onRatingChange}>
            <SelectTrigger className="h-12 bg-background">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              {ratings.map((rating) => (
                <SelectItem key={rating} value={rating}>
                  {rating}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="h-12 bg-background">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Advanced Filters</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Page Range</label>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Min"
                      className="bg-background"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      placeholder="Max"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">File Size</label>
                  <Select>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Any size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (&lt; 5MB)</SelectItem>
                      <SelectItem value="medium">Medium (5-20MB)</SelectItem>
                      <SelectItem value="large">Large (&gt; 20MB)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Date</label>
                  <Select>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {["algorithms", "database", "networking", "security", "web-dev", "machine-learning"].map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <>
            <Separator />
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-2 px-3 py-1">
                  <Search className="w-3 h-3" />
                  Search: "{searchQuery}"
                  <button onClick={() => onSearchChange("")} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {selectedSubject !== "All Subjects" && (
                <Badge variant="secondary" className="gap-2 px-3 py-1">
                  <BookOpen className="w-3 h-3" />
                  Subject: {selectedSubject}
                  <button onClick={() => onSubjectChange("All Subjects")} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {selectedFormat !== "All Formats" && (
                <Badge variant="secondary" className="gap-2 px-3 py-1">
                  <FileText className="w-3 h-3" />
                  Format: {selectedFormat}
                  <button onClick={() => onFormatChange("All Formats")} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {selectedRating !== "All Ratings" && (
                <Badge variant="secondary" className="gap-2 px-3 py-1">
                  <Star className="w-3 h-3" />
                  Rating: {selectedRating}
                  <button onClick={() => onRatingChange("All Ratings")} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-destructive">
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
