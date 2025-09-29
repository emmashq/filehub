import { Metadata } from "next"
import { ImageConvertTool } from "@/components/tools/image-convert-tool"

export const metadata: Metadata = {
  title: "Convert Image Online - Free Image Converter | emmas",
  description: "Convert images between PNG, JPG, WebP, and other formats. Free online image converter with high quality output.",
  keywords: ["convert image", "image converter", "png to jpg", "jpg to png", "webp converter", "online image converter"],
  openGraph: {
    title: "Convert Image Online - Free Image Converter",
    description: "Convert images between PNG, JPG, WebP, and other formats. Free online image converter with high quality output.",
    type: "website",
  },
}

export default function ImageConvertPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ImageConvertTool />
    </div>
  )
}