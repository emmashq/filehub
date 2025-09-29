import { cn } from "@/lib/utils"

interface AdPlaceholderProps {
  type: "sidebar" | "footer" | "in-content" | "sponsored"
  className?: string
  sponsoredBy?: string
}

export function AdPlaceholder({ type, className, sponsoredBy }: AdPlaceholderProps) {
  const baseClasses = "bg-muted-foreground/10 rounded-lg p-4 text-center text-sm text-muted-foreground"
  
  const typeClasses = {
    sidebar: "w-full h-[250px] flex items-center justify-center",
    footer: "w-full h-[90px] flex items-center justify-center",
    "in-content": "w-full h-[250px] flex items-center justify-center my-6",
    sponsored: "w-full p-3 border border-primary/20 bg-primary/5",
  }

  const getContent = () => {
    switch (type) {
      case "sponsored":
        return (
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xs">Powered by</span>
            <span className="font-medium text-primary">{sponsoredBy || "Partner"}</span>
          </div>
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 bg-muted-foreground/20 rounded flex items-center justify-center">
              <div className="w-8 h-8 bg-muted-foreground/30 rounded animate-pulse" />
            </div>
            <span>Advertisement Placeholder</span>
            <span className="text-xs">{type === "sidebar" ? "300x250" : type === "footer" ? "728x90" : "728x250"}</span>
          </div>
        )
    }
  }

  return (
    <div className={cn(baseClasses, typeClasses[type], className)}>
      {getContent()}
    </div>
  )
}