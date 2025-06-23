import type React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
