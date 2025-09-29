import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://filehub.com'
  
  const tools = [
    { url: '/image-resize', priority: 0.9 },
    { url: '/image-compress', priority: 0.9 },
    { url: '/image-scale', priority: 0.8 },
    { url: '/image-convert', priority: 0.9 },
    { url: '/pdf-to-word', priority: 0.9 },
    { url: '/word-to-pdf', priority: 0.8 },
    { url: '/pdf-to-excel', priority: 0.8 },
    { url: '/pdf-to-txt', priority: 0.7 },
    { url: '/txt-to-pdf', priority: 0.8 },
  ]
  
  const staticPages = [
    { url: '/', priority: 1.0 },
    { url: '/image-tools', priority: 0.8 },
    { url: '/document-tools', priority: 0.8 },
    { url: '/favorites', priority: 0.6 },
    { url: '/privacy', priority: 0.3 },
    { url: '/terms', priority: 0.3 },
    { url: '/contact', priority: 0.4 },
  ]
  
  const allPages = [...staticPages, ...tools]
  
  return allPages.map(({ url, priority }) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority,
  }))
}