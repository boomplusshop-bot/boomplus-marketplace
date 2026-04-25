import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import AddressActions from "./AddressActions"

export default async function AddressesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/addresses")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .maybeSingle()

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", profile?.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })

  return (
    <main style={{minHeight: "100vh", background: "#f9fafb", padding: "2rem 1rem"}}>
      <div style={{maxWidth: "800px", margin: "0 auto"}}>
        
        <Link href="/profile" style={{display: "inline-block", color: "#2563eb", textDecoration: "none", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
          ← กลับโปรไฟล์
        </Link>

        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem"}}>
          <div>
            <h1 style={{fontSize: "2rem", fontWeight: "700", color: "#111827", margin: 0}}>
              ที่อยู่จัดส่ง
            </h1>
            <p style={{color: "#6b7280", fontSize: "0.95rem", margin: "0.25rem 0 0"}}>
              จัดการที่อยู่สำหรับการจัดส่งสินค้า
            </p>
          </div>

          <Link
            href="/addresses/new"
            style={{padding: "0.75rem 1.5rem", background: "#2563eb", color: "white", borderRadius: "10px", textDecoration: "none", fontWeight: "600", fontSize: "0.95rem", boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)"}}
          >
            + เพิ่มที่อยู่ใหม่
          </Link>
        </div>

        {!addresses || addresses.length === 0 ? (
          <div style={{background: "white", borderRadius: "16px", padding: "3rem 2rem", textAlign: "center", border: "2px dashed #d1d5db"}}>
            <div style={{fontSize: "4rem", marginBottom: "1rem"}}>📍</div>
            <h2 style={{fontSize: "1.25rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem"}}>
              ยังไม่มีที่อยู่
            </h2>
            <p style={{color: "#6b7280", fontSize: "0.95rem", marginBottom: "1.5rem"}}>
              เพิ่มที่อยู่จัดส่งของคุณเพื่อเริ่มสั่งซื้อสินค้า
            </p>
            <Link
              href="/addresses/new"
              style={{display: "inline-block", padding: "0.875rem 2rem", background: "#2563eb", color: "white", borderRadius: "10px", textDecoration: "none", fontWeight: "600"}}
            >
              เพิ่มที่อยู่แรกของคุณ
            </Link>
          </div>
        ) : (
          <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
            {addresses.map((address) => (
              <div
                key={address.id}
                style={{background: "white", borderRadius: "16px", padding: "1.5rem", border: address.is_default ? "2px solid #2563eb" : "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", position: "relative"}}
              >
                
                <div style={{display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap"}}>
                  {address.is_default && (
                    <span style={{background: "#2563eb", color: "white", padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "600"}}>
                      ⭐ ที่อยู่หลัก
                    </span>
                  )}
                  {address.label && (
                    <span style={{background: "#f3f4f6", color: "#374151", padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "500"}}>
                      🏷️ {address.label}
                    </span>
                  )}
                  {address.is_pickup_address && (
                    <span style={{background: "#fef3c7", color: "#92400e", padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "600"}}>
                      📦 ที่อยู่ pickup
                    </span>
                  )}
                </div>

                <div style={{marginBottom: "1rem"}}>
                  <p style={{margin: 0, fontSize: "1.05rem", fontWeight: "700", color: "#111827"}}>
                    {address.recipient_name}
                  </p>
                  <p style={{margin: "0.125rem 0 0", fontSize: "0.875rem", color: "#6b7280"}}>
                    📞 {address.recipient_phone}
                  </p>
                </div>

                <div style={{padding: "0.875rem 1rem", background: "#f9fafb", borderRadius: "8px", marginBottom: "1rem"}}>
                  <p style={{margin: 0, fontSize: "0.9rem", color: "#374151", lineHeight: "1.5"}}>
                    {address.address_line}
                  </p>
                  <p style={{margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#6b7280"}}>
                    {address.subdistrict} • {address.district} • {address.province} {address.postal_code}
                  </p>
                </div>

                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem"}}>
                  <Link
                    href={`/addresses/${address.id}/edit`}
                    style={{padding: "0.5rem 0.875rem", background: "white", color: "#374151", border: "1.5px solid #d1d5db", borderRadius: "8px", textDecoration: "none", fontSize: "0.8rem", fontWeight: "600"}}
                  >
                    ✏️ แก้ไข
                  </Link>

                  <AddressActions addressId={address.id} isDefault={address.is_default} />
                </div>

              </div>
            ))}
          </div>
        )}

        <p style={{textAlign: "center", fontSize: "0.8rem", color: "#9ca3af", marginTop: "2rem"}}>
          Boom Plus Marketplace © 2026
        </p>

      </div>
    </main>
  )
}