import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function ShopDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/shop/dashboard")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, full_name, role")
    .eq("auth_id", user.id)
    .maybeSingle()

  const { data: shop } = await supabase
    .from("shops")
    .select("*, shop_categories(name, icon), addresses!shops_pickup_address_id_fkey(label, district, province)")
    .eq("owner_id", profile?.id)
    .maybeSingle()

  if (!shop) {
    redirect("/shop/onboarding")
  }

  const { data: wallet } = await supabase
    .from("shop_wallets")
    .select("balance, pending_balance, total_earnings")
    .eq("shop_id", shop.id)
    .maybeSingle()

  const statusLabel = {
    pending_verification: "รอการยืนยัน",
    active: "เปิดให้บริการ",
    suspended: "ระงับชั่วคราว",
    closed: "ปิดร้าน"
  }[shop.status] || shop.status

  const statusColor = {
    pending_verification: "#f59e0b",
    active: "#10b981",
    suspended: "#ef4444",
    closed: "#6b7280"
  }[shop.status] || "#6b7280"

  return (
    <main style={{minHeight: "100vh", background: "#f9fafb", padding: "2rem 1rem"}}>
      <div style={{maxWidth: "1100px", margin: "0 auto"}}>
        
        <Link href="/" style={{display: "inline-block", color: "#2563eb", textDecoration: "none", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
          ← กลับหน้าแรก
        </Link>

        <div style={{background: "white", borderRadius: "16px", padding: "2rem", marginBottom: "1.5rem", border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.04)"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem"}}>
            <div style={{flex: 1, minWidth: "250px"}}>
              <div style={{display: "inline-block", padding: "0.25rem 0.875rem", background: statusColor + "20", color: statusColor, borderRadius: "12px", fontSize: "0.75rem", fontWeight: "600", marginBottom: "0.75rem"}}>
                {statusLabel}
              </div>
              <h1 style={{fontSize: "2rem", fontWeight: "700", color: "#111827", margin: 0, marginBottom: "0.5rem"}}>
                🏪 {shop.name}
              </h1>
              <p style={{color: "#6b7280", fontSize: "0.95rem", margin: 0, marginBottom: "0.25rem"}}>
                boomplus.shop/{shop.slug}
              </p>
              <p style={{color: "#374151", fontSize: "0.9rem", margin: 0}}>
                {shop.shop_categories?.icon} {shop.shop_categories?.name}
              </p>
            </div>
            <div style={{textAlign: "right"}}>
              <p style={{fontSize: "0.75rem", color: "#6b7280", margin: 0, marginBottom: "0.25rem"}}>
                ค่าธรรมเนียม
              </p>
              <p style={{fontSize: "1.5rem", fontWeight: "700", color: "#10b981", margin: 0}}>
                {shop.commission_rate}%
              </p>
              <p style={{fontSize: "0.7rem", color: "#10b981", margin: 0}}>
                ✓ Boom Plus Member
              </p>
            </div>
          </div>
        </div>

        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem"}}>
          
          <div style={{background: "white", borderRadius: "12px", padding: "1.25rem", border: "1px solid #e5e7eb"}}>
            <p style={{fontSize: "0.8rem", color: "#6b7280", margin: 0, fontWeight: "600", textTransform: "uppercase"}}>📦 ออเดอร์ทั้งหมด</p>
            <p style={{fontSize: "2rem", fontWeight: "700", color: "#111827", margin: "0.5rem 0 0"}}>
              {shop.total_orders || 0}
            </p>
          </div>

          <div style={{background: "white", borderRadius: "12px", padding: "1.25rem", border: "1px solid #e5e7eb"}}>
            <p style={{fontSize: "0.8rem", color: "#6b7280", margin: 0, fontWeight: "600", textTransform: "uppercase"}}>💰 ยอดขาย</p>
            <p style={{fontSize: "2rem", fontWeight: "700", color: "#111827", margin: "0.5rem 0 0"}}>
              ฿{(shop.total_revenue || 0).toLocaleString()}
            </p>
          </div>

          <div style={{background: "white", borderRadius: "12px", padding: "1.25rem", border: "1px solid #e5e7eb"}}>
            <p style={{fontSize: "0.8rem", color: "#6b7280", margin: 0, fontWeight: "600", textTransform: "uppercase"}}>🛍️ สินค้า</p>
            <p style={{fontSize: "2rem", fontWeight: "700", color: "#111827", margin: "0.5rem 0 0"}}>
              {shop.total_products || 0}
            </p>
          </div>

          <div style={{background: "white", borderRadius: "12px", padding: "1.25rem", border: "1px solid #e5e7eb"}}>
            <p style={{fontSize: "0.8rem", color: "#6b7280", margin: 0, fontWeight: "600", textTransform: "uppercase"}}>👥 ผู้ติดตาม</p>
            <p style={{fontSize: "2rem", fontWeight: "700", color: "#111827", margin: "0.5rem 0 0"}}>
              {shop.followers_count || 0}
            </p>
          </div>
        </div>

        <div style={{background: "linear-gradient(135deg, #fef3c7, #fde68a)", borderRadius: "16px", padding: "1.75rem", marginBottom: "1.5rem", border: "2px solid #fcd34d"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem"}}>
            <div>
              <p style={{fontSize: "0.8rem", color: "#92400e", fontWeight: "700", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px"}}>
                💰 ยอดเงินในกระเป๋า
              </p>
              <p style={{fontSize: "2.5rem", fontWeight: "800", color: "#78350f", margin: "0.5rem 0"}}>
                ฿{(wallet?.balance || 0).toLocaleString()}
              </p>
              <div style={{display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#92400e"}}>
                <div>
                  <strong>รอเคลียร์:</strong> ฿{(wallet?.pending_balance || 0).toLocaleString()}
                </div>
                <div>
                  <strong>รวมรายได้:</strong> ฿{(wallet?.total_earnings || 0).toLocaleString()}
                </div>
              </div>
            </div>
            <button disabled style={{padding: "0.75rem 1.5rem", background: "white", color: "#92400e", border: "2px solid #fcd34d", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "600", cursor: "not-allowed", opacity: 0.7}}>
              ถอนเงิน (เร็วๆ นี้)
            </button>
          </div>
        </div>

        <h2 style={{fontSize: "1.25rem", fontWeight: "700", color: "#111827", marginBottom: "1rem"}}>
          ⚡ จัดการร้าน
        </h2>
        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem"}}>
          
          <div style={{background: "white", borderRadius: "12px", padding: "1.5rem", border: "2px dashed #d1d5db", opacity: 0.6}}>
            <p style={{fontSize: "1.5rem", margin: 0}}>🛍️</p>
            <p style={{fontSize: "1rem", fontWeight: "700", color: "#111827", margin: "0.5rem 0 0.25rem"}}>จัดการสินค้า</p>
            <p style={{fontSize: "0.8rem", color: "#9ca3af", margin: 0}}>เร็วๆ นี้ (Day 11)</p>
          </div>

          <div style={{background: "white", borderRadius: "12px", padding: "1.5rem", border: "2px dashed #d1d5db", opacity: 0.6}}>
            <p style={{fontSize: "1.5rem", margin: 0}}>📦</p>
            <p style={{fontSize: "1rem", fontWeight: "700", color: "#111827", margin: "0.5rem 0 0.25rem"}}>ออเดอร์</p>
            <p style={{fontSize: "0.8rem", color: "#9ca3af", margin: 0}}>เร็วๆ นี้</p>
          </div>

          <div style={{background: "white", borderRadius: "12px", padding: "1.5rem", border: "2px dashed #d1d5db", opacity: 0.6}}>
            <p style={{fontSize: "1.5rem", margin: 0}}>📊</p>
            <p style={{fontSize: "1rem", fontWeight: "700", color: "#111827", margin: "0.5rem 0 0.25rem"}}>สถิติ</p>
            <p style={{fontSize: "0.8rem", color: "#9ca3af", margin: 0}}>เร็วๆ นี้</p>
          </div>

          <div style={{background: "white", borderRadius: "12px", padding: "1.5rem", border: "2px dashed #d1d5db", opacity: 0.6}}>
            <p style={{fontSize: "1.5rem", margin: 0}}>⚙️</p>
            <p style={{fontSize: "1rem", fontWeight: "700", color: "#111827", margin: "0.5rem 0 0.25rem"}}>ตั้งค่าร้าน</p>
            <p style={{fontSize: "0.8rem", color: "#9ca3af", margin: 0}}>เร็วๆ นี้ (Day 8)</p>
          </div>
        </div>

        <div style={{background: "white", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid #e5e7eb"}}>
          <h2 style={{fontSize: "1.125rem", fontWeight: "700", color: "#111827", marginBottom: "1rem"}}>
            📋 ขั้นตอนถัดไป
          </h2>
          <div style={{display: "flex", flexDirection: "column", gap: "0.75rem"}}>
            <div style={{display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem", background: "#f0fdf4", borderRadius: "10px", border: "1px solid #bbf7d0"}}>
              <span style={{fontSize: "1.25rem"}}>✅</span>
              <div>
                <p style={{margin: 0, fontWeight: "600", color: "#166534"}}>เปิดร้านค้าสำเร็จ</p>
                <p style={{margin: 0, fontSize: "0.85rem", color: "#15803d"}}>คุณสร้างร้าน {shop.name} เรียบร้อยแล้ว</p>
              </div>
            </div>

            <div style={{display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem", background: "#fef3c7", borderRadius: "10px", border: "1px solid #fcd34d"}}>
              <span style={{fontSize: "1.25rem"}}>⏳</span>
              <div>
                <p style={{margin: 0, fontWeight: "600", color: "#78350f"}}>รอการยืนยันตัวตน</p>
                <p style={{margin: 0, fontSize: "0.85rem", color: "#92400e"}}>อัปโหลดเอกสารยืนยัน เร็วๆ นี้ (Day 9)</p>
              </div>
            </div>

            <div style={{display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem", background: "#f9fafb", borderRadius: "10px", border: "1px solid #e5e7eb", opacity: 0.6}}>
              <span style={{fontSize: "1.25rem"}}>🛍️</span>
              <div>
                <p style={{margin: 0, fontWeight: "600", color: "#374151"}}>เพิ่มสินค้าแรก</p>
                <p style={{margin: 0, fontSize: "0.85rem", color: "#6b7280"}}>เริ่มขายสินค้าได้ เร็วๆ นี้ (Day 11)</p>
              </div>
            </div>

            <div style={{display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem", background: "#f9fafb", borderRadius: "10px", border: "1px solid #e5e7eb", opacity: 0.6}}>
              <span style={{fontSize: "1.25rem"}}>🎬</span>
              <div>
                <p style={{margin: 0, fontWeight: "600", color: "#374151"}}>อัปโหลดวิดีโอแรก</p>
                <p style={{margin: 0, fontSize: "0.85rem", color: "#6b7280"}}>Video commerce เริ่ม Day 14+</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{background: "linear-gradient(135deg, #dbeafe, #bfdbfe)", borderRadius: "16px", padding: "1.5rem", border: "2px solid #93c5fd"}}>
          <h3 style={{fontSize: "1rem", fontWeight: "700", color: "#1e3a8a", margin: 0, marginBottom: "0.75rem"}}>
            🎁 สิทธิพิเศษ Boom Plus Member
          </h3>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.5rem", fontSize: "0.85rem", color: "#1e40af"}}>
            <div>✓ ค่าธรรมเนียม 2%</div>
            <div>✓ เลือกขนส่งเองได้</div>
            <div>✓ รับที่สาขา Boom Plus</div>
            <div>✓ COD ทั่วไทย</div>
            <div>✓ เงินคืนเร็ว (T+1)</div>
            <div>✓ Seller support 24/7</div>
          </div>
        </div>

        <p style={{textAlign: "center", fontSize: "0.8rem", color: "#9ca3af", marginTop: "2rem"}}>
          Boom Plus Marketplace © 2026
        </p>

      </div>
    </main>
  )
}