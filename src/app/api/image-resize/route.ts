import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const width = formData.get('width') ? parseInt(formData.get('width') as string) : undefined
    const height = formData.get('height') ? parseInt(formData.get('height') as string) : undefined
    const unit = formData.get('unit') as string
    const maintainAspectRatio = formData.get('maintainAspectRatio') === 'true'
    const quality = parseInt(formData.get('quality') as string)
    const format = formData.get('format') as string

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
    const originalWidth = metadata.width || 0
    const originalHeight = metadata.height || 0

    // Calculate dimensions based on unit
    let targetWidth = width
    let targetHeight = height

    if (unit === '%') {
      if (width) targetWidth = Math.round(originalWidth * (width / 100))
      if (height) targetHeight = Math.round(originalHeight * (height / 100))
    } else if (unit === 'cm') {
      // Convert cm to pixels (assuming 96 DPI)
      const cmToPx = 37.795275591
      if (width) targetWidth = Math.round(width * cmToPx)
      if (height) targetHeight = Math.round(height * cmToPx)
    }

    // Maintain aspect ratio if enabled
    if (maintainAspectRatio && targetWidth && targetHeight) {
      const aspectRatio = originalWidth / originalHeight
      if (targetWidth / targetHeight > aspectRatio) {
        targetWidth = Math.round(targetHeight * aspectRatio)
      } else {
        targetHeight = Math.round(targetWidth / aspectRatio)
      }
    } else if (maintainAspectRatio && targetWidth) {
      targetHeight = Math.round(targetWidth / (originalWidth / originalHeight))
    } else if (maintainAspectRatio && targetHeight) {
      targetWidth = Math.round(targetHeight * (originalWidth / originalHeight))
    }

    // Resize image
    const resizeOptions: sharp.ResizeOptions = {
      width: targetWidth,
      height: targetHeight,
      fit: 'cover',
      withoutEnlargement: true
    }

    sharpInstance = sharpInstance.resize(resizeOptions)

    // Set output format
    let outputFormat: string = format === 'original' ? metadata.format || 'jpeg' : format
    let outputOptions: any = {}

    switch (outputFormat) {
      case 'jpeg':
        outputOptions = { quality, mozjpeg: true }
        break
      case 'png':
        outputOptions = { quality: Math.round(quality / 100 * 9) } // PNG quality is 0-9
        break
      case 'webp':
        outputOptions = { quality }
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
          toolName: 'image-resize',
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
        'Content-Disposition': `attachment; filename="resized_${file.name.split('.')[0]}.${outputFormat}"`
      }
    })

  } catch (error) {
    console.error('Image resize error:', error)
    
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
      { error: 'Failed to process image' },
      { status: 500 }
    )
  }
}