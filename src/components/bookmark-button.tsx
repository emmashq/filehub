"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface BookmarkButtonProps {
  toolName: string
  className?: string
}

export function BookmarkButton({ toolName, className }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkBookmarkStatus()
  }, [toolName])

  const checkBookmarkStatus = async () => {
    try {
      // Check localStorage first
      const stored = localStorage.getItem('favorites')
      if (stored) {
        const bookmarks = JSON.parse(stored)
        setIsBookmarked(bookmarks.some((b: any) => b.toolName === toolName))
      }
    } catch (error) {
      console.error('Failed to check bookmark status:', error)
    }
  }

  const toggleBookmark = async () => {
    setLoading(true)
    try {
      const stored = localStorage.getItem('favorites')
      let bookmarks = stored ? JSON.parse(stored) : []
      
      if (isBookmarked) {
        // Remove bookmark
        bookmarks = bookmarks.filter((b: any) => b.toolName !== toolName)
        
        // Also try to remove from database
        await fetch('/api/bookmarks', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolName })
        })
      } else {
        // Add bookmark
        const newBookmark = {
          id: Date.now().toString(),
          toolName,
          createdAt: new Date().toISOString()
        }
        bookmarks.push(newBookmark)
        
        // Also try to add to database
        await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolName })
        })
      }
      
      localStorage.setItem('favorites', JSON.stringify(bookmarks))
      setIsBookmarked(!isBookmarked)
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={isBookmarked ? "default" : "outline"}
      size="sm"
      onClick={toggleBookmark}
      disabled={loading}
      className={className}
    >
      <Star className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
      {isBookmarked ? 'Favorited' : 'Favorite'}
    </Button>
  )
}