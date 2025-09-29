import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, we'll use a simple session or anonymous user
    // In a real app, you would get the user ID from authentication
    const userId = "demo-user" // This should come from auth session

    const bookmarks = await db.bookmark.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(bookmarks)

  } catch (error) {
    console.error('Failed to fetch bookmarks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { toolName } = await request.json()

    if (!toolName) {
      return NextResponse.json({ error: 'Tool name is required' }, { status: 400 })
    }

    // For demo purposes, we'll use a simple session or anonymous user
    // In a real app, you would get the user ID from authentication
    const userId = "demo-user" // This should come from auth session

    // Check if bookmark already exists
    const existingBookmark = await db.bookmark.findUnique({
      where: {
        userId_toolName: {
          userId,
          toolName
        }
      }
    })

    if (existingBookmark) {
      return NextResponse.json({ error: 'Bookmark already exists' }, { status: 400 })
    }

    const bookmark = await db.bookmark.create({
      data: {
        userId,
        toolName
      }
    })

    return NextResponse.json(bookmark)

  } catch (error) {
    console.error('Failed to create bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { toolName } = await request.json()

    if (!toolName) {
      return NextResponse.json({ error: 'Tool name is required' }, { status: 400 })
    }

    // For demo purposes, we'll use a simple session or anonymous user
    // In a real app, you would get the user ID from authentication
    const userId = "demo-user" // This should come from auth session

    await db.bookmark.delete({
      where: {
        userId_toolName: {
          userId,
          toolName
        }
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Failed to delete bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to delete bookmark' },
      { status: 500 }
    )
  }
}