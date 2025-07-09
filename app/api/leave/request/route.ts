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

    const { startDate, endDate, leaveType, reason } = await request.json()

    if (!startDate || !endDate || !leaveType || !reason) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start > end) {
      return NextResponse.json({ message: "End date must be after start date" }, { status: 400 })
    }

    if (start < new Date()) {
      return NextResponse.json({ message: "Cannot request leave for past dates" }, { status: 400 })
    }

    // Convert decoded.userId to ObjectId for MongoDB lookup
    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) })
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check for overlapping leave requests
    const overlappingLeave = await db.collection("leave_requests").findOne({
      userId: decoded.userId,
      status: { $in: ["pending", "approved"] },
      $or: [
        { startDate: { $lte: endDate, $gte: startDate } },
        { endDate: { $gte: startDate, $lte: endDate } },
        { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
      ],
    })

    if (overlappingLeave) {
      return NextResponse.json({ message: "You have overlapping leave requests" }, { status: 400 })
    }

    const leaveRequest = {
      userId: decoded.userId,
      employeeId: user.employeeId || null,
      employeeName: user.name || null,
      department: user.department || null,
      startDate,
      endDate,
      leaveType,
      reason,
      status: "pending",
      appliedDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection("leave_requests").insertOne(leaveRequest)

    return NextResponse.json({
      message: "Leave request submitted successfully",
    })
  } catch (error: any) {
    console.error("Leave request error:", error?.message || error)
    return NextResponse.json({ message: "Internal server error", error: error?.message || error }, { status: 500 })
  }
}
