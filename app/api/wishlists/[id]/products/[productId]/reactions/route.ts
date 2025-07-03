import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getDatabase } from "@/lib/mongodb"
import type { Wishlist } from "@/lib/models/wishlist"
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
    const { emoji } = await request.json()

    if (!emoji) {
      return NextResponse.json({ message: "Emoji is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const wishlistsCollection = db.collection<Wishlist>("wishlists")

    if (!ObjectId.isValid(params.id) || !ObjectId.isValid(params.productId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 })
    }

    // First, try to increment existing reaction
    const incrementResult = await wishlistsCollection.updateOne(
      {
        _id: new ObjectId(params.id),
        "products._id": new ObjectId(params.productId),
        "products.reactions.emoji": emoji,
        "products.reactions.users": { $ne: user._id },
      },
      {
        $inc: { "products.$[product].reactions.$[reaction].count": 1 },
        $push: { "products.$[product].reactions.$[reaction].users": user._id },
        $set: { updatedAt: new Date() },
      },
      {
        arrayFilters: [{ "product._id": new ObjectId(params.productId) }, { "reaction.emoji": emoji }],
      },
    )

    if (incrementResult.modifiedCount === 0) {
      // If no existing reaction was incremented, create a new one
      await wishlistsCollection.updateOne(
        {
          _id: new ObjectId(params.id),
          "products._id": new ObjectId(params.productId),
        },
        {
          $push: {
            "products.$.reactions": {
              emoji,
              count: 1,
              users: [user._id],
            },
          },
          $set: { updatedAt: new Date() },
        },
      )
    }

    return NextResponse.json({ message: "Reaction added successfully" })
  } catch (error) {
    console.error("Add reaction error:", error)
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
