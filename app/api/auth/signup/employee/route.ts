import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, department, employeeId, position, phoneNumber, dateOfJoining, manager } =
      await request.json()

    // Validation
    if (
      !name ||
      !email ||
      !password ||
      !department ||
      !employeeId ||
      !position ||
      !phoneNumber ||
      !dateOfJoining ||
      !manager
    ) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    // Password strength validation
    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Check if employee ID already exists
    const existingEmployee = await db.collection("users").findOne({ employeeId })
    if (existingEmployee) {
      return NextResponse.json({ message: "Employee ID already exists" }, { status: 409 })
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create employee user object
    const newEmployee = {
      name,
      email,
      password: hashedPassword,
      role: "employee",
      department,
      employeeId,
      position,
      phoneNumber,
      dateOfJoining: new Date(dateOfJoining),
      manager,
      permissions: ["profile_view", "profile_edit", "time_tracking", "schedule_view"],
      isActive: true,
      lastLogin: null,
      workSchedule: {
        startTime: "09:00",
        endTime: "17:00",
        workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert employee into database
    const result = await db.collection("users").insertOne(newEmployee)

    if (result.insertedId) {
      // Create employee profile
      await db.collection("employee_profiles").insertOne({
        userId: result.insertedId,
        employeeId,
        personalInfo: {
          name,
          email,
          phoneNumber,
          department,
          position,
          manager,
          dateOfJoining: new Date(dateOfJoining),
        },
        workInfo: {
          status: "active",
          totalWorkingDays: 0,
          totalHoursWorked: 0,
          averageHoursPerDay: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return NextResponse.json(
        {
          message: "Employee account created successfully",
          userId: result.insertedId,
        },
        { status: 201 },
      )
    } else {
      return NextResponse.json({ message: "Failed to create employee account" }, { status: 500 })
    }
  } catch (error) {
    console.error("Employee signup error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
