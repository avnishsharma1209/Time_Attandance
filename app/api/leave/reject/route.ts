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
          status: "rejected",
          rejectedBy: decoded.userId,
          rejectedDate: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      message: "Leave request rejected successfully",
    })
  } catch (error) {
    console.error("Reject leave error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
