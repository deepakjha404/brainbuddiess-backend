"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Volume2, BookOpen } from "lucide-react"
import { useLibraryStore } from "@/lib/library-store"

interface DictionaryLookupProps {
  children: React.ReactNode
  initialWord?: string
}

export function DictionaryLookup({ children, initialWord = "" }: DictionaryLookupProps) {
  const [open, setOpen] = useState(false)
  const [searchWord, setSearchWord] = useState(initialWord)
  const [result, setResult] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  const { lookupWord } = useLibraryStore()

  const handleSearch = async () => {
    if (!searchWord.trim()) return

    setIsSearching(true)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const definition = lookupWord(searchWord.trim())
    setResult(definition)
    setIsSearching(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Dictionary Lookup
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter a word to look up..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching || !searchWord.trim()}>
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          {result && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold">{result.word}</h3>
                <Button variant="ghost" size="sm">
                  <Volume2 className="h-4 w-4" />
                </Button>
                <span className="text-muted-foreground">{result.pronunciation}</span>
              </div>

              <Badge variant="secondary">{result.partOfSpeech}</Badge>

              <div>
                <h4 className="font-semibold mb-2">Definition</h4>
                <p className="text-muted-foreground">{result.definition}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example</h4>
                <p className="italic text-muted-foreground">"{result.example}"</p>
              </div>

              {result.synonyms && result.synonyms.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Synonyms</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.synonyms.map((synonym: string) => (
                      <Badge key={synonym} variant="outline" className="text-xs">
                        {synonym}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {result.etymology && (
                <div>
                  <h4 className="font-semibold mb-2">Etymology</h4>
                  <p className="text-sm text-muted-foreground">{result.etymology}</p>
                </div>
              )}
            </div>
          )}

          {result === null && searchWord && !isSearching && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Word "{searchWord}" not found in dictionary.</p>
              <p className="text-sm mt-2">Try checking the spelling or searching for a different word.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
