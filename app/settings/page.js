import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import LogoutButton from "@/components/LogoutButton"
import ChangePasswordForm from "./ChangePasswordForm"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/settings")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("email, full_name, username, phone, email_verified_at, role")
    .eq("auth_id", user.id)
    .maybeSingle()

  const sectionStyle = {
    background: "white",
    borderRadius: "16px",
    padding: "1.5rem",
    marginBottom: "1rem",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
  }

  const sectionTitleStyle = {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "0.25rem"
  }

  const sectionDescStyle = {
    fontSize: "0.85rem",
    color: "#6b7280",
    marginBottom: "1rem"
  }

  return (
    <main style={{minHeight: "100vh", background: "#f9fafb", padding: "2rem 1rem"}}>
      <div style={{maxWidth: "700px", margin: "0 auto"}}>
        
        <Link href="/profile" style={{display: "inline-block", color: "#2563eb", textDecoration: "none", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
          ← กลับโปรไฟล์
        </Link>

        <h1 style={{fontSize: "2rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem"}}>
          ตั้งค่า
        </h1>
        <p style={{color: "#6b7280", fontSize: "1rem", marginBottom: "2rem"}}>
          จัดการบัญชีและการตั้งค่าของคุณ
        </p>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>👤 ข้อมูลส่วนตัว</h2>
          <p style={sectionDescStyle}>ชื่อ, username, bio, เบอร์โทร</p>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderTop: "1px solid #f3f4f6"}}>
            <div>
              <p style={{margin: 0, fontSize: "0.875rem", color: "#374151", fontWeight: "500"}}>{profile?.full_name}</p>
              <p style={{margin: "0.125rem 0 0", fontSize: "0.8rem", color: "#9ca3af"}}>@{profile?.username}</p>
            </div>
            <Link href="/profile/edit" style={{padding: "0.5rem 1rem", background: "#2563eb", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "0.875rem", fontWeight: "600"}}>
              แก้ไข
            </Link>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🔐 ความปลอดภัย</h2>
          <p style={sectionDescStyle}>เปลี่ยนรหัสผ่านและความปลอดภัยของบัญชี</p>
          <div style={{paddingTop: "0.5rem", borderTop: "1px solid #f3f4f6"}}>
            <ChangePasswordForm />
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📧 อีเมล</h2>
          <p style={sectionDescStyle}>อีเมลที่ใช้สำหรับเข้าสู่ระบบและรับการแจ้งเตือน</p>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderTop: "1px solid #f3f4f6"}}>
            <div>
              <p style={{margin: 0, fontSize: "0.875rem", color: "#374151", fontWeight: "500"}}>{profile?.email}</p>
              <p style={{margin: "0.125rem 0 0", fontSize: "0.8rem", color: profile?.email_verified_at ? "#10b981" : "#ef4444", fontWeight: "600"}}>
                {profile?.email_verified_at ? "✓ ยืนยันแล้ว" : "✗ ยังไม่ยืนยัน"}
              </p>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📍 ที่อยู่จัดส่ง</h2>
          <p style={sectionDescStyle}>จัดการที่อยู่สำหรับการจัดส่งสินค้า</p>
          <div style={{padding: "1rem", background: "#f9fafb", borderRadius: "8px", textAlign: "center", color: "#9ca3af", fontSize: "0.875rem"}}>
            🚧 จะเปิดใช้งานเร็ว ๆ นี้ (Day 6)
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🔔 การแจ้งเตือน</h2>
          <p style={sectionDescStyle}>ปรับแต่งการแจ้งเตือนของคุณ</p>
          <div style={{padding: "1rem", background: "#f9fafb", borderRadius: "8px", textAlign: "center", color: "#9ca3af", fontSize: "0.875rem"}}>
            🚧 จะเปิดใช้งานเร็ว ๆ นี้
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🌐 ภาษา</h2>
          <p style={sectionDescStyle}>ภาษาที่ใช้แสดงใน Boom Plus</p>
          <div style={{padding: "0.875rem 1rem", background: "#f9fafb", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <span style={{fontSize: "0.9rem", color: "#374151", fontWeight: "500"}}>🇹🇭 ไทย</span>
            <span style={{fontSize: "0.75rem", color: "#9ca3af"}}>ค่าเริ่มต้น</span>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>ℹ️ เกี่ยวกับ</h2>
          <div style={{paddingTop: "0.5rem", borderTop: "1px solid #f3f4f6"}}>
            <div style={{display: "flex", justifyContent: "space-between", padding: "0.625rem 0", fontSize: "0.875rem"}}>
              <span style={{color: "#6b7280"}}>เวอร์ชัน</span>
              <span style={{color: "#374151", fontWeight: "500"}}>0.1.0 (Beta)</span>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", padding: "0.625rem 0", fontSize: "0.875rem", borderTop: "1px solid #f3f4f6"}}>
              <span style={{color: "#6b7280"}}>บัญชี ID</span>
              <span style={{color: "#374151", fontWeight: "500", fontFamily: "monospace", fontSize: "0.75rem"}}>{user.id.substring(0, 8)}...</span>
            </div>
          </div>
        </div>

        <div style={{...sectionStyle, border: "2px solid #fecaca", background: "#fef2f2"}}>
          <h2 style={{...sectionTitleStyle, color: "#991b1b"}}>⚠️ Danger Zone</h2>
          <p style={{...sectionDescStyle, color: "#7f1d1d"}}>
            การกระทำต่อไปนี้ไม่สามารถย้อนกลับได้
          </p>
          <div style={{display: "flex", flexDirection: "column", gap: "0.75rem"}}>
            <LogoutButton />
            <button
              disabled
              style={{padding: "0.625rem 1.25rem", background: "white", color: "#9ca3af", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "0.875rem", fontWeight: "600", cursor: "not-allowed"}}
            >
              ลบบัญชีถาวร (ยังไม่เปิดใช้งาน)
            </button>
          </div>
        </div>

        <p style={{textAlign: "center", fontSize: "0.8rem", color: "#9ca3af", marginTop: "2rem"}}>
          Boom Plus Marketplace © 2026
        </p>

      </div>
    </main>
  )
}