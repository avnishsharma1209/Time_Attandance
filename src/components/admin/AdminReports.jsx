"use client"

import { useState } from "react"
import { BarChart3, Download, TrendingUp, TrendingDown, Clock, Calendar } from "lucide-react"

const AdminReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  const overallStats = {
    totalEmployees: 45,
    averageAttendance: 92.3,
    totalWorkingHours: 7200,
    averageWorkingHours: 8.2,
    lateArrivals: 15,
    earlyDepartures: 8,
    absentDays: 23,
    overtimeHours: 120,
  }

  const departmentStats = [
    { name: "Engineering", employees: 15, attendance: 94.2, avgHours: 8.5, lateCount: 4 },
    { name: "Marketing", employees: 8, attendance: 91.5, avgHours: 8.0, lateCount: 3 },
    { name: "Sales", employees: 12, attendance: 89.8, avgHours: 8.3, lateCount: 5 },
    { name: "HR", employees: 5, attendance: 96.0, avgHours: 7.8, lateCount: 1 },
    { name: "Finance", employees: 5, attendance: 93.5, avgHours: 8.1, lateCount: 2 },
  ]

  const exportReport = (type) => {
    alert(`${type} report exported successfully!`)
  }

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Administrative Reports</span>
            </h3>
            <p className="text-gray-600 text-sm">Comprehensive attendance and performance analytics</p>
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
              <option value="thisQuarter">This Quarter</option>
              <option value="thisYear">This Year</option>
            </select>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="engineering">Engineering</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
            </select>

            <button
              onClick={() => exportReport("Detailed")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Attendance</p>
              <p className="text-3xl font-bold text-green-600">{overallStats.averageAttendance}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">+2.3% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Working Hours</p>
              <p className="text-3xl font-bold text-blue-600">{overallStats.totalWorkingHours.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Avg: {overallStats.averageWorkingHours}h per employee</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Late Arrivals</p>
              <p className="text-3xl font-bold text-orange-600">{overallStats.lateArrivals}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <TrendingDown className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absent Days</p>
              <p className="text-3xl font-bold text-red-600">{overallStats.absentDays}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Across all employees</p>
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Department Performance</h3>
          <p className="text-gray-600 text-sm">Attendance and performance metrics by department</p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Department</th>
                  <th className="text-left py-2">Employees</th>
                  <th className="text-left py-2">Attendance Rate</th>
                  <th className="text-left py-2">Avg. Hours/Day</th>
                  <th className="text-left py-2">Late Arrivals</th>
                  <th className="text-left py-2">Performance</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map((dept, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 font-medium">{dept.name}</td>
                    <td className="py-3">{dept.employees}</td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <span>{dept.attendance}%</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${dept.attendance}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">{dept.avgHours}h</td>
                    <td className="py-3">{dept.lateCount}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          dept.attendance >= 95
                            ? "bg-green-100 text-green-800"
                            : dept.attendance >= 90
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {dept.attendance >= 95 ? "Excellent" : dept.attendance >= 90 ? "Good" : "Needs Improvement"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminReports
