import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import Image from "next/image"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Background Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5" />
      <div
        className="fixed inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), 
                          radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10">
        {/* Top Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-white/10 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="Spenderella Logo" width={48} height={48} className="object-contain" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Spenderella
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
                  <User className="h-5 w-5 text-gray-700" />
                </Button>
              </div>
            </div>
          </div>
        </nav>      
      </div>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 pt-24">
            <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center text-center">
                <div className="space-y-6">
                  <div className="space-y-3 pb-4  ">
                    <h2 className="text-xl font-semibold text-gray-800">Loading...</h2>
                  </div>
                </div>
            </div>
      </main>
    </div>
  )
}
