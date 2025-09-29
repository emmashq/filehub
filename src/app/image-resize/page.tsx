import { Metadata } from "next"
import { ImageResizeTool } from "@/components/tools/image-resize-tool"

export const metadata: Metadata = {
  title: "Resize Image Online - Free Image Resizer | emmas",
  description: "Resize images online for free. Change dimensions, maintain aspect ratio, and support multiple formats. No registration required.",
  keywords: ["resize image", "image resizer", "online image resize", "free image resizer", "change image size"],
  openGraph: {
    title: "Resize Image Online - Free Image Resizer",
    description: "Resize images online for free. Change dimensions, maintain aspect ratio, and support multiple formats.",
    type: "website",
  },
}

export default function ImageResizePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ImageResizeTool />
    </div>
  )
}