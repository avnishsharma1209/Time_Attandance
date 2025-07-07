"use client"

import { useState } from "react"
import { Check, X, Calendar, User } from "lucide-react"

const LeaveApprovals = () => {
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      employeeName: "John Doe",
      employeeId: "EMP001",
      department: "Engineering",
      type: "Annual Leave",
      startDate: "2024-01-25",
      endDate: "2024-01-27",
      days: 3,
      reason: "Family vacation to celebrate anniversary",
      status: "Pending",
      appliedDate: "2024-01-15",
      remainingLeave: 15,
    },
    {
      id: 2,
      employeeName: "Jane Smith",
      employeeId: "EMP002",
      department: "Marketing",
      type: "Sick Leave",
      startDate: "2024-01-20",
      endDate: "2024-01-20",
      days: 1,
      reason: "Medical appointment with specialist",
      status: "Pending",
      appliedDate: "2024-01-18",
      remainingLeave: 8,
    },
    {
      id: 3,
      employeeName: "Mike Johnson",
      employeeId: "EMP003",
      department: "Sales",
      type: "Personal Leave",
      startDate: "2024-01-22",
      endDate: "2024-01-23",
      days: 2,
      reason: "Moving to new apartment",
      status: "Approved",
      appliedDate: "2024-01-16",
      remainingLeave: 4,
      approvedBy: "Admin",
      approvedDate: "2024-01-18",
    },
  ])

  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState(null)

  const handleApprove = (id) => {
    setLeaveRequests((requests) =>
      requests.map((request) =>
        request.id === id
          ? {
              ...request,
              status: "Approved",
              approvedBy: "Admin",
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : request,
      ),
    )
  }

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection")
      return
    }

    setLeaveRequests((requests) =>
      requests.map((request) =>
        request.id === selectedRequestId
          ? {
              ...request,
              status: "Rejected",
              rejectionReason,
              rejectedBy: "Admin",
              rejectedDate: new Date().toISOString().split("T")[0],
            }
          : request,
      ),
    )
    setRejectionReason("")
    setShowRejectModal(false)
    setSelectedRequestId(null)
  }

  const openRejectModal = (id) => {
    setSelectedRequestId(id)
    setShowRejectModal(true)
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

  const pendingRequests = leaveRequests.filter((req) => req.status === "Pending")
  const processedRequests = leaveRequests.filter((req) => req.status !== "Pending")

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Today</p>
              <p className="text-3xl font-bold text-green-600">
                {
                  processedRequests.filter(
                    (req) => req.status === "Approved" && req.approvedDate === new Date().toISOString().split("T")[0],
                  ).length
                }
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold text-blue-600">{leaveRequests.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Pending Leave Requests</h3>
          <p className="text-gray-600 text-sm">Review and approve or reject leave requests</p>
        </div>
        <div className="p-6">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No pending leave requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="font-semibold">{request.employeeName}</h4>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                          {request.employeeId}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {request.department}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Type:</span> {request.type}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {request.days} day(s)
                        </div>
                        <div>
                          <span className="font-medium">From:</span> {request.startDate}
                        </div>
                        <div>
                          <span className="font-medium">To:</span> {request.endDate}
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="font-medium text-sm">Reason:</span>
                        <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                      </div>

                      <div className="text-xs text-gray-500">
                        Applied on: {request.appliedDate} | Remaining leave: {request.remainingLeave} days
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <Check className="h-4 w-4" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => openRejectModal(request.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <X className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Processed Requests */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recent Processed Requests</h3>
          <p className="text-gray-600 text-sm">Previously approved or rejected leave requests</p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Employee</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Duration</th>
                  <th className="text-left py-2">Dates</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Processed</th>
                </tr>
              </thead>
              <tbody>
                {processedRequests.slice(0, 10).map((request) => (
                  <tr key={request.id} className="border-b">
                    <td className="py-3">
                      <div>
                        <div className="font-medium">{request.employeeName}</div>
                        <div className="text-sm text-gray-500">{request.department}</div>
                      </div>
                    </td>
                    <td className="py-3">{request.type}</td>
                    <td className="py-3">{request.days} day(s)</td>
                    <td className="py-3">
                      <div className="text-sm">
                        <div>{request.startDate}</div>
                        <div className="text-gray-500">to {request.endDate}</div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={getStatusBadge(request.status)}>{request.status}</span>
                    </td>
                    <td className="py-3">
                      <div className="text-sm">
                        <div>{request.approvedDate || request.rejectedDate}</div>
                        <div className="text-gray-500">by {request.approvedBy || request.rejectedBy}</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Leave Request</h3>
            <p className="text-gray-600 text-sm mb-4">Please provide a reason for rejecting this leave request</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason("")
                  setSelectedRequestId(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button onClick={handleReject} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaveApprovals
