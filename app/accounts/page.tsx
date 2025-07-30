"use client"

import { Plus, ArrowLeft, User, Trash2, ArrowRight, SearchX, Building2, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from 'next/link'
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createLinkToken, exchangePublicToken } from "@/lib/api/plaid"
import { fetchAccounts, BASE_URL } from "@/lib/api/database"

interface BankAccount {
  id: number
  bankName: string
  accountType: string
  lastFourDigits: string
}

// Sample data
// const initialAccounts: BankAccount[] = [
//   {
//     id: 1,
//     bankName: "Bank of America",
//     accountType: "checking",
//     lastFourDigits: "0000",
//   },
//   {
//     id: 2,
//     bankName: "Bank of America",
//     accountType: "savings",
//     lastFourDigits: "1111",
//   },
//   {
//     id: 3,
//     bankName: "Bank of America",
//     accountType: "credit card",
//     lastFourDigits: "3333",
//   },
//   {
//     id: 4,
//     bankName: "Chase Bank",
//     accountType: "checking",
//     lastFourDigits: "5555",
//   },
// ]

export default function ManageAccounts() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState<BankAccount | null>(null)
  const [loading, setLoading ] = useState<boolean>(true);
  const [error, setError ] = useState<string | null>(null);

  // Fetch accounts data
  useEffect(() => {
    async function loadAccounts() {
      try {
        setLoading(true)

        const data = await fetchAccounts()

        setAccounts(data.linked_accounts)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    loadAccounts()
  }, [])

  console.log("Accounts data fetched: ", accounts)

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

  // Handle account deletion
  const handleDeleteAccount = (account: BankAccount) => {
    setDeletingAccount(account)
    setIsDeleteDialogOpen(true)
  }

  // Confirm account deletion
  const handleConfirmDelete = async () => {
    if (deletingAccount) {
      // UI
      const updatedAccounts = accounts.filter((account) => account.id !== deletingAccount.id)
      setAccounts(updatedAccounts)
      setIsDeleteDialogOpen(false)
      setDeletingAccount(null)
      // Database
      try {
        const res = await fetch(`${BASE_URL}/db-delete-linked_account`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                id: deletingAccount.id,
            })
        })
        
        if (!res.ok) {
            throw new Error("Category backend delete failed")
        }

        const data = await res.json();
        console.log("Successfully deleted:", data);

      } catch (err) {
        console.log("Deleting custom category failed: ", err)
      }
      console.log("Deleting account:", deletingAccount.id)
    }
  }

  // Handle connecting new account

  // Get account icon - same for all accounts
  const getAccountIcon = () => {
    return <Building2 className="w-5 h-5 text-slate-500" />
  }

  // Format account type for display
  const formatAccountType = (accountType: string) => {
    return accountType.charAt(0).toUpperCase() + accountType.slice(1)
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
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo.png" alt="Spenderella Logo" width={48} height={48} className="object-contain" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Spenderella 
                </h1>
              </Link>

              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/50 transition-all"
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
            <div className="items-center justify-between mb-6 flex-wrap">

              {/* Linked Accounts */}
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">Linked Accounts</h2>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-4 py-2 h-auto"
                    id="link-button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Connect Account
                  </Button>
                </div>

                {/* Accounts List */}
                  <div className="space-y-4">
                    {accounts.map((account) => (
                      <div
                      key={account.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/40 border border-white/50 hover:bg-white/60 transition-all"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 border border-white/50 shadow-sm">
                          <Building2 className="h-6 w-6 text-gray-600" />
                        </div>  
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{account.bankName}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>••••{account.lastFourDigits}</span>
                            <Badge variant="outline" className="bg-white/50 border-white/60 text-gray-700 text-xs">
                              {account.accountType}
                            </Badge>
                          </div>
                      </div>
                      <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteAccount(account)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50/50 rounded-lg p-2 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    ))}
                  </div>
              </div>
            </div>
          </div>
        </main> 

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-white/90 backdrop-blur-xl border-0 rounded-2xl shadow-2xl mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Delete Account
              </DialogTitle>
            </DialogHeader>
            <div className="pt-4">
              <div className="flex flex-col gap-2 bg-red-50/50 rounded-xl p-4 mb-4">
                <p className="text-slate-700 font-medium mb-2">Are you sure you want to delete this account?</p>
                <div className="text-sm text-slate-600 space-y-1">
                  <p className="text-red-600 font-medium">⚠️ This will also delete all associated transactions</p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full flex-1 shadow-sm transition-all duration-200"
                  style={{ backgroundColor: "red" }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
                <Button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  variant="outline"
                  className="bg-white/70 border-slate-200 rounded-full px-6 hover:bg-white/90 transition-all duration-200"
                  style={{ padding: "0 10%" }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog> 
      </div>
    </div>
  )
}
