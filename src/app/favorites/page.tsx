import { Metadata } from "next"
import { BookmarksManager } from "@/components/bookmarks-manager"

export const metadata: Metadata = {
  title: "Favorites - Saved Tools | emmas",
  description: "Your favorite file conversion and processing tools. Quick access to your most used tools.",
  keywords: ["favorites", "bookmarks", "saved tools", "quick access", "file tools"],
  openGraph: {
    title: "Favorites - Saved Tools",
    description: "Your favorite file conversion and processing tools.",
    type: "website",
  },
}

export default function FavoritesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BookmarksManager />
    </div>
  )
}