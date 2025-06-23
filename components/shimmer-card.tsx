"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function ShimmerCard({ title, value, trend, description, icon: Icon, className }) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg transition-all hover:shadow-xl",
        className,
      )}
    >
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Magical Background Elements */}
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-amber-200/20 blur-xl" />
      <div className="absolute -left-8 -bottom-8 h-16 w-16 rounded-full bg-orange-200/20 blur-xl" />

      <CardContent className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-amber-700/80">{title}</p>
            <h2 className="text-3xl font-bold text-amber-900">{value}</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-emerald-600">{trend}</span>
              <span className="text-sm text-amber-600/70">{description}</span>
            </div>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-400 shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl">
            <Icon className="h-8 w-8 text-white drop-shadow-sm" />
          </div>
        </div>

        {/* Sparkle Elements */}
        <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-amber-400 opacity-60 animate-pulse" />
        <div className="absolute left-6 bottom-6 h-1 w-1 rounded-full bg-orange-400 opacity-80 animate-pulse delay-500" />
        <div className="absolute right-8 bottom-8 h-1.5 w-1.5 rounded-full bg-amber-300 opacity-70 animate-pulse delay-1000" />
      </CardContent>
    </Card>
  )
}
