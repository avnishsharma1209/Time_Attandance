"use client"

import { useState } from "react"
import { AuthProvider } from "./context/AuthContext"
import LoginForm from "./components/auth/LoginForm"
import Dashboard from "./components/dashboard/Dashboard"
import AdminPanel from "./components/admin/AdminPanel"
import "./App.css"

function App() {
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
    <AuthProvider>
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
    </AuthProvider>
  )
}

export default App
