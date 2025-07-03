import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getDatabase } from "@/lib/mongodb"
import type { Wishlist, Comment } from "@/lib/models/wishlist"
import type { User } from "@/lib/models/Users"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

async function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  if (!token) {
    throw new Error("Not authenticated")
  }

  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
  const db = await getDatabase()
  const usersCollection = db.collection<User>("users")

  const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) })
  if (!user) {
    throw new Error("User not found")
  }

  return user
}

export async function POST(request: NextRequest, { params }: { params: { id: string; productId: string } }) {
  try {
    const user = await getAuthenticatedUser(request)
    const { text } = await request.json()

    if (!text || !text.trim()) {
      return NextResponse.json({ message: "Comment text is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const wishlistsCollection = db.collection<Wishlist>("wishlists")

    if (!ObjectId.isValid(params.id) || !ObjectId.isValid(params.productId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 })
    }

    const newComment: Comment = {
      _id: new ObjectId(),
      text: text.trim(),
      author: {
        _id: user._id!,
        name: user.name,
        email: user.email,
      },
      createdAt: new Date(),
    }

    const result = await wishlistsCollection.updateOne(
      {
        _id: new ObjectId(params.id),
        "products._id": new ObjectId(params.productId),
      },
      {
        $push: { "products.$.comments": newComment },
        $set: { updatedAt: new Date() },
      },
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        ...newComment,
        _id: newComment._id.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Add comment error:", error)
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
