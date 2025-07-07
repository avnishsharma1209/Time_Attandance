"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { Dashboard } from "@/components/dashboard"
import { AdminPanel } from "@/components/admin-panel"

export default function Home() {
  const [user, setUser] = useState(null)
  const [currentView, setCurrentView] = useState("login")

  const handleLogin = (userData) => {
    setUser(userData)
    setCurrentView(userData.role === "admin" ? "admin" : "dashboard")
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentView("login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "login" && <LoginForm onLogin={handleLogin} />}

      {currentView === "dashboard" && user && (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onSwitchToAdmin={() => user.role === "admin" && setCurrentView("admin")}
        />
      )}

      {currentView === "admin" && user && user.role === "admin" && (
        <AdminPanel user={user} onLogout={handleLogout} onSwitchToDashboard={() => setCurrentView("dashboard")} />
      )}
    </div>
  )
}
