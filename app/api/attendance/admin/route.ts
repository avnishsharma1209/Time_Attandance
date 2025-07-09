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

    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]
    const department = searchParams.get("department") || "all"

    const { db } = await connectToDatabase()

    // Build query
    const query: any = { date }
    if (department !== "all") {
      query.department = department
    }

    // Get attendance records for the specified date
    const attendanceRecords = await db.collection("attendance").find(query).sort({ employeeName: 1 }).toArray()

    // Get all employees to check for missing attendance
    const employeeQuery: any = { role: "employee", isActive: true }
    if (department !== "all") {
      employeeQuery.department = department
    }

    const allEmployees = await db.collection("users").find(employeeQuery).toArray()

    // Create attendance records for employees who haven't clocked in
    const attendanceMap = new Map(attendanceRecords.map((record) => [record.userId, record]))

    const completeAttendanceRecords = allEmployees.map((employee) => {
      const existingRecord = attendanceMap.get(employee._id.toString())
      if (existingRecord) {
        return existingRecord
      } else {
        return {
          _id: `missing-${employee._id}`,
          userId: employee._id.toString(),
          employeeId: employee.employeeId,
          employeeName: employee.name,
          department: employee.department,
          date,
          clockIn: null,
          clockOut: null,
          totalHours: 0,
          status: "absent",
        }
      }
    })

    return NextResponse.json({
      attendanceRecords: completeAttendanceRecords,
    })
  } catch (error) {
    console.error("Get admin attendance error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
