import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function PublicShopPage({ params }) {
  const resolvedParams = await params
  const slug = resolvedParams.slug
  const supabase = await createClient()

  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (!shop) {
    notFound()
  }

  let category = null
  if (shop.category_id) {
    const { data: cat } = await supabase
      .from("shop_categories")
      .select("name, icon")
      .eq("id", shop.category_id)
      .maybeSingle()
    category = cat
  }

  let address = null
  if (shop.pickup_address_id) {
    const { data: addr } = await supabase
      .from("addresses")
      .select("district, province")
      .eq("id", shop.pickup_address_id)
      .maybeSingle()
    address = addr
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

  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price, original_price, thumbnail_url, stock, status, sold_count")
    .eq("shop_id", shop.id)
    .in("status", ["active", "out_of_stock"])
    .order("created_at", { ascending: false })

  const totalProducts = products?.length || 0

  const statusBadge = {
    active: { label: "เปิดให้บริการ", color: "#059669", bg: "#d1fae5" },
    pending: { label: "รอการยืนยัน", color: "#d97706", bg: "#fef3c7" },
    suspended: { label: "ระงับการให้บริการ", color: "#dc2626", bg: "#fee2e2" },
    inactive: { label: "ปิดร้านชั่วคราว", color: "#6b7280", bg: "#f3f4f6" }
  }
  const sBadge = statusBadge[shop.status] || statusBadge.pending

  return (
    <main style={{minHeight: "100vh", background: "#f9fafb"}}>
      <div style={{background: "linear-gradient(135deg, #2563eb, #7c3aed)", padding: "2rem 1rem", color: "white"}}>
        <div style={{maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem"}}>
          <Link href="/" style={{color: "white", textDecoration: "none", fontSize: "0.95rem", fontWeight: "500"}}>
            กลับหน้าแรก
          </Link>
          {isOwner && (
            <Link href="/shop/dashboard" style={{padding: "0.5rem 1rem", background: "rgba(255,255,255,0.2)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "0.875rem", fontWeight: "600"}}>
              จัดการร้าน
            </Link>
          )}
        </div>
      </div>

      <div style={{maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem"}}>
        <div style={{background: "white", borderRadius: "16px", padding: "2rem", border: "1px solid #e5e7eb", marginBottom: "1.5rem", marginTop: "-3rem"}}>
          <div style={{display: "flex", gap: "1.5rem", marginBottom: "1.5rem", flexWrap: "wrap"}}>
            <div style={{width: "100px", height: "100px", borderRadius: "16px", background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "white", fontSize: "3rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center"}}>
              {shop.name.charAt(0).toUpperCase()}
            </div>
            <div style={{flex: 1, minWidth: "200px"}}>
              <div style={{display: "inline-block", padding: "0.25rem 0.75rem", background: sBadge.bg, color: sBadge.color, borderRadius: "12px", fontSize: "0.75rem", fontWeight: "700", marginBottom: "0.5rem"}}>
                {sBadge.label}
              </div>
              <h1 style={{fontSize: "1.875rem", fontWeight: "700", color: "#111827", margin: 0, marginBottom: "0.25rem"}}>
                {shop.name}
              </h1>
              <p style={{color: "#6b7280", fontSize: "0.875rem", margin: 0, marginBottom: "0.5rem"}}>
                boomplus.shop/{shop.slug}
              </p>
              {category && (
                <p style={{color: "#374151", fontSize: "0.95rem", margin: 0, fontWeight: "500"}}>
                  {category.icon} {category.name}
                </p>
              )}
            </div>
          </div>

          {shop.description && (
            <p style={{color: "#374151", fontSize: "1rem", lineHeight: "1.6", marginBottom: "1.5rem"}}>
              {shop.description}
            </p>
          )}

          {address && (
            <p style={{color: "#6b7280", fontSize: "0.875rem", margin: 0}}>
              <strong>ที่ตั้ง:</strong> {address.district}, {address.province}
            </p>
          )}
        </div>

        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "1.5rem"}}>
          <div style={{background: "white", borderRadius: "12px", padding: "1.25rem", border: "1px solid #e5e7eb", textAlign: "center"}}>
            <p style={{fontSize: "0.75rem", color: "#6b7280", margin: 0, fontWeight: "600"}}>สินค้า</p>
            <p style={{fontSize: "1.75rem", fontWeight: "700", color: "#111827", margin: "0.5rem 0 0"}}>{totalProducts}</p>
          </div>
          <div style={{background: "white", borderRadius: "12px", padding: "1.25rem", border: "1px solid #e5e7eb", textAlign: "center"}}>
            <p style={{fontSize: "0.75rem", color: "#6b7280", margin: 0, fontWeight: "600"}}>ผู้ติดตาม</p>
            <p style={{fontSize: "1.75rem", fontWeight: "700", color: "#111827", margin: "0.5rem 0 0"}}>{shop.followers_count || 0}</p>
          </div>
          <div style={{background: "white", borderRadius: "12px", padding: "1.25rem", border: "1px solid #e5e7eb", textAlign: "center"}}>
            <p style={{fontSize: "0.75rem", color: "#6b7280", margin: 0, fontWeight: "600"}}>ออเดอร์</p>
            <p style={{fontSize: "1.75rem", fontWeight: "700", color: "#111827", margin: "0.5rem 0 0"}}>{shop.total_sales_count || 0}</p>
          </div>
          <div style={{background: "white", borderRadius: "12px", padding: "1.25rem", border: "1px solid #e5e7eb", textAlign: "center"}}>
            <p style={{fontSize: "0.75rem", color: "#6b7280", margin: 0, fontWeight: "600"}}>รีวิว</p>
            <p style={{fontSize: "1.75rem", fontWeight: "700", color: "#111827", margin: "0.5rem 0 0"}}>
              {shop.rating_count > 0 ? Number(shop.rating_average).toFixed(1) : "-"}
            </p>
          </div>
        </div>

        {totalProducts === 0 ? (
          <div style={{background: "white", borderRadius: "16px", padding: "3rem 2rem", border: "2px dashed #d1d5db", textAlign: "center"}}>
            <p style={{fontSize: "4rem", margin: 0, marginBottom: "0.75rem"}}>📦</p>
            <h2 style={{fontSize: "1.25rem", fontWeight: "700", color: "#111827", margin: 0, marginBottom: "0.5rem"}}>
              ยังไม่มีสินค้า
            </h2>
          </div>
        ) : (
          <div>
            <h2 style={{fontSize: "1.25rem", fontWeight: "700", color: "#111827", marginBottom: "1rem"}}>
              สินค้าทั้งหมด ({totalProducts})
            </h2>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem"}}>
              {products.map(product => {
                const hasDiscount = product.original_price && product.original_price > product.price
                const discount = hasDiscount ? Math.round((1 - product.price / product.original_price) * 100) : 0
                return (
                  <div key={product.id} style={{background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden"}}>
                    <div style={{aspectRatio: "1", background: "#f3f4f6", position: "relative"}}>
                      {product.thumbnail_url ? (
                        <img src={product.thumbnail_url} alt={product.name} style={{width: "100%", height: "100%", objectFit: "cover"}} />
                      ) : (
                        <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem"}}>📦</div>
                      )}
                      {hasDiscount && (
                        <div style={{position: "absolute", top: "0.5rem", left: "0.5rem", padding: "0.25rem 0.5rem", background: "#dc2626", color: "white", borderRadius: "8px", fontSize: "0.7rem", fontWeight: "700"}}>
                          -{discount}%
                        </div>
                      )}
                    </div>
                    <div style={{padding: "0.875rem"}}>
                      <h3 style={{fontSize: "0.875rem", fontWeight: "600", color: "#111827", margin: 0, marginBottom: "0.5rem"}}>
                        {product.name}
                      </h3>
                      <div style={{display: "flex", alignItems: "baseline", gap: "0.5rem"}}>
                        <p style={{fontSize: "1.125rem", fontWeight: "700", color: "#dc2626", margin: 0}}>
                          ฿{Number(product.price).toLocaleString()}
                        </p>
                        {hasDiscount && (
                          <p style={{fontSize: "0.8rem", color: "#9ca3af", margin: 0, textDecoration: "line-through"}}>
                            ฿{Number(product.original_price).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <p style={{fontSize: "0.75rem", color: "#6b7280", margin: "0.5rem 0 0"}}>
                        ขายแล้ว {product.sold_count || 0} ชิ้น
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
