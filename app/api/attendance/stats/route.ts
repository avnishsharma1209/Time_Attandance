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

    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 })
    }

    const { db } = await connectToDatabase()
    const today = new Date().toISOString().split("T")[0]

    // Get total employees
    const totalEmployees = await db.collection("users").countDocuments({
      role: "employee",
      isActive: true,
    })

    // Get today's attendance stats
    const todayAttendance = await db.collection("attendance").find({ date: today }).toArray()

    const presentToday = todayAttendance.filter((record) => record.status === "present").length
    const absentToday = totalEmployees - todayAttendance.length
    const onLeaveToday = todayAttendance.filter((record) => record.status === "on_leave").length

    // Calculate average working hours
    const workingRecords = todayAttendance.filter((record) => record.totalHours > 0)
    const avgWorkingHours =
      workingRecords.length > 0
        ? workingRecords.reduce((sum, record) => sum + record.totalHours, 0) / workingRecords.length
        : 0

    // Department-wise stats
    const departmentStats = await db
      .collection("attendance")
      .aggregate([
        { $match: { date: today } },
        {
          $group: {
            _id: "$department",
            present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
            absent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
            avgHours: { $avg: "$totalHours" },
          },
        },
      ])
      .toArray()

    const stats = {
      totalEmployees,
      presentToday,
      absentToday,
      onLeaveToday,
      avgWorkingHours,
      departmentStats: departmentStats.reduce(
        (acc, dept) => {
          acc[dept._id] = {
            present: dept.present,
            absent: dept.absent,
            avgHours: dept.avgHours || 0,
          }
          return acc
        },
        {} as Record<string, any>,
      ),
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Get attendance stats error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
