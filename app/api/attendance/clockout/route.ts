import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"

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

    // Find today's attendance record
    const attendanceRecord = await db.collection("attendance").findOne({
      userId: decoded.userId,
      date: today,
    })

    if (!attendanceRecord || !attendanceRecord.clockIn) {
      return NextResponse.json({ message: "No clock in record found for today" }, { status: 400 })
    }

    if (attendanceRecord.clockOut) {
      return NextResponse.json({ message: "Already clocked out today" }, { status: 400 })
    }

    const clockOutTime = new Date()
    const clockInTime = new Date(attendanceRecord.clockIn)
    const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60)

    // Determine status based on working hours
    let status = "present"
    if (totalHours < 4) {
      status = "half_day"
    }

    await db.collection("attendance").updateOne(
      { _id: attendanceRecord._id },
      {
        $set: {
          clockOut: clockOutTime,
          totalHours: totalHours,
          status: status,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      message: "Clocked out successfully",
      clockOutTime: clockOutTime.toISOString(),
      totalHours: totalHours.toFixed(2),
    })
  } catch (error) {
    console.error("Clock out error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
