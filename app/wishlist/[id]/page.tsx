"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Users, Share2, Edit, Trash2, ExternalLink, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Product {
  _id: string
  name: string
  price: number
  imageUrl: string
  description: string
  addedBy: {
    name: string
    email: string
  }
  createdAt: string
  comments: Array<{
    _id: string
    text: string
    author: {
      name: string
      email: string
    }
    createdAt: string
  }>
  reactions: Array<{
    emoji: string
    count: number
    users: string[]
  }>
}

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
  products: Product[]
  createdAt: string
}

export default function WishlistPage() {
  const params = useParams()
  const [wishlist, setWishlist] = useState<Wishlist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [showComments, setShowComments] = useState<string | null>(null)
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    imageUrl: "",
    description: "",
  })
  const [inviteEmail, setInviteEmail] = useState("")
  const [commentText, setCommentText] = useState("")
  const [error, setError] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (params.id) {
      fetchWishlist()
    }
  }, [params.id])

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`/api/wishlists/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setWishlist(data)
      } else {
        setError("Wishlist not found")
      }
    } catch (error) {
      setError("Failed to load wishlist")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/wishlists/${params.id}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          price: Number.parseFloat(productForm.price),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Product added to wishlist",
        })
        setProductForm({ name: "", price: "", imageUrl: "", description: "" })
        setShowAddProduct(false)
        fetchWishlist()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to add product",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/wishlists/${params.id}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Invitation sent successfully",
        })
        setInviteEmail("")
        setShowInvite(false)
        fetchWishlist()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to send invitation",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlists/${params.id}/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Product removed from wishlist",
        })
        fetchWishlist()
      } else {
        toast({
          title: "Error",
          description: "Failed to remove product",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddComment = async (productId: string) => {
    if (!commentText.trim()) return

    try {
      const response = await fetch(`/api/wishlists/${params.id}/products/${productId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      })

      if (response.ok) {
        setCommentText("")
        fetchWishlist()
      } else {
        toast({
          title: "Error",
          description: "Failed to add comment",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddReaction = async (productId: string, emoji: string) => {
    try {
      const response = await fetch(`/api/wishlists/${params.id}/products/${productId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      })

      if (response.ok) {
        fetchWishlist()
      } else {
        toast({
          title: "Error",
          description: "Failed to add reaction",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    )
  }

  if (error || !wishlist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wishlist not found</h2>
          <p className="text-gray-600 mb-4">The wishlist you're looking for doesn't exist.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">FlockWish</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wishlist Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{wishlist.name}</h1>
              <p className="text-gray-600 mb-4">{wishlist.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Created by {wishlist.createdBy.name}</span>
                <span>•</span>
                <span>{new Date(wishlist.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Dialog open={showInvite} onOpenChange={setShowInvite}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Invite
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Collaborator</DialogTitle>
                    <DialogDescription>Invite someone to collaborate on this wishlist</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleInvite} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Send Invitation
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Collaborators */}
          <div className="mt-6 flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Team Members:</span>
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                  {wishlist.createdBy.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {wishlist.collaborators.map((collaborator, index) => (
                <Avatar key={index} className="w-8 h-8">
                  <AvatarFallback className="bg-green-100 text-green-600 text-sm">
                    {collaborator.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              {wishlist.collaborators.length + 1} members
            </Badge>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Add a product to this wishlist</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    type="text"
                    placeholder="Enter product name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Product description..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Add Product
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.products.map((product) => (
            <Card key={product._id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="p-0">
                <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
                  <Image
                    src={product.imageUrl || "/placeholder.svg?height=200&width=200"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg line-clamp-2 text-gray-900">{product.name}</CardTitle>
                  <div className="flex items-center space-x-1 ml-2">
                    <Button variant="ghost" size="icon" className="w-6 h-6 text-gray-400 hover:text-gray-600">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 text-gray-400 hover:text-red-600"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-2">${product.price.toFixed(2)}</div>
                {product.description && (
                  <CardDescription className="mb-3 line-clamp-2">{product.description}</CardDescription>
                )}

                {/* Reactions */}
                <div className="flex items-center space-x-2 mb-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => handleAddReaction(product._id, "👍")}
                  >
                    👍 {product.reactions.find((r) => r.emoji === "👍")?.count || 0}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => handleAddReaction(product._id, "❤️")}
                  >
                    ❤️ {product.reactions.find((r) => r.emoji === "❤️")?.count || 0}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => handleAddReaction(product._id, "😍")}
                  >
                    😍 {product.reactions.find((r) => r.emoji === "😍")?.count || 0}
                  </Button>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Avatar className="w-4 h-4">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        {product.addedBy.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{product.addedBy.name}</span>
                  </div>
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2">
                  <Dialog
                    open={showComments === product._id}
                    onOpenChange={(open) => setShowComments(open ? product._id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Comments ({product.comments.length})
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-96 overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Comments</DialogTitle>
                        <DialogDescription>{product.name}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {product.comments.map((comment) => (
                          <div key={comment._id} className="border-b border-gray-100 pb-2">
                            <div className="flex items-center space-x-2 mb-1">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                  {comment.author.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{comment.author.name}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.text}</p>
                          </div>
                        ))}
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleAddComment(product._id)
                              }
                            }}
                          />
                          <Button size="sm" onClick={() => handleAddComment(product._id)}>
                            Post
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {wishlist.products.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-4">Start adding products to this wishlist!</p>
            <Button onClick={() => setShowAddProduct(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
