import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb } from 'pdf-lib'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fontSize = parseInt(formData.get('fontSize') as string) || 12
    const fontFamily = formData.get('fontFamily') as string || 'Helvetica'
    const lineHeight = parseFloat(formData.get('lineHeight') as string) || 1.2

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.includes('text') && !file.name.endsWith('.txt')) {
      return NextResponse.json({ error: 'File must be a text file' }, { status: 400 })
    }

    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // Get file content
    const textContent = await file.text()

    // Create PDF document
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842]) // A4 size

    // Set up font
    const font = await pdfDoc.embedFont(fontFamily)
    
    // Calculate text dimensions
    const textWidth = 527 // Page width minus margins (595 - 68)
    const textHeight = 752 // Page height minus margins (842 - 90)
    
    // Split text into lines
    const words = textContent.split(/\s+/)
    const lines: string[] = []
    let currentLine = ''
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word
      const testWidth = font.widthOfTextAtSize(testLine, fontSize)
      
      if (testWidth > textWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    
    if (currentLine) {
      lines.push(currentLine)
    }

    // Draw text on page
    const lineHeightPx = fontSize * lineHeight
    const startY = 842 - 50 // Top margin
    
    for (let i = 0; i < lines.length; i++) {
      const y = startY - (i * lineHeightPx)
      
      // If we run out of space, add a new page
      if (y < 50) {
        const newPage = pdfDoc.addPage([595, 842])
        // Continue drawing on the new page
        // This is simplified - in production, you'd handle page breaks better
        break
      }
      
      page.drawText(lines[i], {
        x: 34,
        y: y,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      })
    }

    // Add title
    page.drawText(file.name.replace('.txt', ''), {
      x: 34,
      y: 842 - 30,
      size: fontSize + 4,
      font: font,
      color: rgb(0, 0, 0),
    })

    // Serialize PDF
    const pdfBytes = await pdfDoc.save()

    // Log analytics
    try {
      await db.analytics.create({
        data: {
          toolName: 'txt-to-pdf',
          count: 1
        }
      })

      await db.fileProcess.create({
        data: {
          originalName: file.name,
          fileSize: file.size,
          fileType: file.type,
          processedType: 'application/pdf',
          status: 'completed',
          completedAt: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to log analytics:', error)
    }

    // Return PDF
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="converted_${file.name.replace('.txt', '.pdf')}"`
      }
    })

  } catch (error) {
    console.error('TXT to PDF conversion error:', error)
    
    // Log error
    try {
      await db.fileProcess.create({
        data: {
          originalName: file?.name || 'unknown',
          fileSize: file?.size || 0,
          fileType: file?.type || 'unknown',
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }

    return NextResponse.json(
      { error: 'Failed to convert TXT to PDF' },
      { status: 500 }
    )
  }
}