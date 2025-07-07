"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Download, Calendar, Clock, TrendingUp, TrendingDown } from "lucide-react"

interface AttendanceReportsProps {
  user: any
}

export function AttendanceReports({ user }: AttendanceReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth")

  const monthlyStats = {
    totalWorkingDays: 22,
    daysPresent: 20,
    daysAbsent: 2,
    totalHours: 160,
    averageHours: 8,
    lateArrivals: 3,
    earlyDepartures: 1,
  }

  const weeklyData = [
    { week: "Week 1", hours: 40, days: 5 },
    { week: "Week 2", hours: 38, days: 5 },
    { week: "Week 3", hours: 42, days: 5 },
    { week: "Week 4", hours: 40, days: 5 },
  ]

  const attendancePercentage = (monthlyStats.daysPresent / monthlyStats.totalWorkingDays) * 100

  const exportReport = () => {
    // In a real app, this would generate and download a PDF/Excel report
    alert("Report exported successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Attendance Reports</span>
              </CardTitle>
              <CardDescription>View your attendance statistics and reports</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                  <SelectItem value="thisYear">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-green-600">{attendancePercentage.toFixed(1)}%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {monthlyStats.daysPresent} of {monthlyStats.totalWorkingDays} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-blue-600">{monthlyStats.totalHours}h</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Avg: {monthlyStats.averageHours}h per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Late Arrivals</p>
                <p className="text-2xl font-bold text-orange-600">{monthlyStats.lateArrivals}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingDown className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Days Absent</p>
                <p className="text-2xl font-bold text-red-600">{monthlyStats.daysAbsent}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Breakdown</CardTitle>
          <CardDescription>Your weekly attendance and hours summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyData.map((week, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{week.week}</p>
                    <p className="text-sm text-gray-600">{week.days} days present</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{week.hours}h</p>
                  <p className="text-sm text-gray-600">Total hours</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Attendance Log</CardTitle>
          <CardDescription>Complete record of your attendance for the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Day</th>
                  <th className="text-left py-2">Clock In</th>
                  <th className="text-left py-2">Clock Out</th>
                  <th className="text-left py-2">Break Time</th>
                  <th className="text-left py-2">Total Hours</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }, (_, i) => {
                  const date = new Date()
                  date.setDate(date.getDate() - i)
                  return (
                    <tr key={i} className="border-b">
                      <td className="py-3">{date.toLocaleDateString()}</td>
                      <td className="py-3">{date.toLocaleDateString("en-US", { weekday: "short" })}</td>
                      <td className="py-3">09:{String(Math.floor(Math.random() * 30)).padStart(2, "0")} AM</td>
                      <td className="py-3">05:{String(Math.floor(Math.random() * 60)).padStart(2, "0")} PM</td>
                      <td className="py-3">1h 00m</td>
                      <td className="py-3">8h {String(Math.floor(Math.random() * 60)).padStart(2, "0")}m</td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Present</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
