"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Bookmark,
  BookmarkPlus,
  Maximize2,
  Minimize2,
  Settings,
  Eye,
  EyeOff
} from "lucide-react"
import type { Book } from "@/lib/library-store"
import { useLibraryStore } from "@/lib/library-store"
import { WordDefinitionPopover } from "./word-definition-popover"

interface PDFViewerProps {
  book: Book | null
  open: boolean
  onClose: () => void
}

export function PDFViewer({ book, open, onClose }: PDFViewerProps) {
  const { lookupWord, updateReadingProgress } = useLibraryStore()
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [selectedText, setSelectedText] = useState("")
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [readingMode, setReadingMode] = useState<"normal" | "night" | "sepia">("normal")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (open && book) {
      setCurrentPage(1)
      setZoom(100)
      setRotation(0)
      setSelectedText("")
      setSelectionPosition(null)
      setIsFullscreen(false)
      setShowControls(true)
      setReadingMode("normal")
    }
  }, [open, book])

  useEffect(() => {
    if (book && currentPage > 0) {
      updateReadingProgress(book.id, currentPage)
    }
  }, [currentPage, book, updateReadingProgress])

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      const text = selection.toString().trim()
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      setSelectedText(text)
      setSelectionPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      })
    } else {
      setSelectedText("")
      setSelectionPosition(null)
    }
  }

  const handleWordLookup = async () => {
    if (selectedText) {
      await lookupWord(selectedText)
      setSelectedText("")
      setSelectionPosition(null)
    }
  }

  const handleDownload = () => {
    if (book) {
      const link = document.createElement("a")
      link.href = book.pdfUrl
      link.download = `${book.title}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const toggleControls = () => {
    setShowControls(!showControls)
  }

  const getReadingModeStyles = () => {
    switch (readingMode) {
      case "night":
        return "bg-gray-900 text-gray-100"
      case "sepia":
        return "bg-amber-50 text-gray-800"
      default:
        return "bg-white text-gray-900"
    }
  }

  if (!book) return null

  const readingProgress = (currentPage / book.pages) * 100

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`max-w-7xl max-h-[95vh] p-0 ${isFullscreen ? 'w-screen h-screen max-w-none' : ''}`}>
        <DialogHeader className={`p-6 pb-0 ${showControls ? '' : 'hidden'}`}>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <DialogTitle className="text-xl font-bold">{book.title}</DialogTitle>
              <p className="text-sm text-muted-foreground">by {book.author}</p>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{book.subject}</Badge>
                <span className="text-xs text-muted-foreground">{book.pages} pages</span>
                <div className="flex items-center gap-2">
                  <Progress value={readingProgress} className="w-24 h-2" />
                  <span className="text-xs text-muted-foreground">{Math.round(readingProgress)}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>  
          </div>
        </DialogHeader>

        <Separator className={showControls ? '' : 'hidden'} />

        {/* Enhanced PDF Controls */}
        <div className={`flex items-center justify-between px-6 py-3 bg-muted/50 ${showControls ? '' : 'hidden'}`}>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={currentPage}
                onChange={(e) =>
                  setCurrentPage(Math.max(1, Math.min(book.pages, Number.parseInt(e.target.value) || 1)))
                }
                className="w-20 text-center"
                min={1}
                max={book.pages}
              />
              <span className="text-sm text-muted-foreground">of {book.pages}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(Math.min(book.pages, currentPage + 1))}
              disabled={currentPage === book.pages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {/* Reading Mode */}
            <div className="flex items-center gap-1">
              <Button
                variant={readingMode === "normal" ? "default" : "outline"}
                size="sm"
                onClick={() => setReadingMode("normal")}
              >
                Normal
              </Button>
              <Button
                variant={readingMode === "night" ? "default" : "outline"}
                size="sm"
                onClick={() => setReadingMode("night")}
              >
                Night
              </Button>
              <Button
                variant={readingMode === "sepia" ? "default" : "outline"}
                size="sm"
                onClick={() => setReadingMode("sepia")}
              >
                Sepia
              </Button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(50, zoom - 25))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-12 text-center">{zoom}%</span>
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(300, zoom + 25))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            {/* Additional Controls */}
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => setRotation((rotation + 90) % 360)}>
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={toggleControls}>
                {showControls ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced PDF Viewer */}
        <div className="flex-1 p-6 pt-0">
          <div
            className={`w-full border rounded-lg overflow-hidden bg-muted relative transition-all duration-300 ${
              isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[70vh]'
            }`}
            onMouseUp={handleTextSelection}
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
            }}
          >
            {/* Enhanced Mock PDF viewer - in real implementation, use react-pdf or similar */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="w-32 h-40 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-800 rounded-lg flex items-center justify-center mx-auto shadow-lg">
                  <BookOpen className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-semibold">PDF Viewer</p>
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {book.pages} • {zoom}% zoom • {rotation}° rotation
                  </p>
                  <p className="text-xs text-muted-foreground mt-4 max-w-md mx-auto">
                    Select text to look up words in the dictionary. Use the controls above to adjust zoom, rotation, and reading mode.
                  </p>
                </div>
                
                {/* Page Navigation */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 10))}
                    disabled={currentPage <= 10}
                  >
                    -10
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-medium">Page {currentPage}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(book.pages, currentPage + 1))}
                    disabled={currentPage === book.pages}
                  >
                    Next
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(book.pages, currentPage + 10))}
                    disabled={currentPage >= book.pages - 10}
                  >
                    +10
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Text selection popup */}
            {selectedText && selectionPosition && (
              <div
                className="absolute z-10 bg-popover border rounded-lg shadow-lg p-3 backdrop-blur-sm"
                style={{
                  left: selectionPosition.x - 100,
                  top: selectionPosition.y - 80,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium max-w-48 truncate">"{selectedText}"</span>
                  <Button size="sm" variant="outline" onClick={handleWordLookup}>
                    <Search className="w-3 h-3 mr-1" />
                    Define
                  </Button>
                  <Button size="sm" variant="outline">
                    <BookmarkPlus className="w-3 h-3 mr-1" />
                    Bookmark
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <WordDefinitionPopover />
      </DialogContent>
    </Dialog>
  )
}
