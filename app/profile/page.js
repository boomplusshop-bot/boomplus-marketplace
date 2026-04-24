import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import LogoutButton from "@/components/LogoutButton"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/profile")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", user.id)
    .maybeSingle()

  const { data: points } = await supabase
    .from("user_points")
    .select("balance, tier, lifetime_earned")
    .eq("user_id", profile?.id)
    .maybeSingle()

  const displayName = profile?.full_name || profile?.username || "User"
  const initial = displayName.charAt(0).toUpperCase()
  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })
    : "-"

  const roleLabel = {
    customer: "ลูกค้า",
    shop_owner: "เจ้าของร้าน",
    admin: "ผู้ดูแลระบบ",
    moderator: "โมเดอเรเตอร์"
  }[profile?.role] || "ลูกค้า"

  const tierLabel = {
    member: "Member",
    silver: "Silver",
    gold: "Gold",
    platinum: "Platinum"
  }[points?.tier] || "Member"

  return (
    <main style={{minHeight: "100vh", background: "linear-gradient(135deg, #eff6ff, #ffffff)", padding: "2rem 1rem"}}>
      <div style={{maxWidth: "800px", margin: "0 auto"}}>
        
        <Link href="/" style={{display: "inline-block", color: "#2563eb", textDecoration: "none", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
          ← กลับหน้าแรก
        </Link>

        <div style={{background: "white", borderRadius: "20px", padding: "2.5rem 2rem", marginBottom: "1.5rem", border: "1px solid #e5e7eb", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.06)"}}>
          <div style={{width: "120px", height: "120px", borderRadius: "50%", background: "#10b981", color: "white", fontSize: "3rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem"}}>
            {initial}
          </div>
          <h1 style={{fontSize: "2rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem"}}>
            {displayName}
          </h1>
          <p style={{color: "#6b7280", fontSize: "1rem", marginBottom: "1rem"}}>
            @{profile?.username}
          </p>
          <div>
            <span style={{background: "#dbeafe", color: "#1e40af", padding: "0.375rem 1rem", borderRadius: "20px", fontSize: "0.875rem", fontWeight: "500", marginRight: "0.5rem"}}>
              {roleLabel}
            </span>
            <span style={{background: "#fef3c7", color: "#92400e", padding: "0.375rem 1rem", borderRadius: "20px", fontSize: "0.875rem", fontWeight: "600"}}>
              {tierLabel}
            </span>
          </div>
        </div>

        <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.5rem"}}>
          <div style={{background: "white", borderRadius: "12px", padding: "1.25rem 1rem", border: "1px solid #e5e7eb", textAlign: "center"}}>
            <p style={{fontSize: "1.75rem", fontWeight: "700", color: "#111827", margin: 0}}>
              {profile?.followers_count || 0}
            </p>
            <p style={{fontSize: "0.8rem", color: "#6b7280", margin: "0.25rem 0 0"}}>ผู้ติดตาม</p>
          </div>
          <div style={{background: "white", borderRadius: "12px", padding: "1.25rem 1rem", border: "1px solid #e5e7eb", textAlign: "center"}}>
            <p style={{fontSize: "1.75rem", fontWeight: "700", color: "#111827", margin: 0}}>
              {profile?.following_count || 0}
            </p>
            <p style={{fontSize: "0.8rem", color: "#6b7280", margin: "0.25rem 0 0"}}>กำลังติดตาม</p>
          </div>
          <div style={{background: "white", borderRadius: "12px", padding: "1.25rem 1rem", border: "1px solid #e5e7eb", textAlign: "center"}}>
            <p style={{fontSize: "1.75rem", fontWeight: "700", color: "#111827", margin: 0}}>
              {profile?.videos_count || 0}
            </p>
            <p style={{fontSize: "0.8rem", color: "#6b7280", margin: "0.25rem 0 0"}}>วิดีโอ</p>
          </div>
        </div>

        <div style={{background: "#fef3c7", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem", border: "2px solid #fcd34d"}}>
          <p style={{fontSize: "0.8rem", color: "#92400e", fontWeight: "600", margin: 0}}>
            BOOM PLUS POINTS
          </p>
          <p style={{fontSize: "2.5rem", fontWeight: "800", color: "#78350f", margin: "0.25rem 0"}}>
            {points?.balance?.toLocaleString() || 0}
          </p>
          <p style={{fontSize: "0.85rem", color: "#92400e", margin: 0}}>
            รวมสะสม: {points?.lifetime_earned?.toLocaleString() || 0} แต้ม
          </p>
        </div>

        <div style={{background: "white", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid #e5e7eb"}}>
          <h2 style={{fontSize: "1.125rem", fontWeight: "700", color: "#111827", marginBottom: "1rem"}}>
            ข้อมูลบัญชี
          </h2>
          <div>
            <div style={{display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #f3f4f6"}}>
              <span style={{color: "#6b7280", fontSize: "0.9rem"}}>อีเมล</span>
              <span style={{color: "#111827", fontSize: "0.9rem", fontWeight: "500"}}>{profile?.email}</span>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #f3f4f6"}}>
              <span style={{color: "#6b7280", fontSize: "0.9rem"}}>เบอร์โทร</span>
              <span style={{color: "#9ca3af", fontSize: "0.9rem"}}>{profile?.phone || "ยังไม่ระบุ"}</span>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #f3f4f6"}}>
              <span style={{color: "#6b7280", fontSize: "0.9rem"}}>ยืนยันอีเมล</span>
              <span style={{color: profile?.email_verified_at ? "#10b981" : "#ef4444", fontSize: "0.9rem", fontWeight: "600"}}>
                {profile?.email_verified_at ? "ยืนยันแล้ว" : "ยังไม่ยืนยัน"}
              </span>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", padding: "0.5rem 0"}}>
              <span style={{color: "#6b7280", fontSize: "0.9rem"}}>สมัครเมื่อ</span>
              <span style={{color: "#111827", fontSize: "0.9rem", fontWeight: "500"}}>{joinedDate}</span>
            </div>
          </div>
        </div>

        <div style={{background: "#dbeafe", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem", border: "2px solid #93c5fd"}}>
          <h3 style={{fontSize: "1rem", fontWeight: "700", color: "#1e3a8a", marginBottom: "0.75rem"}}>
            สิทธิพิเศษ Boom Plus
          </h3>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.85rem", color: "#1e40af"}}>
            <div>ค่าส่งราคาทุน</div>
            <div>ค่าธรรมเนียม 2%</div>
            <div>เลือกขนส่งได้</div>
            <div>รับที่สาขาได้</div>
            <div>COD ทั่วไทย</div>
            <div>เงินคืนเร็ว</div>
          </div>
        </div>

        <div style={{display: "flex", gap: "0.75rem", flexWrap: "wrap"}}>
          <Link href="/profile/edit" style={{flex: "1 1 200px", padding: "0.875rem 1.5rem", background: "#2563eb", color: "white", borderRadius: "10px", textAlign: "center", textDecoration: "none", fontWeight: "600"}}>
            แก้ไขโปรไฟล์
          </Link>
          <Link href="/settings" style={{flex: "1 1 200px", padding: "0.875rem 1.5rem", background: "white", color: "#374151", border: "2px solid #d1d5db", borderRadius: "10px", textAlign: "center", textDecoration: "none", fontWeight: "600"}}>
            ตั้งค่า
          </Link>
          <div style={{flex: "1 1 200px"}}>
            <LogoutButton />
          </div>
        </div>

        <p style={{textAlign: "center", fontSize: "0.8rem", color: "#9ca3af", marginTop: "2rem"}}>
          Boom Plus Marketplace © 2026
        </p>

      </div>
    </main>
  )
}