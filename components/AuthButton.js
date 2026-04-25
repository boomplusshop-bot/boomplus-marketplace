import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import LogoutButton from "./LogoutButton"

export default async function AuthButton() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div style={{display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap"}}>
        <Link href="/signup" style={{padding: "0.75rem 2rem", background: "#2563eb", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "500"}}>
          Sign Up
        </Link>
        <Link href="/login" style={{padding: "0.75rem 2rem", background: "white", color: "#2563eb", border: "2px solid #2563eb", borderRadius: "8px", textDecoration: "none", fontWeight: "500"}}>
          Login
        </Link>
        <Link href="/test" style={{padding: "0.75rem 2rem", background: "#f3f4f6", color: "#374151", borderRadius: "8px", textDecoration: "none", fontWeight: "500"}}>
          Test
        </Link>
      </div>
    )
  }

  const { data: profile } = await supabase
    .from("users")
    .select("username, full_name, role, avatar_url, email")
    .eq("auth_id", user.id)
    .maybeSingle()

  const displayName = profile?.full_name || profile?.username || user.email
  const usernameDisplay = profile?.username || "loading..."
  const roleDisplay = profile?.role || "customer"
  const initial = (profile?.full_name || profile?.username || user.email || "U").charAt(0).toUpperCase()
  const isShopOwner = profile?.role === "shop_owner"

  return (
    <div>
      <div style={{background: "#f0fdf4", border: "2px solid #bbf7d0", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1rem"}}>
        <div style={{width: "56px", height: "56px", borderRadius: "50%", background: "#10b981", color: "white", fontSize: "1.5rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0}}>
          {initial}
        </div>

        <div style={{flex: 1, textAlign: "left", minWidth: 0}}>
          <p style={{margin: 0, fontSize: "0.8rem", color: "#166534", fontWeight: "600"}}>
            เข้าสู่ระบบแล้ว
          </p>
          <p style={{margin: "0.25rem 0 0", fontSize: "1.05rem", color: "#111827", fontWeight: "700", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
            {displayName}
          </p>
          <p style={{margin: "0.125rem 0 0", fontSize: "0.8rem", color: "#059669", fontWeight: "500"}}>
            @{usernameDisplay} · {roleDisplay}
          </p>
        </div>
      </div>

      <div style={{display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "0.75rem"}}>
        <Link href="/profile" style={{padding: "0.75rem 2rem", background: "#2563eb", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "500"}}>
          My Profile
        </Link>

        {isShopOwner ? (
          <Link href="/shop/dashboard" style={{padding: "0.75rem 2rem", background: "linear-gradient(135deg, #10b981, #059669)", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "600", boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)"}}>
            🏪 ไปที่ร้านของฉัน
          </Link>
        ) : (
          <Link href="/shop/onboarding" style={{padding: "0.75rem 2rem", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "600", boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)"}}>
            🏪 เปิดร้านค้า
          </Link>
        )}

        <LogoutButton />
      </div>
    </div>
  )
}