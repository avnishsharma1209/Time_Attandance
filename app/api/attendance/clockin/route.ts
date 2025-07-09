import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    if (decoded.role !== "employee") {
      return NextResponse.json({ message: "Employee access required" }, { status: 403 })
    }

    const { db } = await connectToDatabase()
    const today = new Date().toISOString().split("T")[0]

    // Check if already clocked in today
    const existingRecord = await db.collection("attendance").findOne({
      userId: decoded.userId,
      date: today,
    })

    if (existingRecord && existingRecord.clockIn) {
      return NextResponse.json({ message: "Already clocked in today" }, { status: 400 })
    }

    const clockInTime = new Date()

    if (existingRecord) {
      // Update existing record
      await db.collection("attendance").updateOne(
        { _id: existingRecord._id },
        {
          $set: {
            clockIn: clockInTime,
            status: "present",
            updatedAt: new Date(),
          },
        },
      )
    } else {
      // Create new attendance record
      const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) })
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
      }

      await db.collection("attendance").insertOne({
        userId: decoded.userId,
        employeeId: user.employeeId,
        employeeName: user.name,
        department: user.department,
        date: today,
        clockIn: clockInTime,
        clockOut: null,
        totalHours: 0,
        status: "present",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    return NextResponse.json({
      message: "Clocked in successfully",
      clockInTime: clockInTime.toISOString(),
    })
  } catch (error) {
    console.error("Clock in error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
