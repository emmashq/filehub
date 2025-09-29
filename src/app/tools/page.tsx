import { Metadata } from "next"
import { ToolsScreen } from "@/components/tools-screen"

export const metadata: Metadata = {
  title: "All Tools - File Conversion Tools | emmas",
  description: "Explore all file conversion tools available on emmas. Convert images and documents instantly.",
  keywords: ["file tools", "image converter", "document converter", "conversion tools", "emmas"],
  openGraph: {
    title: "All Tools - File Conversion Tools",
    description: "Explore all file conversion tools available on emmas.",
    type: "website",
  },
}

export default function ToolsPage() {
  return <ToolsScreen />
}