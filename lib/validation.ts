// Admin verification codes (in production, store these securely)
const ADMIN_CODES = ["ADMIN2024", "SUPERUSER123", "MGMT2024", "SYSADMIN001"]

export function validateAdminCode(code: string): boolean {
  return ADMIN_CODES.includes(code.toUpperCase())
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters long" }
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: "Password must contain at least one lowercase letter" }
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter" }
  }

  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: "Password must contain at least one number" }
  }

  return { isValid: true }
}

export function validateEmployeeId(employeeId: string): boolean {
  // Employee ID should be alphanumeric and 3-10 characters
  const employeeIdRegex = /^[A-Z0-9]{3,10}$/
  return employeeIdRegex.test(employeeId.toUpperCase())
}

export function validatePhoneNumber(phone: string): boolean {
  // Basic phone number validation
  const phoneRegex = /^\+?[\d\s\-$$$$]{10,}$/
  return phoneRegex.test(phone)
}
