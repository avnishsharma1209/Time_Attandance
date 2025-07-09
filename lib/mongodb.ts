import { MongoClient, type Db, ObjectId } from "mongodb"
import { createIndexes } from "./mongodb-schemas"

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI as string
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in your .env.local file")
}
const MONGODB_DB = process.env.MONGODB_DB as string
if (!MONGODB_DB) {
  throw new Error("Please define the MONGODB_DB environment variable in your .env.local file")
}

console.log("MongoDB URI configured:", MONGODB_URI.replace(/(mongodb:\/\/)(.*:.*)@/, "$1***:***@")) // Hide credentials in logs

interface MongoConnection {
  client: MongoClient
  db: Db
}

let cachedConnection: MongoConnection | null = null
let indexesCreated = false

export async function connectToDatabase(): Promise<MongoConnection> {
  if (cachedConnection) {
    // Test the connection
    try {
      await cachedConnection.client.db("admin").command({ ping: 1 })
      return cachedConnection
    } catch (error) {
      console.log("Cached connection failed, creating new connection")
      cachedConnection = null
    }
  }

  try {
    console.log("Connecting to MongoDB...")

    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    await client.connect()
    console.log("Connected to MongoDB successfully")

    const db = client.db(MONGODB_DB)

    cachedConnection = { client, db }

    // Create indexes on first connection
    if (!indexesCreated) {
      try {
        await createIndexes(db)
        indexesCreated = true
        console.log("Database indexes created successfully")
      } catch (indexError) {
        console.error("Error creating indexes:", indexError)
        // Don't fail connection if indexes fail
      }
    }

    return cachedConnection
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  if (cachedConnection) {
    try {
      await cachedConnection.client.close()
      cachedConnection = null
      indexesCreated = false
      console.log("Disconnected from MongoDB")
    } catch (error) {
      console.error("Error closing MongoDB connection:", error)
    }
  }
}

// Helper functions for database operations
export async function findUserByEmail(email: string) {
  try {
    const { db } = await connectToDatabase()
    return await db.collection("users").findOne({ email: email.toLowerCase() })
  } catch (error: any) {
    console.error("Error finding user by email:", error?.message || error)
    throw error
  }
}

export async function findUserByEmployeeId(employeeId: string) {
  try {
    const { db } = await connectToDatabase()
    return await db.collection("users").findOne({ employeeId: employeeId.toUpperCase() })
  } catch (error: any) {
    console.error("Error finding user by employee ID:", error?.message || error)
    throw error
  }
}

export async function createUser(userData: any) {
  try {
    const { db } = await connectToDatabase()
    if (userData.email) userData.email = userData.email.toLowerCase()
    if (userData.employeeId) userData.employeeId = userData.employeeId.toUpperCase()
    return await db.collection("users").insertOne(userData)
  } catch (error: any) {
    console.error("Error creating user:", error?.message || error)
    throw error
  }
}

export async function updateUserLastLogin(userId: string | ObjectId) {
  try {
    const { db } = await connectToDatabase()
    const objectId = typeof userId === "string" ? new ObjectId(userId) : userId
    return await db.collection("users").updateOne(
      { _id: objectId },
      {
        $set: {
          lastLogin: new Date(),
          updatedAt: new Date(),
        },
      },
    )
  } catch (error: any) {
    console.error("Error updating user last login:", error?.message || error)
    throw error
  }
}

export async function getAllUsers() {
  try {
    const { db } = await connectToDatabase()
    return await db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray()
  } catch (error: any) {
    console.error("Error getting all users:", error?.message || error)
    throw error
  }
}

export async function testDatabaseConnection() {
  try {
    const { db } = await connectToDatabase()
    await db.admin().ping()
    console.log("Database connection test successful")
    return true
  } catch (error: any) {
    console.error("Database connection test failed:", error?.message || error)
    return false
  }
}
