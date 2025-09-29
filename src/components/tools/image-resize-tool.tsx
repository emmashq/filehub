"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, RotateCcw, Lock, Image as ImageIcon, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { BackButton } from "@/components/back-button"

interface ResizeOptions {
  width?: number
  height?: number
  unit: "px" | "%" | "cm"
  maintainAspectRatio: boolean
  quality: number
  format: string
}

export function ImageResizeTool() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [options, setOptions] = useState<ResizeOptions>({
    width: undefined,
    height: undefined,
    unit: "px",
    maintainAspectRatio: true,
    quality: 90,
    format: "original"
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const toolName = "image-resize"

  useEffect(() => {
    checkBookmarkStatus()
  }, [])

  const checkBookmarkStatus = async () => {
    try {
      const response = await fetch('/api/bookmarks')
      if (response.ok) {
        const bookmarks = await response.json()
        setIsBookmarked(bookmarks.some((b: any) => b.toolName === toolName))
      }
    } catch (error) {
      console.error('Failed to check bookmark status:', error)
    }
  }

  const toggleBookmark = async () => {
    try {
      if (isBookmarked) {
        await fetch('/api/bookmarks', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ toolName })
        })
        toast({
          title: "Removed from favorites",
          description: "Tool removed from your favorites"
        })
      } else {
        await fetch('/api/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ toolName })
        })
        toast({
          title: "Added to favorites",
          description: "Tool saved to your favorites"
        })
      }
      setIsBookmarked(!isBookmarked)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      })
    }
  }

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
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      setDownloadUrl(null)
      
      // Get image dimensions
      const img = new Image()
      img.onload = () => {
        setOptions(prev => ({
          ...prev,
          width: img.width,
          height: img.height
        }))
      }
      img.src = url
    }
  }

  const handleResize = async () => {
    if (!file || !previewUrl) return

    setIsProcessing(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('width', options.width?.toString() || '')
      formData.append('height', options.height?.toString() || '')
      formData.append('unit', options.unit)
      formData.append('maintainAspectRatio', options.maintainAspectRatio.toString())
      formData.append('quality', options.quality.toString())
      formData.append('format', options.format)

      const response = await fetch('/api/image-resize', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to resize image')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      
      toast({
        title: "Success!",
        description: "Image resized successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resize image. Please try again.",
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
    setOptions({
      width: undefined,
      height: undefined,
      unit: "px",
      maintainAspectRatio: true,
      quality: 90,
      format: "original"
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex justify-start">
        <BackButton href="/tools" />
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Resize Image</h1>
            <p className="text-muted-foreground">
              Change image dimensions while maintaining quality. Supports JPG, PNG, WebP, and more.
            </p>
          </div>
          <Button
            variant={isBookmarked ? "default" : "outline"}
            size="sm"
            onClick={toggleBookmark}
            className="ml-4"
          >
            <Star className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? 'Favorited' : 'Favorite'}
          </Button>
        </div>
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
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>{file.name}</span>
                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Resize Options</CardTitle>
              <CardDescription>
                Configure how you want to resize your image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    value={options.width || ''}
                    onChange={(e) => setOptions(prev => ({
                      ...prev,
                      width: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                    placeholder="Width"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    value={options.height || ''}
                    onChange={(e) => setOptions(prev => ({
                      ...prev,
                      height: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                    placeholder="Height"
                    disabled={options.maintainAspectRatio}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select value={options.unit} onValueChange={(value: "px" | "%" | "cm") => 
                  setOptions(prev => ({ ...prev, unit: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="px">Pixels (px)</SelectItem>
                    <SelectItem value="%">Percentage (%)</SelectItem>
                    <SelectItem value="cm">Centimeters (cm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="format">Output Format</Label>
                <Select value={options.format} onValueChange={(value) => 
                  setOptions(prev => ({ ...prev, format: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Original Format</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="aspect-ratio"
                  checked={options.maintainAspectRatio}
                  onChange={(e) => setOptions(prev => ({ 
                    ...prev, 
                    maintainAspectRatio: e.target.checked 
                  }))}
                />
                <Label htmlFor="aspect-ratio" className="text-sm">
                  Maintain aspect ratio
                </Label>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={handleResize} 
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Resize Image
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
                <span>Processing...</span>
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
                <p className="font-medium">Your resized image is ready!</p>
                <p className="text-sm text-muted-foreground">
                  Click the button below to download your file
                </p>
              </div>
              <Button asChild>
                <a href={downloadUrl} download={`resized_${file?.name}`}>
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