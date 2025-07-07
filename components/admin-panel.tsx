"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Clock, Calendar, BarChart3, Settings, ArrowLeft, Search, Filter } from "lucide-react"
import { EmployeeManagement } from "@/components/employee-management"
import { LeaveApprovals } from "@/components/leave-approvals"
import { AdminReports } from "@/components/admin-reports"

interface AdminPanelProps {
  user: any
  onLogout: () => void
  onSwitchToDashboard: () => void
}

export function AdminPanel({ user, onLogout, onSwitchToDashboard }: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const dashboardStats = {
    totalEmployees: 45,
    presentToday: 38,
    onLeave: 5,
    lateArrivals: 2,
    pendingLeaveRequests: 8,
    averageWorkingHours: 8.2,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Time & Attendance Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onSwitchToDashboard}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-3xl font-bold text-blue-600">{dashboardStats.totalEmployees}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present Today</p>
                  <p className="text-3xl font-bold text-green-600">{dashboardStats.presentToday}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {((dashboardStats.presentToday / dashboardStats.totalEmployees) * 100).toFixed(1)}% attendance rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">On Leave</p>
                  <p className="text-3xl font-bold text-orange-600">{dashboardStats.onLeave}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Late Arrivals</p>
                  <p className="text-3xl font-bold text-red-600">{dashboardStats.lateArrivals}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-3xl font-bold text-purple-600">{dashboardStats.pendingLeaveRequests}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Leave requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Hours</p>
                  <p className="text-3xl font-bold text-indigo-600">{dashboardStats.averageWorkingHours}</p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Per day</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Admin Tabs */}
        <Tabs defaultValue="employees" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="employees" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Employees</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Leave Requests</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employees">
            <EmployeeManagement />
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Attendance</CardTitle>
                <CardDescription>Monitor employee attendance in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Employee</th>
                        <th className="text-left py-2">Department</th>
                        <th className="text-left py-2">Clock In</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Working Hours</th>
                        <th className="text-left py-2">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          name: "John Doe",
                          dept: "Engineering",
                          clockIn: "09:00 AM",
                          status: "Present",
                          hours: "7h 30m",
                          location: "Office",
                        },
                        {
                          name: "Jane Smith",
                          dept: "Marketing",
                          clockIn: "09:15 AM",
                          status: "Present",
                          hours: "7h 15m",
                          location: "Remote",
                        },
                        {
                          name: "Mike Johnson",
                          dept: "Sales",
                          clockIn: "09:30 AM",
                          status: "Late",
                          hours: "7h 00m",
                          location: "Office",
                        },
                        {
                          name: "Sarah Wilson",
                          dept: "HR",
                          clockIn: "-",
                          status: "On Leave",
                          hours: "-",
                          location: "-",
                        },
                        {
                          name: "Tom Brown",
                          dept: "Finance",
                          clockIn: "08:45 AM",
                          status: "Present",
                          hours: "7h 45m",
                          location: "Office",
                        },
                      ].map((employee, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 font-medium">{employee.name}</td>
                          <td className="py-3">{employee.dept}</td>
                          <td className="py-3">{employee.clockIn}</td>
                          <td className="py-3">
                            <Badge
                              variant={
                                employee.status === "Present"
                                  ? "default"
                                  : employee.status === "Late"
                                    ? "destructive"
                                    : employee.status === "On Leave"
                                      ? "secondary"
                                      : "outline"
                              }
                            >
                              {employee.status}
                            </Badge>
                          </td>
                          <td className="py-3">{employee.hours}</td>
                          <td className="py-3">{employee.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leave">
            <LeaveApprovals />
          </TabsContent>

          <TabsContent value="reports">
            <AdminReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
