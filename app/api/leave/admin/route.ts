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

    const leaveRequests = await db.collection("leave_requests").find({}).sort({ appliedDate: -1 }).toArray()

    return NextResponse.json({ leaveRequests })
  } catch (error) {
    console.error("Get admin leave requests error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
