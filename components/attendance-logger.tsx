"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Square, Clock, MapPin } from "lucide-react"

interface AttendanceLoggerProps {
  user: any
  isClocked: boolean
  setIsClocked: (value: boolean) => void
  clockInTime: Date | null
  setClockInTime: (value: Date | null) => void
}

export function AttendanceLogger({
  user,
  isClocked,
  setIsClocked,
  clockInTime,
  setClockInTime,
}: AttendanceLoggerProps) {
  const [attendanceHistory, setAttendanceHistory] = useState([
    {
      id: 1,
      date: "2024-01-15",
      clockIn: "09:00 AM",
      clockOut: "05:30 PM",
      totalHours: "8h 30m",
      status: "Present",
    },
    {
      id: 2,
      date: "2024-01-14",
      clockIn: "09:15 AM",
      clockOut: "05:45 PM",
      totalHours: "8h 30m",
      status: "Present",
    },
    {
      id: 3,
      date: "2024-01-13",
      clockIn: "09:30 AM",
      clockOut: "06:00 PM",
      totalHours: "8h 30m",
      status: "Late",
    },
  ])

  const handleClockIn = () => {
    const now = new Date()
    setIsClocked(true)
    setClockInTime(now)

    // Add to history (in real app, this would be an API call)
    const newEntry = {
      id: attendanceHistory.length + 1,
      date: now.toLocaleDateString(),
      clockIn: now.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" }),
      clockOut: "-",
      totalHours: "-",
      status: "In Progress",
    }
    setAttendanceHistory([newEntry, ...attendanceHistory])
  }

  const handleClockOut = () => {
    const now = new Date()
    setIsClocked(false)

    if (clockInTime) {
      const diffMs = now.getTime() - clockInTime.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

      // Update the latest entry
      setAttendanceHistory((prev) =>
        prev.map((entry, index) =>
          index === 0
            ? {
                ...entry,
                clockOut: now.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" }),
                totalHours: `${diffHours}h ${diffMinutes}m`,
                status: "Present",
              }
            : entry,
        ),
      )
    }

    setClockInTime(null)
  }

  const getWorkingHours = () => {
    if (!clockInTime) return "0h 0m"

    const now = new Date()
    const diffMs = now.getTime() - clockInTime.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${diffHours}h ${diffMinutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Clock In/Out Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Time Tracking</span>
            </CardTitle>
            <CardDescription>Clock in and out to track your working hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              {!isClocked ? (
                <Button onClick={handleClockIn} size="lg" className="bg-green-600 hover:bg-green-700">
                  <Play className="h-5 w-5 mr-2" />
                  Clock In
                </Button>
              ) : (
                <Button onClick={handleClockOut} size="lg" variant="destructive">
                  <Square className="h-5 w-5 mr-2" />
                  Clock Out
                </Button>
              )}
            </div>

            {isClocked && (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 mb-1">Working Hours Today</p>
                <p className="text-2xl font-bold text-green-800">{getWorkingHours()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Summary</CardTitle>
            <CardDescription>Your attendance summary for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status:</span>
              <Badge variant={isClocked ? "default" : "secondary"}>{isClocked ? "Working" : "Not Working"}</Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Clock In:</span>
              <span className="font-medium">
                {clockInTime
                  ? clockInTime.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" })
                  : "-"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Working Hours:</span>
              <span className="font-medium">{getWorkingHours()}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Location:</span>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Office</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
          <CardDescription>Your attendance history for the past few days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Clock In</th>
                  <th className="text-left py-2">Clock Out</th>
                  <th className="text-left py-2">Total Hours</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map((record) => (
                  <tr key={record.id} className="border-b">
                    <td className="py-3">{record.date}</td>
                    <td className="py-3">{record.clockIn}</td>
                    <td className="py-3">{record.clockOut}</td>
                    <td className="py-3">{record.totalHours}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          record.status === "Present"
                            ? "default"
                            : record.status === "Late"
                              ? "destructive"
                              : record.status === "In Progress"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {record.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
