"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { resetPassword } from "@/lib/supabase/auth-actions"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(formData) {
    setIsLoading(true)
    setError("")
    setSuccess("")

    const result = await resetPassword(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.success) {
      setSuccess(result.message)
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "0.875rem 1rem",
    border: "2px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "1rem",
    outline: "none",
    color: "#111827",
    background: "#ffffff",
    fontWeight: "500"
  }

  return (
    <main style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #eff6ff, #ffffff)", padding: "1rem"}}>
      <style>{`
        input::placeholder { color: #9ca3af !important; opacity: 1 !important; font-weight: 400 !important; }
        input:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
      `}</style>

      <div style={{maxWidth: "440px", width: "100%"}}>
        
        <Link href="/" style={{display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem", textDecoration: "none"}}>
          <div style={{width: "64px", height: "64px", borderRadius: "16px", background: "#2563eb", color: "white", fontSize: "2rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"}}>
            B
          </div>
        </Link>

        <div style={{background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "2.5rem 2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)"}}>
          
          <h1 style={{fontSize: "1.75rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem", textAlign: "center"}}>
            ตั้งรหัสผ่านใหม่
          </h1>
          <p style={{color: "#4b5563", marginBottom: "2rem", textAlign: "center", fontSize: "0.95rem"}}>
            กรอกรหัสผ่านใหม่ของคุณ
          </p>

          {error && (
            <div style={{background: "#fef2f2", border: "2px solid #fecaca", color: "#991b1b", padding: "0.875rem 1rem", borderRadius: "10px", marginBottom: "1rem", fontSize: "0.95rem", fontWeight: "500"}}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{background: "#f0fdf4", border: "2px solid #bbf7d0", color: "#166534", padding: "0.875rem 1rem", borderRadius: "10px", marginBottom: "1rem", fontSize: "0.95rem", fontWeight: "500"}}>
              ✅ {success}
            </div>
          )}

          <form action={handleSubmit}>
            
            <div style={{marginBottom: "1.25rem"}}>
              <label style={{display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#1f2937", marginBottom: "0.5rem"}}>
                รหัสผ่านใหม่ <span style={{color: "#ef4444"}}>*</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="อย่างน้อย 6 ตัวอักษร"
                required
                minLength={6}
                autoFocus
                disabled={isLoading || success}
                style={inputStyle}
              />
            </div>

            <div style={{marginBottom: "1.5rem"}}>
              <label style={{display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#1f2937", marginBottom: "0.5rem"}}>
                ยืนยันรหัสผ่าน <span style={{color: "#ef4444"}}>*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                required
                minLength={6}
                disabled={isLoading || success}
                style={inputStyle}
              />
              <p style={{fontSize: "0.8rem", color: "#6b7280", marginTop: "0.375rem"}}>
                ต้องตรงกับรหัสผ่านด้านบน
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              style={{width: "100%", padding: "1rem", background: (isLoading || success) ? "#93c5fd" : "#2563eb", color: "white", border: "none", borderRadius: "10px", fontSize: "1.05rem", fontWeight: "600", cursor: (isLoading || success) ? "not-allowed" : "pointer", boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)"}}
            >
              {isLoading ? "กำลังบันทึก..." : success ? "สำเร็จ!" : "ตั้งรหัสผ่านใหม่"}
            </button>
          </form>

          <div style={{textAlign: "center", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid #e5e7eb"}}>
            <Link href="/login" style={{color: "#2563eb", fontWeight: "600", textDecoration: "none", fontSize: "0.9rem"}}>
              ← กลับไปเข้าสู่ระบบ
            </Link>
          </div>
        </div>

        <p style={{textAlign: "center", fontSize: "0.8rem", color: "#9ca3af", marginTop: "1.5rem"}}>
          Boom Plus Marketplace © 2026
        </p>

      </div>
    </main>
  )
}