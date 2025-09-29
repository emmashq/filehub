import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const targetFormat = formData.get('format') as string
    const quality = parseInt(formData.get('quality') as string) || 90

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!targetFormat) {
      return NextResponse.json({ error: 'No target format specified' }, { status: 400 })
    }

    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // Get file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create sharp instance
    let sharpInstance = sharp(buffer)

    // Get original metadata
    const metadata = await sharpInstance.metadata()
    const originalFormat = metadata.format || 'unknown'

    // Set output format and options
    let outputOptions: any = {}

    switch (targetFormat) {
      case 'jpeg':
        outputOptions = { 
          quality,
          mozjpeg: true,
          progressive: true
        }
        sharpInstance = sharpInstance.jpeg(outputOptions)
        break
      case 'png':
        outputOptions = { 
          compressionLevel: Math.round((100 - quality) / 10), // PNG compression level 0-9
          progressive: true
        }
        sharpInstance = sharpInstance.png(outputOptions)
        break
      case 'webp':
        outputOptions = { 
          quality,
          lossless: quality >= 95
        }
        sharpInstance = sharpInstance.webp(outputOptions)
        break
      case 'tiff':
        outputOptions = { 
          quality,
          compression: 'lzw'
        }
        sharpInstance = sharpInstance.tiff(outputOptions)
        break
      case 'bmp':
        sharpInstance = sharpInstance.bmp()
        break
      default:
        return NextResponse.json({ error: 'Unsupported target format' }, { status: 400 })
    }

    // Process the image
    const processedBuffer = await sharpInstance.toBuffer()

    // Log analytics
    try {
      await db.analytics.create({
        data: {
          toolName: 'image-convert',
          count: 1
        }
      })

      await db.fileProcess.create({
        data: {
          originalName: file.name,
          fileSize: file.size,
          fileType: file.type,
          processedType: `image/${targetFormat}`,
          status: 'completed',
          completedAt: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to log analytics:', error)
    }

    // Return processed image
    return new NextResponse(processedBuffer, {
      headers: {
        'Content-Type': `image/${targetFormat}`,
        'Content-Disposition': `attachment; filename="converted_${file.name.split('.')[0]}.${targetFormat}"`
      }
    })

  } catch (error) {
    console.error('Image conversion error:', error)
    
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
      { error: 'Failed to convert image' },
      { status: 500 }
    )
  }
}