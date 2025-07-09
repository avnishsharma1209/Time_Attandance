import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getAllUsers } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

      // Check if user is admin
      if (decoded.role !== "admin") {
        return NextResponse.json({ message: "Admin access required" }, { status: 403 })
      }

      const users = await getAllUsers()

      // Add additional statistics
      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter((u) => u.isActive).length,
        adminUsers: users.filter((u) => u.role === "admin").length,
        employeeUsers: users.filter((u) => u.role === "employee").length,
        departmentBreakdown: users.reduce(
          (acc, user) => {
            acc[user.department] = (acc[user.department] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
      }

      return NextResponse.json({ users, stats })
    } catch (jwtError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
