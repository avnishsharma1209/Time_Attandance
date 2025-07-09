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

    const attendanceRecords = await db.collection("attendance").find(query).sort({ employeeName: 1 }).toArray()

    // Generate CSV content
    const csvHeaders = [
      "Employee ID",
      "Employee Name",
      "Department",
      "Date",
      "Clock In",
      "Clock Out",
      "Total Hours",
      "Status",
    ]

    const csvRows = attendanceRecords.map((record) => [
      record.employeeId || "",
      record.employeeName || "",
      record.department || "",
      record.date || "",
      record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : "",
      record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : "",
      record.totalHours?.toFixed(2) || "0.00",
      record.status || "",
    ])

    const csvContent = [csvHeaders.join(","), ...csvRows.map((row) => row.map((field) => `"${field}"`).join(","))].join(
      "\n",
    )

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="attendance-report-${date}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export attendance error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
