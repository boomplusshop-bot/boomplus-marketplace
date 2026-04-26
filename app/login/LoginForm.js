"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { login } from "@/lib/supabase/auth-actions"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/"
  const errorParam = searchParams.get("error")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(
    errorParam === "auth_failed" ? "การยืนยันอีเมลล้มเหลว กรุณาลองอีกครั้ง" : ""
  )

  async function handleSubmit(formData) {
    setIsLoading(true)
    setError("")

    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
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
    fontWeight: "500",
    transition: "border-color 0.2s"
  }

  const labelStyle = {
    display: "block",
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "0.5rem"
  }

  return (
    <div style={{background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "2.5rem 2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)"}}>
      
      <h1 style={{fontSize: "1.875rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem", textAlign: "center"}}>
        เข้าสู่ระบบ
      </h1>
      <p style={{color: "#4b5563", marginBottom: "2rem", textAlign: "center", fontSize: "0.95rem"}}>
        ยินดีต้อนรับกลับสู่ Boom Plus
      </p>

      {error && (
        <div style={{background: "#fef2f2", border: "2px solid #fecaca", color: "#991b1b", padding: "0.875rem 1rem", borderRadius: "10px", marginBottom: "1rem", fontSize: "0.95rem", fontWeight: "500"}}>
          {error}
        </div>
      )}

      <form action={handleSubmit}>
        
        <div style={{marginBottom: "1.25rem"}}>
          <label style={labelStyle}>
            อีเมล <span style={{color: "#ef4444"}}>*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            disabled={isLoading}
            autoFocus
            style={inputStyle}
          />
        </div>

        <div style={{marginBottom: "0.75rem"}}>
          <label style={labelStyle}>
            รหัสผ่าน <span style={{color: "#ef4444"}}>*</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="กรอกรหัสผ่าน"
            required
            disabled={isLoading}
            style={inputStyle}
          />
        </div>

        <div style={{textAlign: "right", marginBottom: "1.5rem"}}>
          <Link href="/forgot-password" style={{color: "#2563eb", fontSize: "0.875rem", textDecoration: "none", fontWeight: "500"}}>
            ลืมรหัสผ่าน?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{width: "100%", padding: "1rem", background: isLoading ? "#93c5fd" : "#2563eb", color: "white", border: "none", borderRadius: "10px", fontSize: "1.05rem", fontWeight: "600", cursor: isLoading ? "not-allowed" : "pointer", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)"}}
        >
          {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>

      <div style={{textAlign: "center", marginTop: "1.75rem", paddingTop: "1.5rem", borderTop: "1px solid #e5e7eb"}}>
        <p style={{color: "#4b5563", fontSize: "0.95rem"}}>
          ยังไม่มีบัญชี?{" "}
          <Link href="/signup" style={{color: "#2563eb", fontWeight: "600", textDecoration: "none"}}>
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </div>
  )
}