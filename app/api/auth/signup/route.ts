import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, department, employeeId } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Name, email, password, and role are required" }, { status: 400 })
    }

    if (role === "employee" && (!department || !employeeId)) {
      return NextResponse.json({ message: "Department and Employee ID are required for employees" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Check if employee ID already exists (for employees)
    if (role === "employee") {
      const existingEmployee = await db.collection("users").findOne({ employeeId })
      if (existingEmployee) {
        return NextResponse.json({ message: "Employee ID already exists" }, { status: 409 })
      }
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user object
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === "employee" && { department, employeeId }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert user into database
    const result = await db.collection("users").insertOne(newUser)

    if (result.insertedId) {
      return NextResponse.json(
        {
          message: "User created successfully",
          userId: result.insertedId,
        },
        { status: 201 },
      )
    } else {
      return NextResponse.json({ message: "Failed to create user" }, { status: 500 })
    }
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
