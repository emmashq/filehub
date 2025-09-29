"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download, RotateCcw, Lock, Image as ImageIcon, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { BackButton } from "@/components/back-button"

interface ConversionOptions {
  targetFormat: string
  quality: number
}

export function ImageConvertTool() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [convertedSize, setConvertedSize] = useState<number>(0)
  const [options, setOptions] = useState<ConversionOptions>({
    targetFormat: "jpg",
    quality: 90
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
      setConvertedSize(0)
      
      // Set default target format based on current format
      const currentFormat = selectedFile.type.split('/')[1]
      if (currentFormat === 'png') {
        setOptions(prev => ({ ...prev, targetFormat: 'jpg' }))
      } else if (currentFormat === 'jpeg' || currentFormat === 'jpg') {
        setOptions(prev => ({ ...prev, targetFormat: 'png' }))
      }
    }
  }

  const handleConvert = async () => {
    if (!file || !previewUrl) return

    setIsProcessing(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('targetFormat', options.targetFormat)
      formData.append('quality', options.quality.toString())

      const response = await fetch('/api/image-convert', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to convert image')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      setConvertedSize(blob.size)
      
      toast({
        title: "Success!",
        description: "Image converted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert image. Please try again.",
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
    setConvertedSize(0)
    setOptions({
      targetFormat: "jpg",
      quality: 90
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getCurrentFormat = () => {
    if (!file) return ''
    return file.type.split('/')[1].toUpperCase()
  }

  const getSupportedFormats = () => {
    const formats = [
      { value: 'jpg', label: 'JPEG', description: 'Best for photos' },
      { value: 'png', label: 'PNG', description: 'Lossless, supports transparency' },
      { value: 'webp', label: 'WebP', description: 'Modern format, smaller size' }
    ]
    
    // Remove current format from options
    if (file) {
      const currentFormat = file.type.split('/')[1].toLowerCase()
      return formats.filter(format => format.value !== currentFormat)
    }
    
    return formats
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex justify-start">
        <BackButton href="/tools" />
      </div>
      
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Convert Image</h1>
        <p className="text-muted-foreground">
          Convert images between PNG, JPG, WebP, and other formats. Maintain quality while changing format.
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
                  <span className="text-muted-foreground">Current format:</span>
                  <Badge variant="outline">{getCurrentFormat()}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">File size:</span>
                  <span className="font-medium">{formatFileSize(originalSize)}</span>
                </div>
                {convertedSize > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Converted size:</span>
                    <span className="font-medium text-green-600">{formatFileSize(convertedSize)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Options</CardTitle>
              <CardDescription>
                Choose the target format and quality settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="targetFormat">Target Format</Label>
                <Select value={options.targetFormat} onValueChange={(value) => 
                  setOptions(prev => ({ ...prev, targetFormat: value }))
                }>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getSupportedFormats().map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div>
                          <div className="font-medium">{format.label}</div>
                          <div className="text-xs text-muted-foreground">{format.description}</div>
                        </div>
                      </SelectItem>
                    ))}
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
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Conversion Details</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div className="flex justify-between">
                    <span>From:</span>
                    <span className="font-medium">{getCurrentFormat()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>To:</span>
                    <span className="font-medium">{options.targetFormat.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={handleConvert} 
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Convert Image
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
                <span>Converting image...</span>
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
                <p className="font-medium">Your converted image is ready!</p>
                <p className="text-sm text-muted-foreground">
                  Format: {getCurrentFormat()} → {options.targetFormat.toUpperCase()}
                </p>
              </div>
              <Button asChild>
                <a href={downloadUrl} download={`converted_${file?.name.split('.')[0]}.${options.targetFormat}`}>
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