"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface LeaveManagementProps {
  user: any
}

export function LeaveManagement({ user }: LeaveManagementProps) {
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
    {
      id: 3,
      type: "Personal Leave",
      startDate: "2024-01-08",
      endDate: "2024-01-09",
      days: 2,
      reason: "Personal matters",
      status: "Rejected",
      appliedDate: "2024-01-05",
    },
  ])

  const [newLeave, setNewLeave] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const leaveBalance = {
    annual: { used: 5, total: 20 },
    sick: { used: 2, total: 10 },
    personal: { used: 1, total: 5 },
  }

  const handleSubmitLeave = () => {
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
    setIsDialogOpen(false)
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

  return (
    <div className="space-y-6">
      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Annual Leave</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Sick Leave</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Personal Leave</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      {/* Apply for Leave */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>Manage your leave applications</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Apply Leave
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply for Leave</DialogTitle>
                  <DialogDescription>Fill in the details for your leave request</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="leave-type">Leave Type</Label>
                    <Select value={newLeave.type} onValueChange={(value) => setNewLeave({ ...newLeave, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                        <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                        <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                        <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={newLeave.startDate}
                        onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={newLeave.endDate}
                        onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please provide a reason for your leave request"
                      value={newLeave.reason}
                      onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitLeave}>Submit Request</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
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
                    <td className="py-3">{getStatusBadge(request.status)}</td>
                    <td className="py-3">{request.appliedDate}</td>
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
