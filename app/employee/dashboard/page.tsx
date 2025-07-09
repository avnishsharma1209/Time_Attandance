"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogOut, Clock, Calendar, User, CheckCircle, XCircle, Timer, FileText } from "lucide-react"

interface Employee {
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
  date: string
  clockIn: string | null
  clockOut: string | null
  totalHours: number
  status: "present" | "absent" | "half_day" | "on_leave"
  notes?: string
}

interface LeaveRequest {
  _id: string
  startDate: string
  endDate: string
  leaveType: string
  reason: string
  status: "pending" | "approved" | "rejected"
  appliedDate: string
}

export default function EmployeeDashboard() {
  const [user, setUser] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null)
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [clockingIn, setClockingin] = useState(false)
  const [showLeaveForm, setShowLeaveForm] = useState(false)
  const [leaveForm, setLeaveForm] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    reason: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      if (parsedUser.role !== "employee") {
        window.location.href = "/login"
        return
      }
    } else {
      window.location.href = "/login"
      return
    }

    fetchAttendanceData()
    fetchLeaveRequests()

    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const fetchAttendanceData = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/attendance/employee", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTodayAttendance(data.todayAttendance)
        setRecentAttendance(data.recentAttendance)
      }
    } catch (error) {
      console.error("Error fetching attendance:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/leave/employee", {
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

  const handleClockInOut = async () => {
    setClockingin(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("token")
      const action = todayAttendance?.clockIn && !todayAttendance?.clockOut ? "clockout" : "clockin"

      const response = await fetch(`/api/attendance/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        fetchAttendanceData()
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setClockingin(false)
    }
  }

  const handleLeaveRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/leave/request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leaveForm),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Leave request submitted successfully!")
        setLeaveForm({ startDate: "", endDate: "", leaveType: "", reason: "" })
        setShowLeaveForm(false)
        fetchLeaveRequests()
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError("Network error. Please try again.")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      present: { color: "bg-green-100 text-green-800", label: "Present" },
      absent: { color: "bg-red-100 text-red-800", label: "Absent" },
      half_day: { color: "bg-yellow-100 text-yellow-800", label: "Half Day" },
      on_leave: { color: "bg-blue-100 text-blue-800", label: "On Leave" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.absent
    return <Badge className={config.color}>{config.label}</Badge>
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Employee Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
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

        {/* Current Time and Clock In/Out */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Current Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(currentTime)}</div>
              <div className="text-sm text-gray-500">{currentTime.toLocaleDateString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Status</CardTitle>
            </CardHeader>
            <CardContent>
              {todayAttendance ? (
                <div className="space-y-2">
                  {getStatusBadge(todayAttendance.status)}
                  {todayAttendance.clockIn && (
                    <div className="text-sm">
                      <div>In: {new Date(todayAttendance.clockIn).toLocaleTimeString()}</div>
                      {todayAttendance.clockOut && (
                        <div>Out: {new Date(todayAttendance.clockOut).toLocaleTimeString()}</div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500">No attendance recorded</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayAttendance?.totalHours?.toFixed(1) || "0.0"}h</div>
              <div className="text-sm text-gray-500">Today</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  onClick={handleClockInOut}
                  disabled={clockingIn}
                  className="w-full"
                  variant={todayAttendance?.clockIn && !todayAttendance?.clockOut ? "destructive" : "default"}
                >
                  {clockingIn ? (
                    <Timer className="h-4 w-4 mr-2 animate-spin" />
                  ) : todayAttendance?.clockIn && !todayAttendance?.clockOut ? (
                    <XCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  {todayAttendance?.clockIn && !todayAttendance?.clockOut ? "Clock Out" : "Clock In"}
                </Button>
                <Button onClick={() => setShowLeaveForm(true)} variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Request Leave
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Request Form */}
        {showLeaveForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Request Leave</CardTitle>
              <CardDescription>Submit a new leave request</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLeaveRequest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={leaveForm.endDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select onValueChange={(value) => setLeaveForm({ ...leaveForm, leaveType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="personal">Personal Leave</SelectItem>
                      <SelectItem value="emergency">Emergency Leave</SelectItem>
                      <SelectItem value="maternity">Maternity Leave</SelectItem>
                      <SelectItem value="paternity">Paternity Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a reason for your leave request"
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">Submit Request</Button>
                  <Button type="button" variant="outline" onClick={() => setShowLeaveForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Recent Attendance and Leave Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Recent Attendance
              </CardTitle>
              <CardDescription>Your attendance history for the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAttendance.length > 0 ? (
                  recentAttendance.map((record) => (
                    <div key={record._id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{formatDate(record.date)}</div>
                        <div className="text-sm text-gray-500">
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
                  <div className="text-center text-gray-500 py-4">No attendance records found</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Leave Requests
              </CardTitle>
              <CardDescription>Your recent leave requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaveRequests.length > 0 ? (
                  leaveRequests.map((request) => (
                    <div key={request._id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium capitalize">{request.leaveType} Leave</div>
                        <Badge
                          className={
                            request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : request.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>
                          {formatDate(request.startDate)} - {formatDate(request.endDate)}
                        </div>
                        <div className="mt-1">{request.reason}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">No leave requests found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
