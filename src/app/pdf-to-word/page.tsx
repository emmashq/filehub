import { Metadata } from "next"
import { PdfToWordTool } from "@/components/tools/pdf-to-word-tool"

export const metadata: Metadata = {
  title: "PDF to Word Converter - Free Online PDF to DOCX | emmas",
  description: "Convert PDF to Word documents online for free. Preserve formatting, tables, and images. No registration required.",
  keywords: ["pdf to word", "pdf to docx", "convert pdf to word", "pdf converter", "online pdf to word"],
  openGraph: {
    title: "PDF to Word Converter - Free Online",
    description: "Convert PDF to Word documents online for free. Preserve formatting and quality.",
    type: "website",
  },
}

export default function PdfToWordPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PdfToWordTool />
    </div>
  )
}