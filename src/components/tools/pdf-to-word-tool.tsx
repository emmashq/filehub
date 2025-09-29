"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Upload, Download, RotateCcw, Lock, FileText, File, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { BackButton } from "@/components/back-button"

export function PdfToWordTool() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [conversionStatus, setConversionStatus] = useState<string>("")
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive"
        })
        return
      }
      
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 50MB",
          variant: "destructive"
        })
        return
      }
      
      setFile(selectedFile)
      setDownloadUrl(null)
      setConversionStatus("")
    }
  }

  const handleConvert = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)
    setConversionStatus("Initializing conversion...")

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('/api/pdf-to-word', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error('Failed to convert PDF')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      setProgress(100)
      setConversionStatus("Conversion completed successfully!")
      
      toast({
        title: "Success!",
        description: "PDF converted to Word successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert PDF. Please try again.",
        variant: "destructive"
      })
      setConversionStatus("Conversion failed")
    } finally {
      setIsProcessing(false)
    }
  }

  const resetTool = () => {
    setFile(null)
    setDownloadUrl(null)
    setConversionStatus("")
    setProgress(0)
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

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex justify-start">
        <BackButton href="/tools" />
      </div>
      
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">PDF to Word</h1>
        <p className="text-muted-foreground">
          Convert PDF documents to editable Word files. Preserve formatting, tables, and images.
        </p>
      </div>

      {/* Upload Section */}
      {!file && (
        <Card>
          <CardContent className="p-8">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Upload your PDF file</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to select. Max file size: 50MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload">
                <Button className="mt-4" asChild>
                  <span>Select PDF File</span>
                </Button>
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Info */}
      {file && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>File Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <File className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={resetTool}>
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversion Options */}
      {file && !downloadUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion Options</CardTitle>
            <CardDescription>
              Configure how you want to convert your PDF
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Standard Conversion</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Best for most documents. Preserves text formatting and basic layout.
                  </p>
                  <Badge variant="secondary">Recommended</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Advanced Conversion</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Preserves complex layouts, tables, and images. May take longer.
                  </p>
                  <Badge variant="outline">Premium</Badge>
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
                      <Download className="w-4 h-4 mr-2" />
                      Convert to Word
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetTool}>
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>{conversionStatus}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
              <div className="text-xs text-muted-foreground">
                This may take a few moments depending on file size and complexity...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Download Section */}
      {downloadUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Conversion Complete</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Your Word document is ready!</p>
                  <p className="text-sm text-muted-foreground">
                    The converted file maintains the original formatting and layout
                  </p>
                </div>
                <Button asChild>
                  <a href={downloadUrl} download={`converted_${file?.name.replace('.pdf', '.docx')}`}>
                    <Download className="w-4 h-4 mr-2" />
                    Download DOCX
                  </a>
                </Button>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">What's included:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Text formatting and styles</li>
                  <li>• Tables and structure</li>
                  <li>• Images and graphics</li>
                  <li>• Page layout and formatting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Preserve Formatting</h4>
                <p className="text-sm text-muted-foreground">
                  Maintain fonts, colors, and layout from the original PDF
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Table Support</h4>
                <p className="text-sm text-muted-foreground">
                  Convert complex tables with proper formatting
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Image Extraction</h4>
                <p className="text-sm text-muted-foreground">
                  Extract and embed images from the PDF
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Text Editing</h4>
                <p className="text-sm text-muted-foreground">
                  Fully editable Word document output
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        <span>Your files are processed securely and deleted after 1 hour</span>
      </div>
    </div>
  )
}