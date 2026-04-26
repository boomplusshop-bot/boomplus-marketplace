import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function PublicShopPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: shop } = await supabase
    .from("shops")
    .select("*, shop_categories(name, name_en, icon), addresses!shops_pickup_address_id_fkey(district, province)")
    .eq("slug", slug)
    .maybeSingle()

  if (!shop) {
    notFound()
  }

  const { data: { user } } = await supabase.auth.getUser()
  let isOwner = false
  
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .maybeSingle()
    
    isOwner = profile?.id === shop.owner_id
  }

  const statusLabel = {
    pending: "รอการยืนยัน",
    active: "เปิดให้บริการ",
    suspended: "ระงับชั่วคราว",
    closed: "ปิดร้าน"
  }[shop.status] || shop.status

  const statusColor = {
    pending: "#f59e0b",
    active: "#10b981",
    suspended: "#ef4444",
    closed: "#6b7280"
  }[shop.status] || "#6b7280"

  const shopInitial = (shop.name || "?").charAt(0).toUpperCase()

  return (
    <main style={{minHeight: "100vh", background: "#f9fafb"}}>
      
      <div style={{background: "linear-gradient(135deg, #2563eb, #7c3aed)", height: "180px", position: "relative"}}>
        <div style={{maxWidth: "1100px", margin: "0 auto", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
          <Link href="/" style={{display: "inline-block", color: "white", textDecoration: "none", fontSize: "0.95rem", fontWeight: "500", background: "rgba(255,255,255,0.2)", padding: "0.5rem 1rem", borderRadius: "8px", backdropFilter: "blur(10px)"}}>
            กลับหน้าแรก
          </Link>
          {isOwner && (
            <Link href="/shop/dashboard" style={{display: "inline-block", color: "#2563eb", textDecoration: "none", fontSize: "0.85rem", fontWeight: "600", background: "white", padding: "0.5rem 1rem", borderRadius: "8px"}}>
              จัดการร้าน
            </Link>
          )}
        </div>
      </div>

      <div style={{maxWidth: "1100px", margin: "0 auto", padding: "0 1rem"}}>
        
        <div style={{background: "white", borderRadius: "16px", padding: "1.75rem", marginTop: "-60px", border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", position: "relative"}}>
          
          <div style={{display: "flex", gap: "1.25rem", flexWrap: "wrap", marginBottom: "1.25rem"}}>
            <div style={{width: "100px", height: "100px", borderRadius: "16px", background: "linear-gradient(135deg, #10b981, #059669)", color: "white", fontSize: "2.5rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"}}>
              {shopInitial}
            </div>
            
            <div style={{flex: 1, minWidth: "200px"}}>
              <div style={{display: "inline-block", padding: "0.25rem 0.75rem", background: statusColor + "20", color: statusColor, borderRadius: "12px", fontSize: "0.75rem", fontWeight: "600", marginBottom: "0.5rem"}}>
                {statusLabel}
              </div>
              <h1 style={{fontSize: "1.75rem", fontWeight: "700", color: "#111827", margin: 0, marginBottom: "0.5rem"}}>
                {shop.name}
              </h1>
              <p style={{color: "#6b7280", fontSize: "0.875rem", margin: 0, marginBottom: "0.25rem"}}>
                boomplus.shop/{shop.slug}
              </p>
              <p style={{color: "#374151", fontSize: "0.9rem", margin: 0}}>
                {shop.shop_categories?.icon} {shop.shop_categories?.name}
              </p>
            </div>

            <div style={{flexShrink: 0}}>
              {!isOwner && (
                <button disabled style={{padding: "0.75rem 1.5rem", background: "#2563eb", color: "white", border: "none", borderRadius: "10px", fontSize: "0.95rem", fontWeight: "600", cursor: "not-allowed", opacity: 0.7}}>
                  ติดตาม (Day 12)
                </button>
              )}
            </div>
          </div>

          {shop.description && (
            <div style={{padding: "1rem", background: "#f9fafb", borderRadius: "10px", marginBottom: "1rem"}}>
              <p style={{color: "#374151", fontSize: "0.95rem", margin: 0, lineHeight: "1.6", whiteSpace: "pre-wrap"}}>
                {shop.description}
              </p>
            </div>
          )}

          {shop.addresses && (
            <div style={{display: "flex", alignItems: "center", gap: "0.5rem", color: "#6b7280", fontSize: "0.875rem"}}>
              <span>ที่ตั้ง:</span>
              <span style={{color: "#374151", fontWeight: "500"}}>
                {shop.addresses.district}, {shop.addresses.province}
              </span>
            </div>
          )}

        </div>

        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginTop: "1.25rem"}}>
          
          <div style={{background: "white", borderRadius: "12px", padding: "1rem", border: "1px solid #e5e7eb", textAlign: "center"}}>
            <p style={{fontSize: "0.75rem", color: "#6b7280", margin: 0, fontWeight: "600", textTransform: "uppercase"}}>สินค้า</p>
            <p style={{fontSize: "1.5rem", fontWeight: "700", color: "#111827", margin: "0.25rem 0 0"}}>
              {shop.total_products || 0}
            </p>
          </div>

          <div style={{background: "white", borderRadius: "12px", padding: "1rem", border: "1px solid #e5e7eb", textAlign: "center"}}>
            <p style={{fontSize: "0.75rem", color: "#6b7280", margin: 0, fontWeight: "600", textTransform: "uppercase"}}>ผู้ติดตาม</p>
            <p style={{fontSize: "1.5rem", fontWeight: "700", color: "#111827", margin: "0.25rem 0 0"}}>
              {shop.followers_count || 0}
            </p>
          </div>

          <div style={{background: "white", borderRadius: "12px", padding: "1rem", border: "1px solid #e5e7eb", textAlign: "center"}}>
            <p style={{fontSize: "0.75rem", color: "#6b7280", margin: 0, fontWeight: "600", textTransform: "uppercase"}}>ออเดอร์</p>
            <p style={{fontSize: "1.5rem", fontWeight: "700", color: "#111827", margin: "0.25rem 0 0"}}>
              {shop.total_orders || 0}
            </p>
          </div>

          <div style={{background: "white", borderRadius: "12px", padding: "1rem", border: "1px solid #e5e7eb", textAlign: "center"}}>
            <p style={{fontSize: "0.75rem", color: "#6b7280", margin: 0, fontWeight: "600", textTransform: "uppercase"}}>รีวิว</p>
            <p style={{fontSize: "1.5rem", fontWeight: "700", color: "#111827", margin: "0.25rem 0 0"}}>
              {shop.rating_average ? Number(shop.rating_average).toFixed(1) : "-"}
            </p>
          </div>
        </div>

        <div style={{background: "white", borderRadius: "16px", padding: "2rem", marginTop: "1.25rem", border: "1px solid #e5e7eb", textAlign: "center"}}>
          <p style={{fontSize: "3rem", margin: 0, marginBottom: "0.5rem"}}>📦</p>
          <h2 style={{fontSize: "1.25rem", fontWeight: "700", color: "#374151", margin: 0, marginBottom: "0.5rem"}}>
            ยังไม่มีสินค้า
          </h2>
          <p style={{color: "#6b7280", fontSize: "0.95rem", margin: 0}}>
            ร้านค้านี้กำลังเตรียมสินค้า กลับมาดูใหม่เร็วๆ นี้!
          </p>
          {isOwner && (
            <button disabled style={{marginTop: "1rem", padding: "0.625rem 1.5rem", background: "#10b981", color: "white", border: "none", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "600", cursor: "not-allowed", opacity: 0.7}}>
              เพิ่มสินค้าแรก (Day 11)
            </button>
          )}
        </div>

        <div style={{textAlign: "center", padding: "2rem 0", color: "#9ca3af", fontSize: "0.85rem"}}>
          Boom Plus Marketplace 2026
        </div>

      </div>

    </main>
  )
}