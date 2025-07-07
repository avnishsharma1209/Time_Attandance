"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, Mail, Phone } from "lucide-react"

export function EmployeeManagement() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@company.com",
      employeeId: "EMP001",
      department: "Engineering",
      position: "Senior Developer",
      phone: "+1 234 567 8901",
      status: "Active",
      joinDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@company.com",
      employeeId: "EMP002",
      department: "Marketing",
      position: "Marketing Manager",
      phone: "+1 234 567 8902",
      status: "Active",
      joinDate: "2023-02-20",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@company.com",
      employeeId: "EMP003",
      department: "Sales",
      position: "Sales Representative",
      phone: "+1 234 567 8903",
      status: "Active",
      joinDate: "2023-03-10",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@company.com",
      employeeId: "EMP004",
      department: "HR",
      position: "HR Specialist",
      phone: "+1 234 567 8904",
      status: "Inactive",
      joinDate: "2023-01-05",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    employeeId: "",
    department: "",
    position: "",
    phone: "",
  })

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.employeeId) {
      alert("Please fill in all required fields")
      return
    }

    const employee = {
      id: employees.length + 1,
      ...newEmployee,
      status: "Active",
      joinDate: new Date().toISOString().split("T")[0],
    }

    setEmployees([...employees, employee])
    setNewEmployee({
      name: "",
      email: "",
      employeeId: "",
      department: "",
      position: "",
      phone: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteEmployee = (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter((emp) => emp.id !== id))
    }
  }

  const toggleEmployeeStatus = (id: number) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, status: emp.status === "Active" ? "Inactive" : "Active" } : emp,
      ),
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Employee Management</CardTitle>
            <CardDescription>Manage employee information and access</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>Enter the employee details to create a new account</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <Label htmlFor="employeeId">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    value={newEmployee.employeeId}
                    onChange={(e) => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
                    placeholder="Enter employee ID"
                  />
                </div>

                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={newEmployee.department}
                    onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="HR">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    placeholder="Enter job position"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmployee}>Add Employee</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredEmployees.length} of {employees.length} employees
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Employee</th>
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">Department</th>
                <th className="text-left py-2">Position</th>
                <th className="text-left py-2">Contact</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-b">
                  <td className="py-3">
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-gray-500">Joined: {employee.joinDate}</div>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-sm">{employee.employeeId}</td>
                  <td className="py-3">{employee.department}</td>
                  <td className="py-3">{employee.position}</td>
                  <td className="py-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="h-3 w-3" />
                        <span>{employee.email}</span>
                      </div>
                      {employee.phone && (
                        <div className="flex items-center space-x-1 text-sm">
                          <Phone className="h-3 w-3" />
                          <span>{employee.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge
                      variant={employee.status === "Active" ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleEmployeeStatus(employee.id)}
                    >
                      {employee.status}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteEmployee(employee.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
