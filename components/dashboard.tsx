"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, LogOut, Calendar, BarChart3, Settings } from "lucide-react"
import { AttendanceLogger } from "@/components/attendance-logger"
import { LeaveManagement } from "@/components/leave-management"
import { AttendanceReports } from "@/components/attendance-reports"

interface DashboardProps {
  user: any
  onLogout: () => void
  onSwitchToAdmin: () => void
}

export function Dashboard({ user, onLogout, onSwitchToAdmin }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isClocked, setIsClocked] = useState(false)
  const [clockInTime, setClockInTime] = useState<Date | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Time & Attendance</h1>
                <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user.role === "admin" && (
                <Button variant="outline" onClick={onSwitchToAdmin}>
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              )}
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Time Display */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{formatTime(currentTime)}</div>
              <div className="text-lg text-gray-600">{formatDate(currentTime)}</div>
              <div className="mt-4 flex justify-center items-center space-x-4">
                <Badge variant={isClocked ? "default" : "secondary"}>{isClocked ? "Clocked In" : "Clocked Out"}</Badge>
                {clockInTime && <span className="text-sm text-gray-500">Since: {formatTime(clockInTime)}</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="attendance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="attendance" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Leave</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <AttendanceLogger
              user={user}
              isClocked={isClocked}
              setIsClocked={setIsClocked}
              clockInTime={clockInTime}
              setClockInTime={setClockInTime}
            />
          </TabsContent>

          <TabsContent value="leave">
            <LeaveManagement user={user} />
          </TabsContent>

          <TabsContent value="reports">
            <AttendanceReports user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
