"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  href?: string
  className?: string
}

export function BackButton({ href, className = "" }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={`flex items-center space-x-2 ${className}`}
      onClick={handleClick}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back</span>
    </Button>
  )
}