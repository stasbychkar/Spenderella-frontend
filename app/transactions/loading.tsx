"use client"

// Most likely this file does nothing

import { useEffect, useState } from "react"
import Image from "next/image"

export default function Loading() {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(0)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      style={{
        transition: "opacity 0.5s ease-in-out",
        opacity: opacity,
      }}
    >
      <div className="text-center">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/logo.png"
            alt="Spenderella Logo"
            width={80}
            height={80}
            className="object-contain animate-pulse"
          />
          <div className="mt-6 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full overflow-hidden">
            <div className="h-full bg-white/80 animate-[shimmer_1s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
