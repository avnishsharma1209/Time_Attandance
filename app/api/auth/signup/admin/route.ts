import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"
import { validateAdminCode } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, adminCode, department, phoneNumber } = await request.json()

    // Validation
    if (!name || !email || !password || !adminCode || !department || !phoneNumber) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    // Validate admin code
    if (!validateAdminCode(adminCode)) {
      return NextResponse.json({ message: "Invalid admin verification code" }, { status: 401 })
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create admin user object
    const newAdmin = {
      name,
      email,
      password: hashedPassword,
      role: "admin",
      department,
      phoneNumber,
      permissions: ["user_management", "system_config", "analytics", "reports", "admin_panel"],
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert admin into database
    const result = await db.collection("users").insertOne(newAdmin)

    if (result.insertedId) {
      // Log admin creation
      await db.collection("admin_logs").insertOne({
        action: "admin_created",
        adminId: result.insertedId,
        adminEmail: email,
        timestamp: new Date(),
        details: {
          name,
          department,
        },
      })

      return NextResponse.json(
        {
          message: "Admin account created successfully",
          userId: result.insertedId,
        },
        { status: 201 },
      )
    } else {
      return NextResponse.json({ message: "Failed to create admin account" }, { status: 500 })
    }
  } catch (error) {
    console.error("Admin signup error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
