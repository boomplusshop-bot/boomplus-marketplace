"use client"

import { useState } from "react"
import { logout } from "@/lib/supabase/auth-actions"

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    setIsLoading(true)
    await logout()
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      style={{
        padding: "0.75rem 2rem",
        background: isLoading ? "#fca5a5" : "white",
        color: isLoading ? "white" : "#dc2626",
        border: "2px solid #dc2626",
        borderRadius: "8px",
        fontWeight: "500",
        cursor: isLoading ? "not-allowed" : "pointer",
        fontSize: "1rem",
        transition: "all 0.2s"
      }}
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  )
}