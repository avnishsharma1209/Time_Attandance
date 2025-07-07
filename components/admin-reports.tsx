"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, TrendingUp, TrendingDown, Users, Clock, Calendar } from "lucide-react"

export function AdminReports() {
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

  const topPerformers = [
    { name: "Sarah Wilson", department: "HR", attendance: 100, avgHours: 8.2 },
    { name: "John Doe", department: "Engineering", attendance: 98.5, avgHours: 8.8 },
    { name: "Mike Johnson", department: "Sales", attendance: 97.2, avgHours: 8.5 },
    { name: "Jane Smith", department: "Marketing", attendance: 96.8, avgHours: 8.1 },
    { name: "Tom Brown", department: "Finance", attendance: 95.5, avgHours: 8.3 },
  ]

  const attendanceIssues = [
    {
      name: "Alex Johnson",
      department: "Sales",
      issue: "Frequent Late Arrivals",
      count: 8,
      lastOccurrence: "2024-01-18",
    },
    {
      name: "Lisa Davis",
      department: "Marketing",
      issue: "Excessive Absences",
      count: 5,
      lastOccurrence: "2024-01-17",
    },
    {
      name: "Chris Wilson",
      department: "Engineering",
      issue: "Early Departures",
      count: 4,
      lastOccurrence: "2024-01-16",
    },
  ]

  const exportReport = (type: string) => {
    alert(`${type} report exported successfully!`)
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
                <span>Administrative Reports</span>
              </CardTitle>
              <CardDescription>Comprehensive attendance and performance analytics</CardDescription>
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
                  <SelectItem value="thisQuarter">This Quarter</SelectItem>
                  <SelectItem value="thisYear">This Year</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={() => exportReport("Detailed")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
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
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
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
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
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
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
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
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>Attendance and performance metrics by department</CardDescription>
        </CardHeader>
        <CardContent>
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
                      <Badge
                        variant={
                          dept.attendance >= 95 ? "default" : dept.attendance >= 90 ? "secondary" : "destructive"
                        }
                      >
                        {dept.attendance >= 95 ? "Excellent" : dept.attendance >= 90 ? "Good" : "Needs Improvement"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers and Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Top Performers</span>
            </CardTitle>
            <CardDescription>Employees with excellent attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((employee, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-gray-600">{employee.department}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{employee.attendance}%</div>
                    <div className="text-sm text-gray-500">{employee.avgHours}h avg</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span>Attendance Issues</span>
            </CardTitle>
            <CardDescription>Employees requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceIssues.map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium">{issue.name}</div>
                    <div className="text-sm text-gray-600">{issue.department}</div>
                    <div className="text-xs text-red-600">{issue.issue}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">{issue.count}x</div>
                    <div className="text-xs text-gray-500">Last: {issue.lastOccurrence}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <CardDescription>Generate detailed reports for external use</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => exportReport("Attendance Summary")} className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              <span>Attendance Summary</span>
            </Button>
            <Button onClick={() => exportReport("Department Analysis")} className="h-20 flex-col" variant="outline">
              <BarChart3 className="h-6 w-6 mb-2" />
              <span>Department Analysis</span>
            </Button>
            <Button onClick={() => exportReport("Employee Details")} className="h-20 flex-col" variant="outline">
              <Users className="h-6 w-6 mb-2" />
              <span>Employee Details</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
