import { Button } from "@/components/ui/button"
import { Download, Zap, Shield } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100/[0.05] dark:bg-grid-slate-900/[0.05] bg-[length:20px_20px]" />
      
      <div className="relative container mx-auto max-w-6xl">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Zap className="w-4 h-4 mr-2" />
            100% Free - No Registration Required
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Free File Tools — Fast, Simple, Unlimited
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Convert your images and documents with our powerful online tools. 
            No watermarks, no file limits, completely free.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600" asChild>
              <Link href="/tools">
                <Download className="w-5 h-5 mr-2" />
                Start Converting
              </Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm">Secure Processing</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Lightning Fast</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Download className="w-5 h-5 text-blue-500" />
              <span className="text-sm">High Quality</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}