import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get total conversions count
    const totalConversions = await db.fileProcess.count({
      where: {
        status: 'completed'
      }
    })

    // Get unique users count
    const totalUsers = await db.user.count()

    // Get popular tools
    const popularToolsRaw = await db.analytics.groupBy({
      by: ['toolName'],
      _sum: {
        count: true
      },
      orderBy: {
        _sum: {
          count: 'desc'
        }
      },
      take: 5
    })

    const popularTools = popularToolsRaw.map(tool => ({
      name: tool.toolName,
      count: tool._sum.count || 0
    }))

    // Get recent activity
    const recentActivity = await db.fileProcess.findMany({
      where: {
        status: 'completed'
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: 10,
      select: {
        processedType: true,
        completedAt: true
      }
    })

    const formattedActivity = recentActivity.map(activity => ({
      tool: activity.processedType?.split('/')[1]?.toUpperCase() || 'Unknown',
      timestamp: activity.completedAt?.toLocaleString() || 'Unknown'
    }))

    // Get conversion trend (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const conversionTrend = await db.analytics.groupBy({
      by: ['date'],
      _sum: {
        count: true
      },
      where: {
        date: {
          gte: sevenDaysAgo
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    const formattedTrend = conversionTrend.map(item => ({
      date: item.date.toLocaleDateString(),
      count: item._sum.count || 0
    }))

    return NextResponse.json({
      totalConversions,
      totalUsers,
      popularTools,
      recentActivity: formattedActivity,
      conversionTrend: formattedTrend
    })

  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}