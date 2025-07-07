"use client"
import { Play, Square, Clock, MapPin } from "lucide-react"
import { useAttendance } from "../../hooks/useAttendance"
import { calculateWorkingHours } from "../../utils/formatTime"

const AttendanceLogger = ({ user }) => {
  const { isClocked, clockInTime, attendanceHistory, clockIn, clockOut } = useAttendance(user.id)

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case "Present":
        return `${baseClasses} bg-green-100 text-green-800`
      case "Late":
        return `${baseClasses} bg-red-100 text-red-800`
      case "In Progress":
        return `${baseClasses} bg-blue-100 text-blue-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  return (
    <div className="space-y-6">
      {/* Clock In/Out Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Time Tracking</span>
            </h3>
            <p className="text-gray-600 text-sm">Clock in and out to track your working hours</p>
          </div>

          <div className="text-center space-y-4">
            {!isClocked ? (
              <button
                onClick={clockIn}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto"
              >
                <Play className="h-5 w-5" />
                <span>Clock In</span>
              </button>
            ) : (
              <button
                onClick={clockOut}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto"
              >
                <Square className="h-5 w-5" />
                <span>Clock Out</span>
              </button>
            )}

            {isClocked && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 mb-1">Working Hours Today</p>
                <p className="text-2xl font-bold text-green-800">{calculateWorkingHours(clockInTime)}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Today's Summary</h3>
            <p className="text-gray-600 text-sm">Your attendance summary for today</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isClocked ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {isClocked ? "Working" : "Not Working"}
              </span>
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
              <span className="font-medium">{calculateWorkingHours(clockInTime)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Location:</span>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Office</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recent Attendance</h3>
          <p className="text-gray-600 text-sm">Your attendance history for the past few days</p>
        </div>
        <div className="p-6">
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
                      <span className={getStatusBadge(record.status)}>{record.status}</span>
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

export default AttendanceLogger
