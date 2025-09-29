"use client"

import { AdPlaceholder } from "@/components/ad-placeholder"

interface AdManagerProps {
  page: string
  position: "sidebar" | "footer" | "in-content" | "sponsored"
  className?: string
  sponsoredBy?: string
}

export function AdManager({ page, position, className, sponsoredBy }: AdManagerProps) {
  // Ad configuration based on page and position
  const getAdConfig = () => {
    const configs = {
      "image-resize": {
        sidebar: { enabled: true, size: "300x250" },
        footer: { enabled: true, size: "728x90" },
        "in-content": { enabled: true, size: "728x250" },
        sponsored: { enabled: true, partner: "Adobe Creative Cloud" }
      },
      "image-compress": {
        sidebar: { enabled: true, size: "300x250" },
        footer: { enabled: true, size: "728x90" },
        "in-content": { enabled: true, size: "728x250" },
        sponsored: { enabled: true, partner: "TinyPNG" }
      },
      "pdf-to-word": {
        sidebar: { enabled: true, size: "300x250" },
        footer: { enabled: true, size: "728x90" },
        "in-content": { enabled: true, size: "728x250" },
        sponsored: { enabled: true, partner: "Microsoft 365" }
      },
      "home": {
        sidebar: { enabled: true, size: "300x600" },
        footer: { enabled: true, size: "728x90" },
        "in-content": { enabled: true, size: "728x250" },
        sponsored: { enabled: false }
      }
    }

    return configs[page as keyof typeof configs]?.[position] || { enabled: false }
  }

  const config = getAdConfig()

  if (!config.enabled) {
    return null
  }

  return (
    <AdPlaceholder 
      type={position}
      className={className}
      sponsoredBy={sponsoredBy || config.partner}
    />
  )
}