import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
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

    // Get today's attendance
    const todayAttendance = await db.collection("attendance").findOne({
      userId: decoded.userId,
      date: today,
    })

    // Get recent attendance (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentAttendance = await db
      .collection("attendance")
      .find({
        userId: decoded.userId,
        date: { $gte: sevenDaysAgo.toISOString().split("T")[0] },
      })
      .sort({ date: -1 })
      .toArray()

    return NextResponse.json({
      todayAttendance,
      recentAttendance,
    })
  } catch (error) {
    console.error("Get employee attendance error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
