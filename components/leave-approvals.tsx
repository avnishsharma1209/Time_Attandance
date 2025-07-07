"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Check, X, Eye, Calendar, User } from "lucide-react"

export function LeaveApprovals() {
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
      status: "Pending",
      appliedDate: "2024-01-16",
      remainingLeave: 4,
    },
    {
      id: 4,
      employeeName: "Sarah Wilson",
      employeeId: "EMP004",
      department: "HR",
      type: "Emergency Leave",
      startDate: "2024-01-19",
      endDate: "2024-01-19",
      days: 1,
      reason: "Family emergency - urgent",
      status: "Approved",
      appliedDate: "2024-01-18",
      remainingLeave: 12,
      approvedBy: "Admin",
      approvedDate: "2024-01-18",
    },
  ])

  const [selectedRequest, setSelectedRequest] = useState(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const handleApprove = (id: number) => {
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

  const handleReject = (id: number, reason: string) => {
    setLeaveRequests((requests) =>
      requests.map((request) =>
        request.id === id
          ? {
              ...request,
              status: "Rejected",
              rejectionReason: reason,
              rejectedBy: "Admin",
              rejectedDate: new Date().toISOString().split("T")[0],
            }
          : request,
      ),
    )
    setRejectionReason("")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const pendingRequests = leaveRequests.filter((req) => req.status === "Pending")
  const processedRequests = leaveRequests.filter((req) => req.status !== "Pending")

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
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
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-3xl font-bold text-blue-600">{leaveRequests.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
          <CardDescription>Review and approve or reject leave requests</CardDescription>
        </CardHeader>
        <CardContent>
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
                        <h3 className="font-semibold">{request.employeeName}</h3>
                        <Badge variant="outline">{request.employeeId}</Badge>
                        <Badge variant="secondary">{request.department}</Badge>
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Leave Request Details</DialogTitle>
                            <DialogDescription>
                              Complete information for {request.employeeName}'s leave request
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-medium">Employee</Label>
                                <p>
                                  {request.employeeName} ({request.employeeId})
                                </p>
                              </div>
                              <div>
                                <Label className="font-medium">Department</Label>
                                <p>{request.department}</p>
                              </div>
                              <div>
                                <Label className="font-medium">Leave Type</Label>
                                <p>{request.type}</p>
                              </div>
                              <div>
                                <Label className="font-medium">Duration</Label>
                                <p>{request.days} day(s)</p>
                              </div>
                              <div>
                                <Label className="font-medium">Start Date</Label>
                                <p>{request.startDate}</p>
                              </div>
                              <div>
                                <Label className="font-medium">End Date</Label>
                                <p>{request.endDate}</p>
                              </div>
                            </div>
                            <div>
                              <Label className="font-medium">Reason</Label>
                              <p className="mt-1 p-3 bg-gray-50 rounded">{request.reason}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Remaining Leave Balance</Label>
                              <p>{request.remainingLeave} days</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Leave Request</DialogTitle>
                            <DialogDescription>
                              Please provide a reason for rejecting {request.employeeName}'s leave request
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Enter reason for rejection..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                            />
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline">Cancel</Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleReject(request.id, rejectionReason)}
                                disabled={!rejectionReason.trim()}
                              >
                                Reject Request
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Processed Requests</CardTitle>
          <CardDescription>Previously approved or rejected leave requests</CardDescription>
        </CardHeader>
        <CardContent>
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
                    <td className="py-3">{getStatusBadge(request.status)}</td>
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
        </CardContent>
      </Card>
    </div>
  )
}
