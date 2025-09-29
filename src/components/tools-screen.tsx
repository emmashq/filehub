"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Image as ImageIcon, 
  FileText, 
  Download, 
  ArrowRight,
  Sparkles,
  Zap,
  Shield
} from "lucide-react"
import Link from "next/link"
import { BackButton } from "@/components/back-button"

interface Tool {
  id: string
  name: string
  description: string
  category: "image" | "document"
  icon: any
  href: string
  features: string[]
  color: string
}

const tools: Tool[] = [
  {
    id: "image-convert",
    name: "Image Converter",
    description: "Convert between PNG, JPG, WebP, and other image formats instantly",
    category: "image",
    icon: ImageIcon,
    href: "/image-convert",
    features: ["PNG ↔ JPG", "WebP Support", "High Quality", "Fast Processing"],
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "pdf-to-word",
    name: "Document Converter",
    description: "Convert PDF documents to editable Word files with formatting preserved",
    category: "document",
    icon: FileText,
    href: "/pdf-to-word",
    features: ["PDF ↔ Word", "Format Preserved", "Text Editing", "Table Support"],
    color: "from-orange-500 to-orange-600"
  }
]

export function ToolsScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <BackButton href="/" />
        </div>
        
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">e</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">emmas</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            All Conversion Tools
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Choose from our powerful file conversion tools. All free, all fast, all secure.
          </p>

          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">2</div>
              <div className="text-gray-600">Tools Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">50MB</div>
              <div className="text-gray-600">Max File Size</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">100%</div>
              <div className="text-gray-600">Free</div>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {tools.map((tool) => {
            const IconComponent = tool.icon
            return (
              <Card 
                key={tool.id} 
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${tool.color}`}></div>
                <CardHeader className="pb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 bg-gradient-to-br ${tool.color} rounded-xl`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                          {tool.name}
                        </CardTitle>
                        <Badge 
                          variant="secondary" 
                          className="mt-2 text-sm capitalize"
                        >
                          {tool.category} Tool
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {/* Features */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {tool.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Benefits */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Zap className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                        <span className="text-xs text-gray-700">Lightning Fast</span>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Shield className="h-5 w-5 text-green-600 mx-auto mb-1" />
                        <span className="text-xs text-gray-700">Secure</span>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <Sparkles className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                        <span className="text-xs text-gray-700">High Quality</span>
                      </div>
                    </div>
                    
                    {/* CTA Button */}
                    <Button 
                      className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 transition-all duration-300"
                      asChild
                    >
                      <Link href={tool.href}>
                        <Download className="w-5 h-5 mr-2" />
                        Use {tool.name}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}