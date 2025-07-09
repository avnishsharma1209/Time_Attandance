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

    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 })
    }

    const { requestId } = await request.json()

    if (!requestId) {
      return NextResponse.json({ message: "Request ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const leaveRequest = await db.collection("leave_requests").findOne({
      _id: new ObjectId(requestId),
    })

    if (!leaveRequest) {
      return NextResponse.json({ message: "Leave request not found" }, { status: 404 })
    }

    if (leaveRequest.status !== "pending") {
      return NextResponse.json({ message: "Leave request already processed" }, { status: 400 })
    }

    // Update leave request status
    await db.collection("leave_requests").updateOne(
      { _id: new ObjectId(requestId) },
      {
        $set: {
          status: "approved",
          approvedBy: decoded.userId,
          approvedDate: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    // Create attendance records for approved leave days
    const startDate = new Date(leaveRequest.startDate)
    const endDate = new Date(leaveRequest.endDate)

    const attendanceRecords = []
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split("T")[0]

      // Check if attendance record already exists
      const existingRecord = await db.collection("attendance").findOne({
        userId: leaveRequest.userId,
        date: dateString,
      })

      if (!existingRecord) {
        attendanceRecords.push({
          userId: leaveRequest.userId,
          employeeId: leaveRequest.employeeId,
          employeeName: leaveRequest.employeeName,
          department: leaveRequest.department,
          date: dateString,
          clockIn: null,
          clockOut: null,
          totalHours: 0,
          status: "on_leave",
          leaveType: leaveRequest.leaveType,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }

    if (attendanceRecords.length > 0) {
      await db.collection("attendance").insertMany(attendanceRecords)
    }

    return NextResponse.json({
      message: "Leave request approved successfully",
    })
  } catch (error) {
    console.error("Approve leave error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
