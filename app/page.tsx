"use client"

import { CreditCard, Eye, ArrowRight, Building2, Wallet, Plus, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SpendingChart } from "@/components/spending-chart"
import { GlassCard } from "@/components/glass-card"
import Image from "next/image"
import Link from 'next/link'
import { useEffect, useState } from "react"
import { createLinkToken, exchangePublicToken } from "@/lib/api/plaid"
import { fetchDashboard, DashboardData } from "@/lib/api/database"

// Sample data
// const linkedBanks = [
//   {
//     id: 1,
//     name: "Chase Bank",
//     lastFour: "1234",
//     accountType: "Checking",
//     logo: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: 2,
//     name: "Bank of America",
//     lastFour: "5678",
//     accountType: "Savings",
//     logo: "/placeholder.svg?height=40&width=40",
//   },
// ]

// const recentTransactions = [
//   {
//     id: 1,
//     date: "Dec 15, 2023",
//     merchant: "Starbucks Coffee",
//     category: "Food",
//     amount: -12.45,
//   },
//   {
//     id: 2,
//     date: "Dec 14, 2023",
//     merchant: "Amazon Purchase",
//     category: "Shopping",
//     amount: -89.99,
//   },
//   {
//     id: 3,
//     date: "Dec 14, 2023",
//     merchant: "Uber Ride",
//     category: "Transportation",
//     amount: -24.5,
//   },
//   {
//     id: 4,
//     date: "Dec 13, 2023",
//     merchant: "Netflix Subscription",
//     category: "Entertainment",
//     amount: -15.99,
//   },
//   {
//     id: 5,
//     date: "Dec 12, 2023",
//     merchant: "Grocery Store",
//     category: "Food",
//     amount: -156.78,
//   },
//   {
//     id: 6,
//     date: "Dec 11, 2023",
//     merchant: "Gas Station",
//     category: "Transportation",
//     amount: -45.2,
//   },
//   {
//     id: 7,
//     date: "Dec 10, 2023",
//     merchant: "Restaurant Dinner",
//     category: "Food",
//     amount: -78.5,
//   },
//   {
//     id: 8,
//     date: "Dec 9, 2023",
//     merchant: "Online Shopping",
//     category: "Shopping",
//     amount: -234.99,
//   },
// ]

// const spendingData = [
//   { name: "Food", value: 850, color: "#3b82f6" },
//   { name: "Shopping", value: 650, color: "#8b5cf6" },
//   { name: "Transportation", value: 320, color: "#06b6d4" },
//   { name: "Entertainment", value: 280, color: "#f59e0b" },
//   { name: "Utilities", value: 450, color: "#10b981" },
//   { name: "Other", value: 180, color: "#ef4444" },
// ]

// const totalSpent = spendingData.reduce((sum, item) => sum + item.value, 0)

export default function Dashboard() {
  // Connect new bank item
  useEffect(() => {
    async function initPlaid() {
      try {
        const { link_token } = await createLinkToken()
  
        const handler = (window as any).Plaid.create({
          token: link_token,
          onSuccess: async (public_token: string, metadata: any) => {
            console.log("Public token received:", public_token)
  
            try {
              await exchangePublicToken(public_token, metadata.institution?.name)
              window.location.reload()
            } catch (err) {
              console.error("Error exchanging token:", err)
            }
          },
        })
  
        // Attach Plaid handler to button click
        const btn = document.getElementById("link-button")
        if (btn) btn.onclick = () => handler.open()
      } catch (err) {
        console.error("Error creating Plaid link token:", err)
      }
    }
  
    initPlaid()
  }, [])

  // Get dashboard data
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    total_spent: 0,
    linked_banks: [],
    transactions: [],
    spending_by_category: []
  });  
  const [error, setError ] = useState<string | null>(null);
  const [loading, setLoading ] = useState<boolean>(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
  
        // Fetch dashboard data (accounts, transactions, categories, etc.)
        const data = await fetchDashboard()
        setDashboardData(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
  
    loadDashboard()
  }, [])
  
  console.log("Dashboard data fetched: ", dashboardData);

  // Loading page
  if (loading) return (
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

  // Handling errors
  if (error) return <div>Error loading dashboard: {error}</div>;
  if (!dashboardData) return <div>No dashboard data available.</div>;

  // Adjust data for frontend use
  const linkedBanks = dashboardData.linked_banks;
  const totalSpent = dashboardData.total_spent;
  const spendingData = dashboardData.spending_by_category;
  const recentTransactions = dashboardData.transactions;

  // Show no accounts page if no banks are linked
  if (linkedBanks.length == 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Background Pattern */}
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
                    className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                  >
                    <User className="h-5 w-5 text-gray-700" />
                  </Button>
                </div>
              </div>
            </div>
          </nav>

          {/* No Accounts Linked Page */}
          <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 pt-24">
            <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center text-center">

                {/* Main Content */}
                <div className="space-y-6">
                  <div className="space-y-3 pb-4  ">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Welcome to Spenderella!
                    </h1>
                    <h2 className="text-2xl font-semibold text-gray-800">No Accounts Linked Yet</h2>
                  </div>

                  {/* <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto">
                    Connect your bank accounts and manage your finances like magic! ✨
                  </p> */}

                  {/* Call to Action */}
                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6 h-auto"
                      id="link-button"
                    >
                      <Plus className="mr-3 h-6 w-6" />
                      Link Your First Account
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </Button>

                    <p className="text-sm text-gray-500">We support 10,000+ banks and credit unions</p>
                  </div>
                </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

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
                  className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                >
                  <User className="h-5 w-5 text-gray-700" />
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pt-24">
          <div className="space-y-8">
            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Total Spent This Month */}
              <div className="lg:col-span-1">
                <GlassCard className="p-8 text-center h-full flex flex-col justify-center">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Total Spent This Month</h2>
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {/* fix format! */}
                    ${totalSpent.toLocaleString()} 
                  </div>
                </GlassCard>
              </div>

              {/* Spending by Category */}
              <div className="lg:col-span-2">
                <GlassCard className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Spending by Category</h3>
                  <div className="flex items-center justify-center">
                    <SpendingChart data={spendingData} />
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {spendingData.map((category) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                          <span className="text-sm font-medium text-gray-700">{category.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">${category.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Linked Banks Section */}
              <div className="lg:col-span-1">
                <GlassCard className="p-6 bg-white/30 h-[500px] flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Linked Accounts</h3>
                    {linkedBanks.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/40 border-white/50 hover:bg-white/60 text-gray-700 transition-all"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Manage
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="space-y-4">
                      {linkedBanks.map((bank) => (
                        <div
                          key={bank.id}
                          className="flex items-center gap-4 p-4 rounded-xl bg-white/40 border border-white/50 hover:bg-white/60 transition-all"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 border border-white/50 shadow-sm">
                            <Building2 className="h-6 w-6 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{bank.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>••••{bank.lastFour}</span>
                              <Badge variant="outline" className="bg-white/50 border-white/60 text-gray-700 text-xs">
                                {bank.accountType}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </GlassCard>
              </div>

              {/* Recent Transactions */}
              <div className="lg:col-span-2">
                <GlassCard className="p-6 bg-white/30 h-[500px] flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Recent Transactions</h3>
                      <Link href="/transactions">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/40 border-white/50 hover:bg-white/60 text-gray-700 transition-all"
                          >
                          <Eye className="mr-2 h-4 w-4" />
                          View All
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="space-y-3">
                      {recentTransactions.map((transaction) => {
                        const categoryColor =
                          spendingData.find((cat) => cat.name === transaction.category)?.color || "#6b7280"
                        return (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-white/50 hover:bg-white/60 transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 border border-white/70 shadow-sm">
                                <Wallet className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{transaction.merchant || transaction.original_name }</p>
                                <p className="text-sm text-gray-500">{transaction.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-800">${Math.abs(transaction.amount).toFixed(2)}</p>
                              <Badge
                                variant="outline"
                                className="bg-white/50 border-white/60 text-xs font-medium"
                                style={{ color: categoryColor, borderColor: categoryColor + "40" }}
                              >
                                {transaction.category}
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </GlassCard>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
