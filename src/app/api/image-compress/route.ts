import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const quality = parseInt(formData.get('quality') as string)
    const format = formData.get('format') as string
    const maxWidth = formData.get('maxWidth') ? parseInt(formData.get('maxWidth') as string) : undefined
    const maxHeight = formData.get('maxHeight') ? parseInt(formData.get('maxHeight') as string) : undefined

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
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

    // Resize if max dimensions are provided
    const resizeOptions: sharp.ResizeOptions = {
      fit: 'inside',
      withoutEnlargement: true
    }

    if (maxWidth || maxHeight) {
      resizeOptions.width = maxWidth
      resizeOptions.height = maxHeight
      sharpInstance = sharpInstance.resize(resizeOptions)
    }

    // Set output format
    let outputFormat: string = format === 'original' ? metadata.format || 'jpeg' : format
    let outputOptions: any = {}

    switch (outputFormat) {
      case 'jpeg':
        outputOptions = { 
          quality,
          mozjpeg: true,
          progressive: true
        }
        break
      case 'png':
        outputOptions = { 
          compressionLevel: Math.round((100 - quality) / 10), // PNG compression level 0-9
          progressive: true
        }
        break
      case 'webp':
        outputOptions = { 
          quality,
          lossless: quality >= 95
        }
        break
    }

    // Convert to target format
    if (outputFormat === 'jpeg') {
      sharpInstance = sharpInstance.jpeg(outputOptions)
    } else if (outputFormat === 'png') {
      sharpInstance = sharpInstance.png(outputOptions)
    } else if (outputFormat === 'webp') {
      sharpInstance = sharpInstance.webp(outputOptions)
    }

    // Process the image
    const processedBuffer = await sharpInstance.toBuffer()

    // Log analytics
    try {
      await db.analytics.create({
        data: {
          toolName: 'image-compress',
          count: 1
        }
      })

      await db.fileProcess.create({
        data: {
          originalName: file.name,
          fileSize: file.size,
          fileType: file.type,
          processedType: `image/${outputFormat}`,
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
        'Content-Type': `image/${outputFormat}`,
        'Content-Disposition': `attachment; filename="compressed_${file.name.split('.')[0]}.${outputFormat}"`
      }
    })

  } catch (error) {
    console.error('Image compression error:', error)
    
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
      { error: 'Failed to compress image' },
      { status: 500 }
    )
  }
}