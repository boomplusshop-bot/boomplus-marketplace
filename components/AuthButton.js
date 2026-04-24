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

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("username, full_name, role, avatar_url, email")
    .eq("auth_id", user.id)
    .maybeSingle()

  console.log("Profile query result:", { profile, profileError, authUserId: user.id })

  const displayName = profile?.full_name || profile?.username || user.email
  const usernameDisplay = profile?.username || "loading..."
  const roleDisplay = profile?.role || "customer"
  const initial = (profile?.full_name || profile?.username || user.email || "U").charAt(0).toUpperCase()

  return (
    <div>
      <div style={{background: "#f0fdf4", border: "2px solid #bbf7d0", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1rem"}}>
        
        <div style={{width: "56px", height: "56px", borderRadius: "50%", background: "#10b981", color: "white", fontSize: "1.5rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0}}>
          {initial}
        </div>

        <div style={{flex: 1, textAlign: "left", minWidth: 0}}>
          <p style={{margin: 0, fontSize: "0.8rem", color: "#166534", fontWeight: "600"}}>
            ✅ เข้าสู่ระบบแล้ว
          </p>
          <p style={{margin: "0.25rem 0 0", fontSize: "1.05rem", color: "#111827", fontWeight: "700", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
            {displayName}
          </p>
          <p style={{margin: "0.125rem 0 0", fontSize: "0.8rem", color: "#059669", fontWeight: "500"}}>
            @{usernameDisplay} · {roleDisplay}
          </p>
          {profile?.email && (
            <p style={{margin: "0.125rem 0 0", fontSize: "0.75rem", color: "#6b7280"}}>
              {profile.email}
            </p>
          )}
        </div>

      </div>

      <div style={{display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap"}}>
        <Link href="/profile" style={{padding: "0.75rem 2rem", background: "#2563eb", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "500"}}>
          My Profile
        </Link>
        <Link href="/test" style={{padding: "0.75rem 2rem", background: "#f3f4f6", color: "#374151", borderRadius: "8px", textDecoration: "none", fontWeight: "500"}}>
          Test
        </Link>
        <LogoutButton />
      </div>
    </div>
  )
}