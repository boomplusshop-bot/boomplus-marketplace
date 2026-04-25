"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { updateProfile } from "@/lib/supabase/profile-actions"

export default function EditForm({ initialProfile }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(formData) {
    setIsLoading(true)
    setError("")
    setSuccess("")

    const result = await updateProfile(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.success) {
      setSuccess(result.message)
      setTimeout(() => {
        router.push("/profile")
        router.refresh()
      }, 1000)
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
    fontFamily: "inherit"
  }

  const labelStyle = {
    display: "block",
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "0.5rem"
  }

  const helpStyle = {
    fontSize: "0.8rem",
    color: "#6b7280",
    marginTop: "0.375rem"
  }

  return (
    <main style={{minHeight: "100vh", background: "linear-gradient(135deg, #eff6ff, #ffffff)", padding: "2rem 1rem"}}>
      <style>{`
        input::placeholder, textarea::placeholder {
          color: #9ca3af !important;
          opacity: 1 !important;
          font-weight: 400 !important;
        }
        input:focus, textarea:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
      `}</style>

      <div style={{maxWidth: "600px", margin: "0 auto"}}>
        
        <Link href="/profile" style={{display: "inline-block", color: "#2563eb", textDecoration: "none", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
          ← กลับโปรไฟล์
        </Link>

        <div style={{background: "white", borderRadius: "16px", padding: "2rem", border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.06)"}}>
          
          <h1 style={{fontSize: "1.75rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem"}}>
            แก้ไขโปรไฟล์
          </h1>
          <p style={{color: "#6b7280", fontSize: "0.95rem", marginBottom: "2rem"}}>
            อัปเดตข้อมูลส่วนตัวของคุณ
          </p>

          {error && (
            <div style={{background: "#fef2f2", border: "2px solid #fecaca", color: "#991b1b", padding: "0.875rem 1rem", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{background: "#f0fdf4", border: "2px solid #bbf7d0", color: "#166534", padding: "0.875rem 1rem", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
              ✅ {success} กำลังกลับไปหน้าโปรไฟล์...
            </div>
          )}

          <form action={handleSubmit}>
            
            <div style={{marginBottom: "1.5rem"}}>
              <label style={labelStyle}>
                ชื่อ-นามสกุล <span style={{color: "#ef4444"}}>*</span>
              </label>
              <input
                type="text"
                name="fullName"
                defaultValue={initialProfile.full_name || ""}
                placeholder="เช่น อัครพล ศรีสวัสดิ์"
                required
                maxLength={100}
                disabled={isLoading}
                style={inputStyle}
              />
              <p style={helpStyle}>ชื่อจริงของคุณที่จะแสดงในโปรไฟล์</p>
            </div>

            <div style={{marginBottom: "1.5rem"}}>
              <label style={labelStyle}>
                Username <span style={{color: "#ef4444"}}>*</span>
              </label>
              <input
                type="text"
                name="username"
                defaultValue={initialProfile.username || ""}
                placeholder="boomplusshop"
                required
                minLength={3}
                maxLength={30}
                pattern="[a-z0-9_]+"
                disabled={isLoading}
                style={inputStyle}
              />
              <p style={helpStyle}>ใช้ได้เฉพาะ a-z, 0-9, _ (พิมพ์เล็ก) — เปลี่ยนได้ ถ้าไม่ซ้ำ</p>
            </div>

            <div style={{marginBottom: "1.5rem"}}>
              <label style={labelStyle}>
                เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={initialProfile.phone || ""}
                placeholder="0812345678"
                maxLength={15}
                disabled={isLoading}
                style={inputStyle}
              />
              <p style={helpStyle}>ตัวเลข 9-10 หลัก เช่น 0812345678</p>
            </div>

            <div style={{marginBottom: "2rem"}}>
              <label style={labelStyle}>
                เกี่ยวกับฉัน (Bio)
              </label>
              <textarea
                name="bio"
                defaultValue={initialProfile.bio || ""}
                placeholder="แนะนำตัวสั้น ๆ..."
                rows={4}
                maxLength={500}
                disabled={isLoading}
                style={{...inputStyle, resize: "vertical", minHeight: "100px"}}
              />
              <p style={helpStyle}>สูงสุด 500 ตัวอักษร</p>
            </div>

            <div style={{background: "#f3f4f6", borderRadius: "10px", padding: "1rem", marginBottom: "1.5rem"}}>
              <p style={{fontSize: "0.8rem", color: "#6b7280", margin: 0, marginBottom: "0.25rem", fontWeight: "600"}}>
                อีเมล (เปลี่ยนไม่ได้)
              </p>
              <p style={{fontSize: "0.95rem", color: "#374151", margin: 0, fontWeight: "500"}}>
                {initialProfile.email}
              </p>
            </div>

            <div style={{display: "flex", gap: "0.75rem"}}>
              <Link
                href="/profile"
                style={{flex: 1, padding: "0.875rem", background: "white", color: "#374151", border: "2px solid #d1d5db", borderRadius: "10px", textAlign: "center", textDecoration: "none", fontWeight: "600", fontSize: "1rem"}}
              >
                ยกเลิก
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                style={{flex: 2, padding: "0.875rem", background: isLoading ? "#93c5fd" : "#2563eb", color: "white", border: "none", borderRadius: "10px", fontSize: "1rem", fontWeight: "600", cursor: isLoading ? "not-allowed" : "pointer", boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)"}}
              >
                {isLoading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
              </button>
            </div>

          </form>
        </div>

        <p style={{textAlign: "center", fontSize: "0.8rem", color: "#9ca3af", marginTop: "1.5rem"}}>
          Boom Plus Marketplace © 2026
        </p>

      </div>
    </main>
  )
}