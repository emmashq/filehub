"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Shield, Image as ImageIcon, FileText } from "lucide-react"
import Link from "next/link"
import { BackButton } from "@/components/back-button"

export function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Back Button (hidden on home page but available for consistency) */}
        <div className="hidden">
          <BackButton />
        </div>
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">e</span>
            </div>
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">emmas</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Convert Files</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Instantly
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Free online tools to convert your images and documents. Fast, simple, and unlimited file processing.
          </p>

          {/* CTA Button */}
          <Button 
            size="lg" 
            className="px-12 py-6 text-xl font-semibold bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            asChild
          >
            <Link href="/tools">
              Start Converting
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
          </Button>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Convert files in seconds with our powerful processing engine</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your files are processed securely and deleted automatically</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">High Quality</h3>
              <p className="text-gray-600">Maintain excellent quality in all your conversions</p>
            </div>
          </div>
        </div>

        {/* Available Tools Preview */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">Available Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="group p-8 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Image Converter</h3>
              <p className="text-gray-600 mb-6">Convert between PNG, JPG, WebP, and other image formats</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">PNG ↔ JPG</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">WebP Support</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Batch Convert</span>
              </div>
            </div>

            <div className="group p-8 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Document Converter</h3>
              <p className="text-gray-600 mb-6">Convert PDF to Word and other document formats</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">PDF ↔ Word</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Format Preserved</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Text Editing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="inline-block p-1 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl">
            <div className="bg-white rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to get started?</h2>
              <p className="text-gray-600 mb-6">Join thousands of users who trust emmas for their file conversion needs</p>
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                asChild
              >
                <Link href="/tools">
                  Start Converting Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}