"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Download, ExternalLink, Trash2 } from "lucide-react"
import Link from "next/link"
import { BackButton } from "@/components/back-button"

interface Bookmark {
  id: string
  toolName: string
  createdAt: string
}

const toolInfo = {
  "image-resize": { name: "Resize Image", href: "/image-resize", category: "image" },
  "image-compress": { name: "Compress Image", href: "/image-compress", category: "image" },
  "image-scale": { name: "Scale Image", href: "/image-scale", category: "image" },
  "image-convert": { name: "Convert Image", href: "/image-convert", category: "image" },
  "pdf-to-word": { name: "PDF to Word", href: "/pdf-to-word", category: "document" },
  "word-to-pdf": { name: "Word to PDF", href: "/word-to-pdf", category: "document" },
  "pdf-to-excel": { name: "PDF to Excel", href: "/pdf-to-excel", category: "document" },
  "pdf-to-txt": { name: "PDF to TXT", href: "/pdf-to-txt", category: "document" },
  "txt-to-pdf": { name: "TXT to PDF", href: "/txt-to-pdf", category: "document" }
}

export function BookmarksManager() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookmarks()
  }, [])

  const loadBookmarks = async () => {
    try {
      const response = await fetch('/api/bookmarks')
      if (response.ok) {
        const data = await response.json()
        setBookmarks(data)
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeBookmark = async (toolName: string) => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ toolName })
      })

      if (response.ok) {
        setBookmarks(prev => prev.filter(b => b.toolName !== toolName))
      }
    } catch (error) {
      console.error('Failed to remove bookmark:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
          <p className="text-muted-foreground mb-4">
            Save your favorite tools for quick access
          </p>
          <Button asChild>
            <Link href="/">
              Browse Tools
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <div className="flex justify-start">
        <BackButton href="/" />
      </div>
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Bookmarks</h2>
        <Badge variant="secondary">
          {bookmarks.length} saved
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarks.map((bookmark) => {
          const tool = toolInfo[bookmark.toolName as keyof typeof toolInfo]
          if (!tool) return null

          return (
            <Card key={bookmark.id} className="group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    <CardDescription className="capitalize">
                      {tool.category} Tool
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBookmark(bookmark.toolName)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Added {new Date(bookmark.createdAt).toLocaleDateString()}</span>
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1" asChild>
                      <Link href={tool.href}>
                        <Download className="h-4 w-4 mr-2" />
                        Use Tool
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={tool.href}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}