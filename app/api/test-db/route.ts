import { NextResponse } from "next/server"
import { connectToDatabase, testDatabaseConnection } from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("Testing database connection...")

    const isConnected = await testDatabaseConnection()

    if (!isConnected) {
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed",
        },
        { status: 500 },
      )
    }

    const { db } = await connectToDatabase()

    // Test basic operations
    const collections = await db.listCollections().toArray()
    const userCount = await db.collection("users").countDocuments()

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      details: {
        collections: collections.map((c) => c.name),
        userCount,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Database test error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Database test failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
