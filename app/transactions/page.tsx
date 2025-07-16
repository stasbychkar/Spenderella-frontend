"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, Filter, Wallet, ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GlassCard } from "@/components/glass-card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Link from "next/link"
import { fetchTransactions, TransactionsData } from "@/lib/api/database"
import toTitleCaseFromSnakeCase from "@/lib/str_utils" // didn't finish here

// // Sample transaction data
// const allTransactions = [
//   {
//     id: 1,
//     date: "Dec 15, 2023",
//     merchant: "Starbucks Coffee",
//     category: "Food",
//     amount: -12.45,
//     description: "Coffee and pastry",
//     account: "American Express",
//   },
//   {
//     id: 2,
//     date: "Dec 14, 2023",
//     merchant: "Amazon Purchase",
//     category: "Shopping",
//     amount: -89.99,
//     description: "Electronics accessories",
//     account: "American Express",
//   },
//   {
//     id: 3,
//     date: "Dec 14, 2023",
//     merchant: "Uber Ride",
//     category: "Transportation",
//     amount: -24.5,
//     description: "Ride to downtown",
//     account: "American Express",
//   },
//   {
//     id: 4,
//     date: "Dec 13, 2023",
//     merchant: "Netflix Subscription",
//     category: "Entertainment",
//     amount: -15.99,
//     description: "Monthly subscription",
//     account: "American Express",
//   },
//   {
//     id: 5,
//     date: "Dec 12, 2023",
//     merchant: "Grocery Store",
//     category: "Food",
//     amount: -156.78,
//     description: "Weekly groceries",
//     account: "American Express",
//   },
//   {
//     id: 6,
//     date: "Dec 11, 2023",
//     merchant: "Gas Station",
//     category: "Transportation",
//     amount: -45.2,
//     description: "Fuel",
//     account: "American Express",
//   },
//   {
//     id: 7,
//     date: "Dec 10, 2023",
//     merchant: "Restaurant Dinner",
//     category: "Food",
//     amount: -78.5,
//     description: "Dinner with friends",
//     account: "American Express",
//   },
//   {
//     id: 8,
//     date: "Dec 9, 2023",
//     merchant: "Online Shopping",
//     category: "Shopping",
//     amount: -234.99,
//     description: "Clothing purchase",
//     account: "American Express",
//   },
//   {
//     id: 9,
//     date: "Dec 8, 2023",
//     merchant: "Gym Membership",
//     category: "Other",
//     amount: -49.99,
//     description: "Monthly gym fee",
//     account: "American Express",
//   },
//   {
//     id: 10,
//     date: "Dec 7, 2023",
//     merchant: "Electric Company",
//     category: "Utilities",
//     amount: -125.3,
//     description: "Monthly electric bill",
//     account: "American Express",
//   },
//   {
//     id: 11,
//     date: "Dec 6, 2023",
//     merchant: "Movie Theater",
//     category: "Entertainment",
//     amount: -32.5,
//     description: "Movie tickets",
//     account: "American Express",
//   },
//   {
//     id: 12,
//     date: "Dec 5, 2023",
//     merchant: "Coffee Shop",
//     category: "Food",
//     amount: -8.75,
//     description: "Morning coffee",
//     account: "American Express",
//   },
//   {
//     id: 13,
//     date: "Dec 4, 2023",
//     merchant: "Pharmacy",
//     category: "Other",
//     amount: -23.45,
//     description: "Prescription medication",
//     account: "American Express",
//   },
//   {
//     id: 14,
//     date: "Dec 3, 2023",
//     merchant: "Bookstore",
//     category: "Shopping",
//     amount: -45.6,
//     description: "Books and magazines",
//     account: "American Express",
//   },
//   {
//     id: 15,
//     date: "Dec 2, 2023",
//     merchant: "Internet Provider",
//     category: "Utilities",
//     amount: -79.99,
//     description: "Monthly internet bill",
//     account: "American Express",
//   },
// ]

// const categories = [
//   { name: "Food", color: "#3b82f6" },
//   { name: "Shopping", color: "#8b5cf6" },
//   { name: "Transportation", color: "#06b6d4" },
//   { name: "Entertainment", color: "#f59e0b" },
//   { name: "Utilities", color: "#10b981" },
//   { name: "Other", color: "#ef4444" },
// ]

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionsData>({
    categories: [],
    transactions: [],
  });
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isLoaded, setIsLoaded] = useState(false)
  // analogy to the dashboard page
  const [error, setError ] = useState<string | null>(null);
  const [loading, setLoading ] = useState<boolean>(true);

  // Animation effect when page loads
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Fetch transactions data
  useEffect(() => {
    async function loadTransactions() {
      try {
        setLoading(true)

        const data = await fetchTransactions()
        setTransactions(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [])

  console.log("Dashboard data fetched: ", transactions);

  // Filter transactions based on search and category
  const filteredTransactions = transactions.transactions.filter((transaction) => {
    const merchant = transaction.merchant || ""
    const originalName = transaction.original_name || ""
    const search = searchTerm.toLowerCase()

    const matchesSearch =
      merchant.toLowerCase().includes(search) ||
      originalName.toLowerCase().includes(search)

    const matchesCategory = selectedCategory === "All" || transaction.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Update transaction category
  const updateTransactionCategory = (transactionId: number, newCategory: string) => {
    setTransactions((prev) => ({
      ...prev,
      transactions: prev.transactions.map((transaction) =>
        transaction.id === transactionId ? { ...transaction, category: newCategory } : transaction,
      ),
    }))
  }
  

  const getCategoryColor = (categoryName: string) => {
    return transactions.categories.find((cat) => cat.name === categoryName)?.color || "#6b7280"
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
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pt-24">
          <div className="space-y-8">
            {/* Page Header */}
            {/* <div className="text-center space-y-4">
              <h1 className="text-xl font-semibold text-gray-800 mb-6">
                All Transactions
              </h1>
              <p className="text-gray-600 text-lg">
                View and manage all your transactions. Click on any category to change it.
              </p>
            </div> */}

            {/* Filters and Search */}
            <GlassCard className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Search */}
                  <div className="flex-1 max-w-md">
                      <Input
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 text-sm bg-white/50 border-white/60 focus:bg-white/70 transition-all"
                      />
                  </div>
                  {/* Category Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-white/40 border-white/50 hover:bg-white/60 text-gray-700 transition-all"
                      >
                        <Filter className="mr-2 h-4 w-4" />
                        {selectedCategory}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/95 backdrop-blur-sm border-white/60">
                      <DropdownMenuItem onClick={() => setSelectedCategory("All")}>All Categories</DropdownMenuItem>
                      {transactions.categories.map((category) => (
                        <DropdownMenuItem key={category.name} onClick={() => setSelectedCategory(category.name)}>
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                            {category.name}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </GlassCard>

            {/* Transactions List */}
            <GlassCard className="p-6 bg-white/30">
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {filteredTransactions.length === 0 ? (
                    <div className="text-center py-12">
                      <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No transactions found</h3>
                      <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                    </div>
                  ) : (
                    filteredTransactions.map((transaction) => {
                      const categoryColor = getCategoryColor(transaction.category)
                      return (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-white/50 hover:bg-white/60 transition-all"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/60 border border-white/70 shadow-sm">
                              <Wallet className="h-6 w-6 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-gray-800">{transaction.merchant || transaction.original_name}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-gray-800 text-lg">
                                    ${Math.abs(transaction.amount).toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-500">{transaction.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="text-sm text-gray-500">
                                  <span>{transaction.bank_name} </span>
                                  <Badge variant="outline" className="bg-white/50 border-white/60 text-gray-700 text-xs ">
                                      {transaction.account_type}
                                  </Badge>
                                  <span>••••{transaction.mask}</span>
                                </div>

                                {/* Editable Category */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-white/50 border-white/60 text-xs font-medium hover:bg-white/70 transition-all"
                                      style={{
                                        color: categoryColor,
                                        borderColor: categoryColor + "40",
                                        backgroundColor: categoryColor + "10",
                                      }}
                                    >
                                      {transaction.category}
                                      <ChevronDown className="ml-1 h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="bg-white/95 backdrop-blur-sm border-white/60">
                                    {transactions.categories.map((category) => (
                                      <DropdownMenuItem
                                        key={category.name}
                                        onClick={() => updateTransactionCategory(transaction.id, category.name)}
                                        className="flex items-center gap-2"
                                      >
                                        <div
                                          className="h-3 w-3 rounded-full"
                                          style={{ backgroundColor: category.color }}
                                        />
                                        {category.name}
                                        {transaction.category === category.name && (
                                          <Check className="ml-auto h-4 w-4 text-green-600" />
                                        )}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </ScrollArea>
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  )
}
