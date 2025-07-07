"use client"

import { useState, useEffect } from "react"
import { Clock, LogOut, Calendar, BarChart3, Settings } from "lucide-react"
import { formatTime, formatDate } from "../../utils/formatTime"
import AttendanceLogger from "./AttendanceLogger"
import LeaveManagement from "./LeaveManagement"
import AttendanceReports from "./AttendanceReports"

const Dashboard = ({ user, onLogout, onSwitchToAdmin }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState("attendance")

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

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
                <button
                  onClick={onSwitchToAdmin}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </button>
              )}
              <button
                onClick={onLogout}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Time Display */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">{formatTime(currentTime)}</div>
            <div className="text-lg text-gray-600">{formatDate(currentTime)}</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("attendance")}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "attendance"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Attendance</span>
            </button>
            <button
              onClick={() => setActiveTab("leave")}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "leave"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Leave</span>
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "reports"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Reports</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "attendance" && <AttendanceLogger user={user} />}
        {activeTab === "leave" && <LeaveManagement user={user} />}
        {activeTab === "reports" && <AttendanceReports user={user} />}
      </div>
    </div>
  )
}

export default Dashboard
