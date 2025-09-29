import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogType?: 'website' | 'article'
  ogImage?: string
  twitterCard?: 'summary' | 'summary_large_image'
  noIndex?: boolean
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  canonical,
  ogType = 'website',
  ogImage,
  twitterCard = 'summary_large_image',
  noIndex = false
}: SEOProps): Metadata {
  const baseTitle = "FileHub - Free File Tools for Images & Documents"
  const fullTitle = title === baseTitle ? title : `${title} | FileHub`
  
  const defaultKeywords = [
    "file tools", "image converter", "pdf converter", "resize image", 
    "compress image", "pdf to word", "word to pdf", "free file converter"
  ]

  const allKeywords = [...keywords, ...defaultKeywords]

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: "FileHub Team" }],
    openGraph: {
      title: fullTitle,
      description,
      type: ogType,
      siteName: "FileHub",
      ...(ogImage && { images: [ogImage] })
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      ...(ogImage && { images: [ogImage] })
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    },
    ...(canonical && { alternates: { canonical } }),
    other: {
      'twitter:creator': '@filehub',
      'twitter:site': '@filehub',
    }
  }

  return metadata
}

// Structured data generators
export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FileHub",
    "description": "Free online tools to resize, compress, and convert images and documents",
    "url": "https://filehub.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://filehub.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
}

export function generateToolStructuredData(toolName: string, description: string, category: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": toolName,
    "description": description,
    "applicationCategory": category,
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "FileHub"
    }
  }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}