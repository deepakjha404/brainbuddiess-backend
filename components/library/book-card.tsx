"use client"

import type React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BookOpen, Download, Star, Eye, Calendar, FileText, User, Clock } from "lucide-react"
import type { Book } from "@/lib/library-store"
import { formatDistanceToNow } from "date-fns"

interface BookCardProps {
  book: Book
  onView: (book: Book) => void
  viewMode?: "grid" | "list"
}

export function BookCard({ book, onView, viewMode = "grid" }: BookCardProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Create a temporary link to download the PDF
    const link = document.createElement("a")
    link.href = book.pdfUrl
    link.download = `${book.title}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group bg-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="w-24 h-32 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg">
                {book.coverImage ? (
                  <img 
                    src={book.coverImage || "/placeholder.svg"} 
                    alt={book.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>

            {/* Book Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xl text-foreground transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    by {book.author}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="secondary" className="text-xs">
                    {book.subject}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {book.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{book.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{book.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{book.pages} pages</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDistanceToNow(new Date(book.uploadedAt), { addSuffix: true })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {book.uploadedBy.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{book.uploadedBy.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                {book.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {book.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{book.tags.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Grid View
  return (
    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group bg-card h-full" onClick={() => onView(book)}>
      <CardHeader className="pb-4">
        <div className="aspect-[3/4] bg-muted rounded-xl mb-4 flex items-center justify-center relative overflow-hidden shadow-lg">
          {book.coverImage ? (
            <img 
              src={book.coverImage || "/placeholder.svg"} 
              alt={book.title} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <BookOpen className="w-12 h-12 text-muted-foreground" />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{book.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg text-foreground transition-colors line-clamp-2 leading-tight">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <User className="w-3 h-3" />
              by {book.author}
            </p>
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {book.description}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {book.subject}
            </Badge>
            {book.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            <span>{book.downloads.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>{book.pages}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Avatar className="w-5 h-5">
            <AvatarFallback className="text-xs">
              {book.uploadedBy.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="truncate">{book.uploadedBy.name}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDistanceToNow(new Date(book.uploadedAt), { addSuffix: true })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {book.fileSize}
          </div>
          <Button size="sm" variant="outline" onClick={handleDownload} className="text-xs">
            <Download className="w-3 h-3 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
