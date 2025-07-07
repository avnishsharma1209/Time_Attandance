"use client"

import { useState } from "react"
import { BarChart3, Download, TrendingUp, Clock, Calendar } from "lucide-react"

const AttendanceReports = ({ user }) => {
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
    alert("Report exported successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Attendance Reports</span>
            </h3>
            <p className="text-gray-600 text-sm">View your attendance statistics and reports</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
            </select>
            <button
              onClick={exportReport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
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
        </div>

        <div className="bg-white rounded-lg shadow p-6">
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
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Late Arrivals</p>
              <p className="text-2xl font-bold text-orange-600">{monthlyStats.lateArrivals}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
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
        </div>
      </div>

      {/* Weekly Breakdown */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Weekly Breakdown</h3>
          <p className="text-gray-600 text-sm">Your weekly attendance and hours summary</p>
        </div>
        <div className="p-6">
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
        </div>
      </div>
    </div>
  )
}

export default AttendanceReports
