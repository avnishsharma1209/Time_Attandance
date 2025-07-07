"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { LEAVE_TYPES } from "../../utils/constants"

const LeaveManagement = ({ user }) => {
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      type: "Annual Leave",
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      days: 3,
      reason: "Family vacation",
      status: "Approved",
      appliedDate: "2024-01-10",
    },
    {
      id: 2,
      type: "Sick Leave",
      startDate: "2024-01-15",
      endDate: "2024-01-15",
      days: 1,
      reason: "Medical appointment",
      status: "Pending",
      appliedDate: "2024-01-14",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [newLeave, setNewLeave] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  })

  const leaveBalance = {
    annual: { used: 5, total: 20 },
    sick: { used: 2, total: 10 },
    personal: { used: 1, total: 5 },
  }

  const handleSubmitLeave = (e) => {
    e.preventDefault()
    if (!newLeave.type || !newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
      alert("Please fill all fields")
      return
    }

    const startDate = new Date(newLeave.startDate)
    const endDate = new Date(newLeave.endDate)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const newRequest = {
      id: leaveRequests.length + 1,
      type: newLeave.type,
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      days,
      reason: newLeave.reason,
      status: "Pending",
      appliedDate: new Date().toISOString().split("T")[0],
    }

    setLeaveRequests([newRequest, ...leaveRequests])
    setNewLeave({ type: "", startDate: "", endDate: "", reason: "" })
    setShowForm(false)
  }

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case "Approved":
        return `${baseClasses} bg-green-100 text-green-800`
      case "Pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "Rejected":
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  return (
    <div className="space-y-6">
      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Annual Leave</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold">{leaveBalance.annual.total - leaveBalance.annual.used}</span>
            <span className="text-sm text-gray-500">days left</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${(leaveBalance.annual.used / leaveBalance.annual.total) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {leaveBalance.annual.used} of {leaveBalance.annual.total} used
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Sick Leave</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold">{leaveBalance.sick.total - leaveBalance.sick.used}</span>
            <span className="text-sm text-gray-500">days left</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full"
              style={{ width: `${(leaveBalance.sick.used / leaveBalance.sick.total) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {leaveBalance.sick.used} of {leaveBalance.sick.total} used
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Personal Leave</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold">{leaveBalance.personal.total - leaveBalance.personal.used}</span>
            <span className="text-sm text-gray-500">days left</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${(leaveBalance.personal.used / leaveBalance.personal.total) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {leaveBalance.personal.used} of {leaveBalance.personal.total} used
          </p>
        </div>
      </div>

      {/* Leave Requests */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Leave Requests</h3>
              <p className="text-gray-600 text-sm">Manage your leave applications</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Apply Leave</span>
            </button>
          </div>
        </div>

        {showForm && (
          <div className="p-6 border-b bg-gray-50">
            <h4 className="text-lg font-medium mb-4">Apply for Leave</h4>
            <form onSubmit={handleSubmitLeave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select
                  value={newLeave.type}
                  onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select leave type</option>
                  {LEAVE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newLeave.startDate}
                    onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newLeave.endDate}
                    onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  placeholder="Please provide a reason for your leave request"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Start Date</th>
                  <th className="text-left py-2">End Date</th>
                  <th className="text-left py-2">Days</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Applied</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request) => (
                  <tr key={request.id} className="border-b">
                    <td className="py-3">{request.type}</td>
                    <td className="py-3">{request.startDate}</td>
                    <td className="py-3">{request.endDate}</td>
                    <td className="py-3">{request.days}</td>
                    <td className="py-3">
                      <span className={getStatusBadge(request.status)}>{request.status}</span>
                    </td>
                    <td className="py-3">{request.appliedDate}</td>
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

export default LeaveManagement
