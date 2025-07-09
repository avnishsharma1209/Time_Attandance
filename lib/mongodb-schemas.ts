import type { Db } from "mongodb"

export async function createIndexes(db: Db) {
  try {
    console.log("Creating database indexes...")

    // Users collection indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("users").createIndex({ employeeId: 1 }, { unique: true, sparse: true })
    await db.collection("users").createIndex({ role: 1 })
    await db.collection("users").createIndex({ department: 1 })
    await db.collection("users").createIndex({ isActive: 1 })
    await db.collection("users").createIndex({ createdAt: 1 })

    // Employee profiles collection indexes
    await db.collection("employee_profiles").createIndex({ userId: 1 }, { unique: true })
    await db.collection("employee_profiles").createIndex({ employeeId: 1 }, { unique: true })
    await db.collection("employee_profiles").createIndex({ "personalInfo.department": 1 })

    // Admin logs collection indexes
    await db.collection("admin_logs").createIndex({ adminId: 1 })
    await db.collection("admin_logs").createIndex({ action: 1 })
    await db.collection("admin_logs").createIndex({ timestamp: 1 })

    // Attendance collection indexes
    await db.collection("attendance").createIndex({ userId: 1 })
    await db.collection("attendance").createIndex({ date: 1 })
    await db.collection("attendance").createIndex({ userId: 1, date: 1 }, { unique: true })
    await db.collection("attendance").createIndex({ employeeId: 1 })
    await db.collection("attendance").createIndex({ department: 1 })
    await db.collection("attendance").createIndex({ status: 1 })

    // Leave requests collection indexes
    await db.collection("leave_requests").createIndex({ userId: 1 })
    await db.collection("leave_requests").createIndex({ status: 1 })
    await db.collection("leave_requests").createIndex({ startDate: 1 })
    await db.collection("leave_requests").createIndex({ endDate: 1 })
    await db.collection("leave_requests").createIndex({ appliedDate: 1 })

    // Admin codes collection indexes
    await db.collection("admin_codes").createIndex({ code: 1 }, { unique: true })
    await db.collection("admin_codes").createIndex({ isActive: 1 })
    await db.collection("admin_codes").createIndex({ createdAt: 1 })

    // Admin code usage collection indexes
    await db.collection("admin_code_usage").createIndex({ code: 1 })
    await db.collection("admin_code_usage").createIndex({ usedBy: 1 })
    await db.collection("admin_code_usage").createIndex({ usedAt: 1 })

    console.log("Database indexes created successfully")
  } catch (error) {
    console.error("Error creating indexes:", error)
    throw error
  }
}

export interface UserSchema {
  _id?: string
  name: string
  email: string
  password: string
  role: "admin" | "employee"
  department: string
  phoneNumber: string
  permissions: string[]
  isActive: boolean
  lastLogin: Date | null
  createdAt: Date
  updatedAt: Date

  // Admin specific fields
  adminLevel?: number

  // Employee specific fields
  employeeId?: string
  position?: string
  dateOfJoining?: Date
  manager?: string
  workSchedule?: {
    startTime: string
    endTime: string
    workDays: string[]
  }
}

export interface EmployeeProfileSchema {
  _id?: string
  userId: string
  employeeId: string
  personalInfo: {
    name: string
    email: string
    phoneNumber: string
    department: string
    position: string
    manager: string
    dateOfJoining: Date
  }
  workInfo: {
    status: "active" | "inactive" | "on_leave"
    totalWorkingDays: number
    totalHoursWorked: number
    averageHoursPerDay: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface AdminLogSchema {
  _id?: string
  action: string
  adminId: string
  adminEmail: string
  timestamp: Date
  details: Record<string, any>
}

export interface AttendanceSchema {
  _id?: string
  userId: string
  employeeId: string
  employeeName: string
  department: string
  date: string
  clockIn: Date | null
  clockOut: Date | null
  totalHours: number
  status: "present" | "absent" | "half_day" | "on_leave"
  leaveType?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface LeaveRequestSchema {
  _id?: string
  userId: string
  employeeId: string
  employeeName: string
  department: string
  startDate: string
  endDate: string
  leaveType: string
  reason: string
  status: "pending" | "approved" | "rejected"
  appliedDate: string
  approvedBy?: string
  approvedDate?: Date
  rejectedBy?: string
  rejectedDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AdminCodeSchema {
  _id?: string
  code: string
  description: string
  createdBy: string
  createdAt: Date
  isActive: boolean
  usageCount: number
  lastUsed: Date | null
  deactivatedBy?: string
  deactivatedAt?: Date
}

export interface AdminCodeUsageSchema {
  _id?: string
  code: string
  usedBy: string
  userEmail: string
  usedAt: Date
  ipAddress?: string
}
