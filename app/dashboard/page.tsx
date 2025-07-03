"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Users, Calendar, LogOut, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Wishlist {
  _id: string
  name: string
  description: string
  createdBy: {
    name: string
    email: string
  }
  collaborators: Array<{
    name: string
    email: string
  }>
  itemCount: number
  createdAt: string
}

export default function DashboardPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchWishlists()
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Failed to fetch user:", error)
      router.push("/login")
    }
  }

  const fetchWishlists = async () => {
    try {
      const response = await fetch("/api/wishlists")
      if (response.ok) {
        const data = await response.json()
        setWishlists(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load wishlists",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load wishlists",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const filteredWishlists = wishlists.filter(
    (wishlist) =>
      wishlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wishlist.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              FlockWish
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-blue-100 text-blue-600">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-500 hover:text-gray-700">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your collaborative wishlists and track team contributions.</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search wishlists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link href="/wishlist/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Wishlist
            </Button>
          </Link>
        </div>

        {/* Wishlists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWishlists.map((wishlist) => (
            <Link key={wishlist._id} href={`/wishlist/${wishlist._id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white border border-gray-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 line-clamp-1">{wishlist.name}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">{wishlist.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700">
                      {wishlist.itemCount} items
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{wishlist.collaborators.length + 1} members</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(wishlist.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Created by</span>
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        {wishlist.createdBy.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-700">{wishlist.createdBy.name}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredWishlists.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "No wishlists found" : "No wishlists yet"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Create your first wishlist to get started"}
            </p>
            {!searchTerm && (
              <Link href="/wishlist/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Wishlist
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
