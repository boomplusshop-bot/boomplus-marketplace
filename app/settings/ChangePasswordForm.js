"use client"

import { useState } from "react"
import { changePassword } from "@/lib/supabase/auth-actions"

export default function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showForm, setShowForm] = useState(false)

  async function handleSubmit(formData) {
    setIsLoading(true)
    setError("")
    setSuccess("")

    const result = await changePassword(formData)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.message)
      setTimeout(() => {
        setShowForm(false)
        setSuccess("")
      }, 2000)
    }

    setIsLoading(false)
  }

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "2px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
    color: "#111827",
    background: "#ffffff",
    fontWeight: "500"
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        style={{padding: "0.625rem 1.25rem", background: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.875rem", fontWeight: "600", cursor: "pointer"}}
      >
        เปลี่ยนรหัสผ่าน
      </button>
    )
  }

  return (
    <div style={{marginTop: "1rem", padding: "1.25rem", background: "#f9fafb", borderRadius: "10px", border: "1px solid #e5e7eb"}}>
      <style>{`
        input::placeholder { color: #9ca3af !important; opacity: 1 !important; font-weight: 400 !important; }
        input:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
      `}</style>

      {error && (
        <div style={{background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: "0.625rem 0.875rem", borderRadius: "8px", marginBottom: "0.875rem", fontSize: "0.875rem"}}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div style={{background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", padding: "0.625rem 0.875rem", borderRadius: "8px", marginBottom: "0.875rem", fontSize: "0.875rem"}}>
          ✅ {success}
        </div>
      )}

      <form action={handleSubmit}>
        <div style={{marginBottom: "0.875rem"}}>
          <label style={{display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginBottom: "0.375rem"}}>
            รหัสผ่านปัจจุบัน
          </label>
          <input type="password" name="currentPassword" required disabled={isLoading} style={inputStyle} placeholder="กรอกรหัสผ่านปัจจุบัน" />
        </div>

        <div style={{marginBottom: "0.875rem"}}>
          <label style={{display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginBottom: "0.375rem"}}>
            รหัสผ่านใหม่
          </label>
          <input type="password" name="newPassword" required minLength={6} disabled={isLoading} style={inputStyle} placeholder="อย่างน้อย 6 ตัวอักษร" />
        </div>

        <div style={{marginBottom: "1.25rem"}}>
          <label style={{display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginBottom: "0.375rem"}}>
            ยืนยันรหัสผ่านใหม่
          </label>
          <input type="password" name="confirmPassword" required minLength={6} disabled={isLoading} style={inputStyle} placeholder="กรอกรหัสผ่านใหม่อีกครั้ง" />
        </div>

        <div style={{display: "flex", gap: "0.5rem"}}>
          <button
            type="button"
            onClick={() => { setShowForm(false); setError(""); setSuccess(""); }}
            disabled={isLoading}
            style={{flex: 1, padding: "0.625rem", background: "white", color: "#6b7280", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.875rem", fontWeight: "600", cursor: "pointer"}}
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={isLoading}
            style={{flex: 2, padding: "0.625rem", background: isLoading ? "#93c5fd" : "#2563eb", color: "white", border: "none", borderRadius: "8px", fontSize: "0.875rem", fontWeight: "600", cursor: isLoading ? "not-allowed" : "pointer"}}
          >
            {isLoading ? "กำลังเปลี่ยน..." : "บันทึกรหัสผ่านใหม่"}
          </button>
        </div>
      </form>
    </div>
  )
}