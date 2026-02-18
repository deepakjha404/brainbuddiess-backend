"use client"

import { useState, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Volume2, ExternalLink, Copy, BookmarkPlus } from "lucide-react"
import { useLibraryStore } from "@/lib/library-store"

export function WordDefinitionPopover() {
  const { wordDefinition, isLoadingDefinition, clearDefinition } = useLibraryStore()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (wordDefinition) {
      setIsOpen(true)
    }
  }, [wordDefinition])

  const handleClose = () => {
    setIsOpen(false)
    clearDefinition()
  }

  const handleCopy = () => {
    if (wordDefinition) {
      navigator.clipboard.writeText(wordDefinition.word)
    }
  }

  const handleBookmark = () => {
    // TODO: Implement bookmark functionality
    console.log("Bookmark word:", wordDefinition?.word)
  }

  const handlePronounce = () => {
    if (wordDefinition) {
      const utterance = new SpeechSynthesisUtterance(wordDefinition.word)
      utterance.lang = "en-US"
      speechSynthesis.speak(utterance)
    }
  }

  if (!wordDefinition) return null

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {wordDefinition.word}
              </h3>
              {wordDefinition.phonetic && (
                <p className="text-sm text-muted-foreground font-mono">
                  {wordDefinition.phonetic}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePronounce}
                className="h-8 w-8 p-0"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 w-8 p-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className="h-8 w-8 p-0"
              >
                <BookmarkPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Meanings */}
          <div className="space-y-4">
            {wordDefinition.meanings.map((meaning, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {meaning.partOfSpeech}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {meaning.definitions.map((definition, defIndex) => (
                    <div key={defIndex} className="space-y-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {definition.definition}
                      </p>
                      
                      {definition.example && (
                        <p className="text-xs text-muted-foreground italic">
                          "{definition.example}"
                        </p>
                      )}
                      
                      {definition.synonyms && definition.synonyms.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-xs text-muted-foreground">Synonyms:</span>
                          {definition.synonyms.slice(0, 3).map((synonym, synIndex) => (
                            <Badge
                              key={synIndex}
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            >
                              {synonym}
                            </Badge>
                          ))}
                          {definition.synonyms.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{definition.synonyms.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {index < wordDefinition.meanings.length - 1 && <Separator />}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Dictionary definition
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
