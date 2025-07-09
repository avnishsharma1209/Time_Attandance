"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, LogOut, Clock, FileText, Download, Search, Filter } from "lucide-react"

interface User {
  _id: string
  name: string
  email: string
  role: string
  department?: string
  employeeId?: string
  createdAt: string
}

interface AttendanceRecord {
  _id: string
  userId: string
  employeeId: string
  employeeName: string
  department: string
  date: string
  clockIn: string | null
  clockOut: string | null
  totalHours: number
  status: "present" | "absent" | "half_day" | "on_leave"
  notes?: string
}

interface LeaveRequest {
  _id: string
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
}

interface AttendanceStats {
  totalEmployees: number
  presentToday: number
  absentToday: number
  onLeaveToday: number
  avgWorkingHours: number
  departmentStats: Record<string, any>
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      if (parsedUser.role !== "admin") {
        window.location.href = "/login"
        return
      }
    } else {
      window.location.href = "/login"
      return
    }

    fetchAllData()
  }, [selectedDate, selectedDepartment])

  const fetchAllData = async () => {
    await Promise.all([fetchUsers(), fetchAttendanceData(), fetchLeaveRequests(), fetchAttendanceStats()])
    setLoading(false)
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const fetchAttendanceData = async () => {
    try {
      const token = localStorage.getItem("token")
      const params = new URLSearchParams({
        date: selectedDate,
        department: selectedDepartment,
      })

      const response = await fetch(`/api/attendance/admin?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAttendanceRecords(data.attendanceRecords)
      }
    } catch (error) {
      console.error("Error fetching attendance:", error)
    }
  }

  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/leave/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLeaveRequests(data.leaveRequests)
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error)
    }
  }

  const fetchAttendanceStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/attendance/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAttendanceStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleLeaveAction = async (requestId: string, action: "approve" | "reject") => {
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/leave/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        fetchLeaveRequests()
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError("Network error. Please try again.")
    }
  }

  const exportAttendanceReport = async () => {
    try {
      const token = localStorage.getItem("token")
      const params = new URLSearchParams({
        date: selectedDate,
        department: selectedDepartment,
        format: "csv",
      })

      const response = await fetch(`/api/attendance/export?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `attendance-report-${selectedDate}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      setError("Failed to export report")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      present: { color: "bg-green-100 text-green-800", label: "Present" },
      absent: { color: "bg-red-100 text-red-800", label: "Absent" },
      half_day: { color: "bg-yellow-100 text-yellow-800", label: "Half Day" },
      on_leave: { color: "bg-blue-100 text-blue-800", label: "On Leave" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.absent
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const filteredAttendance = attendanceRecords.filter(
    (record) =>
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const pendingLeaveRequests = leaveRequests.filter((req) => req.status === "pending")

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-600">Attendance & Leave Management</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Attendance Statistics */}
        {attendanceStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{attendanceStats.totalEmployees}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Present Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{attendanceStats.presentToday}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Absent Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{attendanceStats.absentToday}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>On Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{attendanceStats.onLeaveToday}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avg Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{attendanceStats.avgWorkingHours.toFixed(1)}h</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Search Employee</label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search by name or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button onClick={exportAttendanceReport} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Records and Leave Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Daily Attendance ({new Date(selectedDate).toLocaleDateString()})
                </CardTitle>
                <CardDescription>Employee attendance records for selected date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredAttendance.length > 0 ? (
                    filteredAttendance.map((record) => (
                      <div key={record._id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{record.employeeName}</div>
                          <div className="text-sm text-gray-500">
                            {record.employeeId} • {record.department}
                          </div>
                          <div className="text-sm text-gray-600">
                            {record.clockIn && record.clockOut
                              ? `${new Date(record.clockIn).toLocaleTimeString()} - ${new Date(record.clockOut).toLocaleTimeString()}`
                              : record.clockIn
                                ? `In: ${new Date(record.clockIn).toLocaleTimeString()}`
                                : "No clock in"}
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(record.status)}
                          <div className="text-sm text-gray-500 mt-1">{record.totalHours?.toFixed(1) || "0.0"}h</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">No attendance records found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Pending Leave Requests
              </CardTitle>
              <CardDescription>Requests awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {pendingLeaveRequests.length > 0 ? (
                  pendingLeaveRequests.map((request) => (
                    <div key={request._id} className="p-3 border rounded-lg">
                      <div className="font-medium">{request.employeeName}</div>
                      <div className="text-sm text-gray-500 mb-2">
                        {request.employeeId} • {request.department}
                      </div>
                      <div className="text-sm mb-2">
                        <div className="font-medium capitalize">{request.leaveType} Leave</div>
                        <div>
                          {new Date(request.startDate).toLocaleDateString()} -{" "}
                          {new Date(request.endDate).toLocaleDateString()}
                        </div>
                        <div className="text-gray-600 mt-1">{request.reason}</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleLeaveAction(request._id, "approve")} className="flex-1">
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleLeaveAction(request._id, "reject")}
                          className="flex-1"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">No pending requests</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
