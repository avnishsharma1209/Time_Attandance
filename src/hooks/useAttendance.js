"use client"

import { useState } from "react"
import { useLocalStorage } from "./useLocalStorage"

export const useAttendance = (userId) => {
  const [isClocked, setIsClocked] = useState(false)
  const [clockInTime, setClockinTime] = useState(null)
  const [attendanceHistory, setAttendanceHistory] = useLocalStorage(`attendance_${userId}`, [])

  const clockIn = () => {
    const now = new Date()
    setIsClocked(true)
    setClockinTime(now)

    const newEntry = {
      id: Date.now(),
      date: now.toLocaleDateString(),
      clockIn: now.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" }),
      clockOut: "-",
      totalHours: "-",
      status: "In Progress",
    }
    setAttendanceHistory([newEntry, ...attendanceHistory])
  }

  const clockOut = () => {
    const now = new Date()
    setIsClocked(false)

    if (clockInTime) {
      const diffMs = now.getTime() - clockInTime.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

      setAttendanceHistory((prev) =>
        prev.map((entry, index) =>
          index === 0
            ? {
                ...entry,
                clockOut: now.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" }),
                totalHours: `${diffHours}h ${diffMinutes}m`,
                status: "Present",
              }
            : entry,
        ),
      )
    }

    setClockinTime(null)
  }

  return {
    isClocked,
    clockInTime,
    attendanceHistory,
    clockIn,
    clockOut,
  }
}
