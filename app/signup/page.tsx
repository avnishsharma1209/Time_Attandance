"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, User, UserPlus, ArrowLeft } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <UserPlus className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Choose Your Account Type</h1>
          <p className="text-gray-600 mt-2">Select the type of account you want to create</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-red-100 rounded-full w-fit">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl">Admin Account</CardTitle>
              <CardDescription>Full system access with user management capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Manage all users</li>
                <li>• System configuration</li>
                <li>• Analytics and reports</li>
                <li>• Full administrative control</li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/signup/admin">Create Admin Account</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Employee Account</CardTitle>
              <CardDescription>Personal workspace with essential work tools</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Personal dashboard</li>
                <li>• Time tracking</li>
                <li>• Schedule management</li>
                <li>• Profile management</li>
              </ul>
              <Button asChild className="w-full bg-transparent" variant="outline">
                <Link href="/signup/employee">Create Employee Account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in here
            </Link>
          </p>
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
