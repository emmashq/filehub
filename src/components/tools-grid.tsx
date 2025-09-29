"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Image as ImageIcon, 
  FileText, 
  Download, 
  Star,
  ArrowRight,
  FileImage as Convert
} from "lucide-react"
import Link from "next/link"

interface Tool {
  id: string
  name: string
  description: string
  category: "image" | "document"
  icon: any
  href: string
  popular?: boolean
  features: string[]
}

const tools: Tool[] = [
  // Image Tools
  {
    id: "image-convert",
    name: "Convert Image",
    description: "Convert between PNG, JPG, WebP, and more",
    category: "image",
    icon: Convert,
    href: "/image-convert",
    popular: true,
    features: ["PNG ↔ JPG", "WebP support", "Batch conversion"]
  },
  
  // Document Tools
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF documents to editable Word files",
    category: "document",
    icon: FileText,
    href: "/pdf-to-word",
    popular: true,
    features: ["Preserve formatting", "Text editing", "Table support"]
  }
]

export function ToolsGrid() {
  const imageTools = tools.filter(tool => tool.category === "image")
  const documentTools = tools.filter(tool => tool.category === "document")

  const ToolCard = ({ tool }: { tool: Tool }) => {
    const IconComponent = tool.icon
    return (
      <Card className="h-full hover:shadow-lg transition-shadow duration-200 group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <IconComponent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
                {tool.popular && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <CardDescription className="text-sm">
            {tool.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Features:</p>
              <div className="flex flex-wrap gap-1">
                {tool.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {tool.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{tool.features.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
            
            <Button className="w-full group" asChild>
              <Link href={tool.href}>
                <Download className="w-4 h-4 mr-2" />
                Use Tool
                <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Image Tools Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <ImageIcon className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Image Tools</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional image processing tools to resize, compress, and convert your images with perfect quality
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {imageTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        {/* Document Tools Section */}
        <div>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileText className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Document Tools</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Convert between document formats seamlessly. PDF to Word, Excel, TXT and more with formatting preserved
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}