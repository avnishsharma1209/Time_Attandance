import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, User, LogIn, UserPlus } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Welcome to AuthSystem</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A secure authentication system with role-based access control for admins and employees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/login">
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup">
                <UserPlus className="h-5 w-5 mr-2" />
                Sign Up
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Admin Access</CardTitle>
              <CardDescription>Full system control and user management capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Manage all users</li>
                <li>• View system analytics</li>
                <li>• Configure system settings</li>
                <li>• Monitor user activity</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Employee Access</CardTitle>
              <CardDescription>Personal dashboard with essential work tools</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Personal profile management</li>
                <li>• Time tracking</li>
                <li>• Schedule viewing</li>
                <li>• Activity monitoring</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Secure & Reliable</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Built with modern security practices including password hashing, JWT tokens, and role-based access control
            to keep your data safe.
          </p>
        </div>
      </div>
    </div>
  )
}
