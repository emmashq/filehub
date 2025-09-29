import { Metadata } from "next"
import { ImageCompressTool } from "@/components/tools/image-compress-tool"

export const metadata: Metadata = {
  title: "Compress Image Online - Free Image Compressor | emmas",
  description: "Compress images online for free. Reduce file size without losing quality. Support for JPG, PNG, WebP formats.",
  keywords: ["compress image", "image compressor", "online image compression", "reduce image size", "optimize image"],
  openGraph: {
    title: "Compress Image Online - Free Image Compressor",
    description: "Compress images online for free. Reduce file size without losing quality.",
    type: "website",
  },
}

export default function ImageCompressPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ImageCompressTool />
    </div>
  )
}