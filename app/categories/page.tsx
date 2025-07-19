"use client"

import { Plus, Edit2, Palette, Save, ArrowLeft, User, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from 'next/link'
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { fetchCategories, BASE_URL } from "@/lib/api/database"

interface Category {
  id: number
  name: string
  color: string
}

// Sample data
// const defaultCategories: Category[] = [
//   { id: 1, name: "Travel", color: "#10B981" },
//   { id: 2, name: "Food And Drink", color: "#06B6D4" },
//   { id: 3, name: "Transportation", color: "#3B82F6" },
//   { id: 4, name: "General Merchandise", color: "#A855F7" },
// ]

// const initialCustomCategories: Category[] = [
//  { id: 5, name: "Home Improvement", color: "#8B5CF6" },
//  { id: 6, name: "Entertainment", color: "#F59E0B" },
//  { id: 7, name: "Healthcare", color: "#EF4444" },
//  { id: 8, name: "Utilities", color: "#84CC16" },
// ]

const colorOptions = [
  "#eab308",
  "#4ade80",
  "#a3e635",
  "#06b6d4",
  "#38bdf8",
  "#f43f5e",
  "#ec4899",
  "#fcd34d",
  "#fb923c",
  "#2dd4bf",
  "#818cf8",
  "#facc15",
  "#60a5fa",
  "#be185d",
  "#4c1d95" 
]

export default function Categories() {

    const [customCategories, setCustomCategories] = useState<Category[]>([])
    const [categories, setCategories] = useState<Category[]>()
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [newCategoryName, setNewCategoryName] = useState("")
    const [newCategoryColor, setNewCategoryColor] = useState(colorOptions[0])
    const [loading, setLoading ] = useState<boolean>(true);
    const [error, setError ] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

    // Fetch categories data
    useEffect(() => {
        async function loadCategories() {
          try {
            setLoading(true)
    
            const data = await fetchCategories()

            setCategories(data.gen_catogories)
            setCustomCategories(data.cus_catogories)
          } catch (err) {
            setError((err as Error).message)
          } finally {
            setLoading(false)
          }
        }
    
        loadCategories()
      }, [])

      console.log("Categories data fetched: ", categories);

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
  if (error) return <div>Error loading transactions: {error}</div>;
  if (!categories) return <div>No categories data available.</div>;

const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now(),
        name: newCategoryName.trim(),
        color: newCategoryColor,
      }
      // UI   
      setCustomCategories((prev) => [...prev, newCategory])
      setNewCategoryName("")
      setNewCategoryColor(colorOptions[0])
      setIsAddDialogOpen(false)
      // Updating database
      try {
        const res = await fetch(`${BASE_URL}/db-add-custom-category`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                user_id: 1, // hardcoded for now
                name: newCategoryName.trim(),
                color: newCategoryColor,
            })
        })
        
        if (!res.ok) {
            throw new Error("Transaction category backend update failed")
        }

        const data = await res.json();
        console.log("Successfully added:", data);
      } catch (err) {
        console.log("Adding custom category failed: ", err)
      }

      console.log("Adding category:", newCategory)
    }
  }

  const handleSaveEdit = async () => {
    if (editingCategory && newCategoryName.trim()) {
      const updatedCategories = customCategories.map((cat) =>
        cat.id === editingCategory.id ? { ...cat, name: newCategoryName.trim(), color: newCategoryColor } : cat,
      )
      // UI
      setCustomCategories(updatedCategories)
      setIsEditDialogOpen(false)
      setEditingCategory(null)
      setNewCategoryName("")
      setNewCategoryColor(colorOptions[0])
      // Updaing database
      try {
        const res = await fetch(`${BASE_URL}/db-edit-custom-category`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                id: editingCategory.id,
                user_id: 1, // hardcoded for now
                name: newCategoryName.trim(),
                color: newCategoryColor,
            })
        })
        
        if (!res.ok) {
            throw new Error("Category backend edit failed")
        }

        const data = await res.json();
        console.log("Successfully added:", data);
      } catch (err) {
        console.log("Editing custom category failed: ", err)
      }
      console.log("Updating category:", { id: editingCategory.id, name: newCategoryName, color: newCategoryColor })
    }
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
    setNewCategoryName("")
    setNewCategoryColor(colorOptions[0])
  }

  const handleDeleteCategory = (category: Category) => {
    setDeletingCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deletingCategory) {
      const updatedCategories = customCategories.filter((cat) => cat.id !== deletingCategory.id)
      setCustomCategories(updatedCategories)
      setIsDeleteDialogOpen(false)
      setDeletingCategory(null)
      console.log("Deleting custom category:", deletingCategory.id)
    }
  }

  const handleCancelDelete = () => {
    setDeletingCategory(null)
    setIsDeleteDialogOpen(false)
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
              {/* Trying adding stuff */}

              {/* Custom Categories */}
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Custom Categories</h2>
                  </div>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-white/30 hover:bg-white/40 backdrop-blur-xl text-gray-800 border-0 rounded-l shadow-lg transition-all duration-200">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white/90 backdrop-blur-xl border-0 rounded-2xl shadow-2xl mx-4 sm:mx-auto">
                      <DialogHeader>
                        <DialogTitle className="text-gray-800">Add New Category</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor="category-name" className="text-gray-700">
                            Category Name
                          </Label>
                          <Input
                            id="category-name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Enter category name"
                            className="bg-white/50 border-white/30 rounded-l mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-700">Choose Color</Label>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {colorOptions.map((color) => (
                              <button
                                key={color}
                                onClick={() => setNewCategoryColor(color)}
                                className={`w-8 h-8 rounded-full transition-all duration-200 ${
                                  newCategoryColor === color ? "ring-2 ring-gray-400 ring-offset-2" : ""
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Button
                            onClick={handleAddCategory}
                            className="bg-white/30 hover:bg-white/40 backdrop-blur-xl text-gray-800 border-0 rounded-l shadow-lg transition-all duration-200 flex-1 font-medium"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Add Category
                          </Button>
                          <Button
                            onClick={() => setIsAddDialogOpen(false)}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-xl text-gray-700 border-0 rounded-l shadow-lg transition-all duration-200 px-6 font-medium"
                            style={{ padding: "0 10%", color: "red" }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {customCategories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                          <span className="font-medium text-gray-800">{category.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <Dialog
                            open={isEditDialogOpen && editingCategory?.id === category.id}
                            onOpenChange={(open) => {
                              if (!open) {
                                setIsEditDialogOpen(false)
                                setEditingCategory(null)
                                setNewCategoryName("")
                                setNewCategoryColor(colorOptions[0])
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => {
                                  setEditingCategory(category)
                                  setNewCategoryName(category.name)
                                  setNewCategoryColor(category.color)
                                  setIsEditDialogOpen(true)
                                }}
                                size="sm"
                                variant="ghost"
                                className="text-gray-600 hover:text-gray-800 hover:bg-white/30 rounded-lg p-2"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white/90 backdrop-blur-xl border-0 rounded-2xl shadow-2xl mx-4 sm:mx-auto">
                              <DialogHeader>
                                <DialogTitle className="text-gray-800">Edit Category</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 pt-4">
                                <div>
                                  <Label htmlFor="edit-category-name" className="text-gray-700">
                                    Category Name
                                  </Label>
                                  <Input
                                    id="edit-category-name"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Enter category name"
                                    className="bg-white/50 border-white/30 rounded-xl mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-700">Choose Color</Label>
                                  <div className="flex gap-2 mt-2 flex-wrap">
                                    {colorOptions.map((color) => (
                                      <button
                                        key={color}
                                        onClick={() => setNewCategoryColor(color)}
                                        className={`w-8 h-8 rounded-full transition-all duration-200 ${
                                          newCategoryColor === color ? "ring-2 ring-gray-400 ring-offset-2" : ""
                                        }`}
                                        style={{ backgroundColor: color }}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                  <Button
                                    onClick={handleSaveEdit}
                                    className="bg-white/30 hover:bg-white/40 backdrop-blur-xl text-gray-800 border-0 rounded-xl shadow-lg transition-all duration-200 flex-1 font-medium"
                                  >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setIsEditDialogOpen(false)
                                      setEditingCategory(null)
                                      setNewCategoryName("")
                                      setNewCategoryColor(colorOptions[0])
                                    }}
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-xl text-gray-700 border-0 rounded-xl shadow-lg transition-all duration-200 px-6 font-medium"
                                    style={{ padding: "0 10%", color: "red" }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            onClick={() => handleDeleteCategory(category)}
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50/30 rounded-lg p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {customCategories.length === 0 && (
                  <div className="text-center py-12">
                    <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No custom categories yet</h3>
                    <p className="text-gray-500 mb-4">Create your first custom spending category to get started</p>
                    <Button
                      onClick={() => setIsAddDialogOpen(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Category
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Delete confirmation pop-up window */}
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-white/90 backdrop-blur-xl border-0 rounded-2xl shadow-2xl mx-4 sm:mx-auto">
                  <DialogHeader>
                    <DialogTitle className="text-gray-800">Delete Category</DialogTitle>
                  </DialogHeader>
                  <div className="pt-4">
                    <p className="text-gray-700 mb-6">
                      Are you sure you want to delete the category "{deletingCategory?.name}"? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleConfirmDelete}
                        className="bg-red-500 hover:bg-red-600 text-white border-0 rounded-l shadow-lg transition-all duration-200 flex-1 font-medium"
                        style={{ backgroundColor: "red" }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Category
                      </Button>
                      <Button
                        onClick={handleCancelDelete}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-xl text-gray-700 border-0 rounded-l shadow-lg transition-all duration-200 px-6 font-medium"
                        style={{ padding: "0 10%" }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Default Categories */}
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Default Categories</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map((category) => (
                  <div key={category.id} className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                        <span className="font-medium text-gray-800">{category.name}</span>
                      </div>
                    <div className="text-xs text-gray-500 bg-gray-100/50 px-2 py-1 rounded-lg">Default</div>
                    </div>
                  </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>  
      </div>
    </div>
  )
}
