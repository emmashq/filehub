"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, RotateCcw, Lock, Image as ImageIcon, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { BackButton } from "@/components/back-button"

interface CompressionOptions {
  quality: number
  format: string
  maxWidth?: number
  maxHeight?: number
}

export function ImageCompressTool() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number>(0)
  const [options, setOptions] = useState<CompressionOptions>({
    quality: 80,
    format: "original",
    maxWidth: undefined,
    maxHeight: undefined
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 50MB",
          variant: "destructive"
        })
        return
      }
      
      setFile(selectedFile)
      setOriginalSize(selectedFile.size)
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      setDownloadUrl(null)
      setCompressedSize(0)
    }
  }

  const handleCompress = async () => {
    if (!file || !previewUrl) return

    setIsProcessing(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('quality', options.quality.toString())
      formData.append('format', options.format)
      if (options.maxWidth) formData.append('maxWidth', options.maxWidth.toString())
      if (options.maxHeight) formData.append('maxHeight', options.maxHeight.toString())

      const response = await fetch('/api/image-compress', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to compress image')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      setCompressedSize(blob.size)
      
      toast({
        title: "Success!",
        description: "Image compressed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to compress image. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const resetTool = () => {
    setFile(null)
    setPreviewUrl(null)
    setDownloadUrl(null)
    setOriginalSize(0)
    setCompressedSize(0)
    setOptions({
      quality: 80,
      format: "original",
      maxWidth: undefined,
      maxHeight: undefined
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getCompressionRatio = () => {
    if (!originalSize || !compressedSize) return 0
    return Math.round((1 - compressedSize / originalSize) * 100)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex justify-start">
        <BackButton href="/tools" />
      </div>
      
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Compress Image</h1>
        <p className="text-muted-foreground">
          Reduce image file size without losing quality. Perfect for web optimization.
        </p>
      </div>

      {/* Upload Section */}
      {!file && (
        <Card>
          <CardContent className="p-8">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Upload your image</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to select. Max file size: 50MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload">
                <Button className="mt-4" asChild>
                  <span>Select Image</span>
                </Button>
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tool Interface */}
      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/5">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-auto rounded"
                    style={{ maxHeight: '400px' }}
                  />
                )}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Original size:</span>
                  <span className="font-medium">{formatFileSize(originalSize)}</span>
                </div>
                {compressedSize > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Compressed size:</span>
                    <span className="font-medium text-green-600">{formatFileSize(compressedSize)}</span>
                  </div>
                )}
                {compressedSize > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Compression:</span>
                    <Badge variant="secondary" className="text-green-600">
                      <Zap className="w-3 h-3 mr-1" />
                      {getCompressionRatio()}% smaller
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Compression Options</CardTitle>
              <CardDescription>
                Configure compression settings for optimal results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="quality">Quality: {options.quality}%</Label>
                <Input
                  id="quality"
                  type="range"
                  min="1"
                  max="100"
                  value={options.quality}
                  onChange={(e) => setOptions(prev => ({ 
                    ...prev, 
                    quality: parseInt(e.target.value) 
                  }))}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>

              <div>
                <Label htmlFor="format">Output Format</Label>
                <select
                  id="format"
                  value={options.format}
                  onChange={(e) => setOptions(prev => ({ ...prev, format: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="original">Original Format</option>
                  <option value="jpeg">JPEG (Best compression)</option>
                  <option value="png">PNG (Lossless)</option>
                  <option value="webp">WebP (Modern)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxWidth">Max Width (px)</Label>
                  <Input
                    id="maxWidth"
                    type="number"
                    value={options.maxWidth || ''}
                    onChange={(e) => setOptions(prev => ({
                      ...prev,
                      maxWidth: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="maxHeight">Max Height (px)</Label>
                  <Input
                    id="maxHeight"
                    type="number"
                    value={options.maxHeight || ''}
                    onChange={(e) => setOptions(prev => ({
                      ...prev,
                      maxHeight: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={handleCompress} 
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                      Compressing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Compress Image
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetTool}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Compressing...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Download Section */}
      {downloadUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <Download className="h-5 w-5" />
              <span>Ready to Download</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Your compressed image is ready!</p>
                <p className="text-sm text-muted-foreground">
                  File size reduced by {getCompressionRatio()}%
                </p>
              </div>
              <Button asChild>
                <a href={downloadUrl} download={`compressed_${file?.name}`}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        <span>Your files are processed securely and deleted after 1 hour</span>
      </div>
    </div>
  )
}