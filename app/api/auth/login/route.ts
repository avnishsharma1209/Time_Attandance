import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    console.log("Login attempt for email:", email)

    const { db } = await connectToDatabase()

    // Find user by email
    const user = await db.collection("users").findOne({ email: email.toLowerCase() })

    if (!user) {
      console.log("User not found:", email)
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    console.log("User found:", { id: user._id, email: user.email, role: user.role })

    // Check if account is active
    if (user.isActive === false) {
      return NextResponse.json({ message: "Account is deactivated. Contact administrator." }, { status: 401 })
    }

    // Ensure password exists
    if (!user.password) {
      console.log("User has no password set:", email)
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      console.log("Invalid password for user:", email)
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    console.log("Password verified for user:", email)

    // Update last login timestamp
    try {
      await db.collection("users").updateOne(
        { _id: user._id },
        {
          $set: {
            lastLogin: new Date(),
            updatedAt: new Date(),
          },
        },
      )
    } catch (updateError) {
      console.error("Error updating last login:", updateError)
      // Don't fail login if update fails
    }

    // Create JWT token
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      employeeId: user.employeeId || null,
      department: user.department || null,
      permissions: Array.isArray(user.permissions) ? user.permissions : [],
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || "your-secret-key-change-in-production", {
      expiresIn: "24h",
    })

    // Remove password from user object before sending response
    const { password: _, ...userWithoutPassword } = user

    // Convert ObjectId to string for JSON serialization
    const responseUser = {
      ...userWithoutPassword,
      _id: user._id.toString(),
    }

    console.log("Login successful for user:", email)

    return NextResponse.json({
      message: "Login successful",
      token,
      user: responseUser,
    })
  } catch (error) {
    console.error("Login error:", error)

    // Provide more specific error information
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
    }

    return NextResponse.json(
      {
        message: "Internal server error. Please try again later.",
        error: process.env.NODE_ENV === "development" && error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
