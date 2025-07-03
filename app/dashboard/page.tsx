"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Users, Calendar, LogOut, Search, Sparkles } from "lucide-react"
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
  const [isVisible, setIsVisible] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchWishlists()
    fetchUser()
    setIsVisible(true)
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 animate-pulse"></div>
          </div>
          <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-2xl animate-bounce"
          style={{ animationDuration: "4s" }}
        />
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transform transition-all duration-500 hover:scale-105 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
            >
              FlockWish
            </Link>
            <div
              className={`flex items-center space-x-4 transform transition-all duration-500 delay-300 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
            >
              <div className="flex items-center space-x-3 group">
                <Avatar className="w-10 h-10 ring-2 ring-blue-200 group-hover:ring-blue-400 transition-all duration-300">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300 hover:scale-110"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div
          className={`mb-8 transform transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="flex items-center mb-4">
            <Sparkles className="w-8 h-8 text-blue-500 mr-3 animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h1>
          </div>
          <p className="text-xl text-gray-600">Manage your collaborative wishlists and track team contributions.</p>
        </div>

        {/* Actions Bar */}
        <div
          className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 transform transition-all duration-700 delay-200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-500 transition-colors duration-300" />
            <Input
              type="text"
              placeholder="Search your wishlists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 hover:shadow-md"
            />
          </div>
          <Link href="/wishlist/new">
            <Button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:-translate-y-1">
              <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              New Wishlist
            </Button>
          </Link>
        </div>

        {/* Wishlists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWishlists.map((wishlist, index) => (
            <Link key={wishlist._id} href={`/wishlist/${wishlist._id}`}>
              <Card
                className={`group hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-300 transform hover:scale-105 hover:-translate-y-2 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-lg"></div>

                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
                        {wishlist.name}
                      </CardTitle>
                      <CardDescription className="mt-1 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
                        {wishlist.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300"
                    >
                      {wishlist.itemCount} items
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="relative">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1 group-hover:text-blue-600 transition-colors duration-300">
                      <Users className="w-4 h-4" />
                      <span>{wishlist.collaborators.length + 1} members</span>
                    </div>
                    <div className="flex items-center space-x-1 group-hover:text-purple-600 transition-colors duration-300">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(wishlist.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Created by</span>
                    <Avatar className="w-6 h-6 ring-1 ring-gray-200 group-hover:ring-blue-300 transition-all duration-300">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                        {wishlist.createdBy.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                      {wishlist.createdBy.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredWishlists.length === 0 && !isLoading && (
          <div
            className={`text-center py-16 transform transition-all duration-700 delay-600 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Plus className="w-12 h-12 text-blue-500" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {searchTerm ? "No wishlists found" : "Your wishlist journey starts here"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms to find what you're looking for"
                : "Create your first collaborative wishlist and start building something amazing with your team"}
            </p>
            {!searchTerm && (
              <Link href="/wishlist/new">
                <Button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:-translate-y-1">
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
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
