import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import ProductActions from "./ProductActions"

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/shop/products")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .maybeSingle()

  const { data: shop } = await supabase
    .from("shops")
    .select("id, name")
    .eq("owner_id", profile?.id)
    .maybeSingle()

  if (!shop) {
    redirect("/shop/onboarding")
  }

  const { data: products } = await supabase
    .from("products")
    .select("*, product_categories(name, icon)")
    .eq("shop_id", shop.id)
    .neq("status", "deleted")
    .order("created_at", { ascending: false })

  const totalProducts = products?.length || 0
  const activeProducts = products?.filter(p => p.status === "active").length || 0
  const draftProducts = products?.filter(p => p.status === "draft").length || 0

  const statusLabel = {
    draft: "แบบร่าง",
    active: "เปิดขาย",
    out_of_stock: "สินค้าหมด",
    hidden: "ซ่อนอยู่"
  }

  const statusColor = {
    draft: { bg: "#f3f4f6", text: "#6b7280" },
    active: { bg: "#d1fae5", text: "#059669" },
    out_of_stock: { bg: "#fef3c7", text: "#d97706" },
    hidden: { bg: "#fee2e2", text: "#dc2626" }
  }

  return (
    <main style={{minHeight: "100vh", background: "#f9fafb", padding: "2rem 1rem"}}>
      <div style={{maxWidth: "1100px", margin: "0 auto"}}>
        
        <Link href="/shop/dashboard" style={{display: "inline-block", color: "#2563eb", textDecoration: "none", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
          กลับแดชบอร์ด
        </Link>

        <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem"}}>
          <div>
            <h1 style={{fontSize: "1.875rem", fontWeight: "700", color: "#111827", margin: 0, marginBottom: "0.25rem"}}>
              สินค้าของฉัน
            </h1>
            <p style={{color: "#6b7280", fontSize: "0.95rem", margin: 0}}>
              {shop.name} · ทั้งหมด {totalProducts} รายการ
            </p>
          </div>
          <Link href="/shop/products/new" style={{padding: "0.875rem 1.5rem", background: "linear-gradient(135deg, #10b981, #059669)", color: "white", borderRadius: "10px", textDecoration: "none", fontWeight: "600", boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)"}}>
            + เพิ่มสินค้าใหม่
          </Link>
        </div>

        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem"}}>
          <div style={{background: "white", borderRadius: "12px", padding: "1.25rem", border: "1px solid #e5e7eb"}}>
            <p style={{fontSize: "0.75rem", color: "#6b7280", margin: 0, fontWeight: "600", textTransform: "uppercase"}}>สินค้าทั้งหมด</p>
            <p style={{fontSize: "2rem", fontWeight: "700", color: "#111827", margin: "0.5rem 0 0"}}>{totalProducts}</p>
          </div>
          <div style={{background: "white", borderRadius: "12px", padding: "1.25rem", border: "1px solid #e5e7eb"}}>
            <p style={{fontSize: "0.75rem", color: "#059669", margin: 0, fontWeight: "600", textTransform: "uppercase"}}>เปิดขาย</p>
            <p style={{fontSize: "2rem", fontWeight: "700", color: "#059669", margin: "0.5rem 0 0"}}>{activeProducts}</p>
          </div>
          <div style={{background: "white", borderRadius: "12px", padding: "1.25rem", border: "1px solid #e5e7eb"}}>
            <p style={{fontSize: "0.75rem", color: "#6b7280", margin: 0, fontWeight: "600", textTransform: "uppercase"}}>แบบร่าง</p>
            <p style={{fontSize: "2rem", fontWeight: "700", color: "#6b7280", margin: "0.5rem 0 0"}}>{draftProducts}</p>
          </div>
        </div>

        {totalProducts === 0 ? (
          <div style={{background: "white", borderRadius: "16px", padding: "3rem 2rem", border: "2px dashed #d1d5db", textAlign: "center"}}>
            <p style={{fontSize: "4rem", margin: 0, marginBottom: "0.75rem"}}>📦</p>
            <h2 style={{fontSize: "1.25rem", fontWeight: "700", color: "#111827", margin: 0, marginBottom: "0.5rem"}}>
              ยังไม่มีสินค้า
            </h2>
            <p style={{color: "#6b7280", fontSize: "0.95rem", margin: 0, marginBottom: "1.5rem"}}>
              เริ่มต้นด้วยการเพิ่มสินค้าแรกของคุณ
            </p>
            <Link href="/shop/products/new" style={{display: "inline-block", padding: "0.875rem 2rem", background: "linear-gradient(135deg, #10b981, #059669)", color: "white", borderRadius: "10px", textDecoration: "none", fontWeight: "600"}}>
              + เพิ่มสินค้าแรก
            </Link>
          </div>
        ) : (
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem"}}>
            {products.map(product => {
              const sColor = statusColor[product.status] || statusColor.draft
              return (
                <div key={product.id} style={{background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden", display: "flex", flexDirection: "column"}}>
                  <div style={{aspectRatio: "1", background: "#f3f4f6", position: "relative", overflow: "hidden"}}>
                    {product.thumbnail_url ? (
                      <img src={product.thumbnail_url} alt={product.name} style={{width: "100%", height: "100%", objectFit: "cover"}} />
                    ) : (
                      <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", color: "#d1d5db"}}>📦</div>
                    )}
                    <div style={{position: "absolute", top: "0.5rem", right: "0.5rem", padding: "0.25rem 0.625rem", background: sColor.bg, color: sColor.text, borderRadius: "12px", fontSize: "0.7rem", fontWeight: "700"}}>
                      {statusLabel[product.status] || product.status}
                    </div>
                  </div>
                  
                  <div style={{padding: "1rem", flex: 1, display: "flex", flexDirection: "column"}}>
                    <p style={{fontSize: "0.75rem", color: "#6b7280", margin: 0, marginBottom: "0.25rem"}}>
                      {product.product_categories?.icon} {product.product_categories?.name}
                    </p>
                    <h3 style={{fontSize: "0.95rem", fontWeight: "700", color: "#111827", margin: 0, marginBottom: "0.5rem", lineHeight: "1.4", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical"}}>
                      {product.name}
                    </h3>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem"}}>
                      <p style={{fontSize: "1.125rem", fontWeight: "700", color: "#dc2626", margin: 0}}>
                        ฿{Number(product.price).toLocaleString()}
                      </p>
                      <p style={{fontSize: "0.8rem", color: "#6b7280", margin: 0}}>
                        คงเหลือ {product.stock}
                      </p>
                    </div>
                    
                    <div style={{display: "flex", gap: "0.5rem", marginTop: "auto"}}>
                      <Link href={"/shop/products/" + product.id + "/edit"} style={{flex: 1, padding: "0.5rem", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: "8px", textDecoration: "none", textAlign: "center", fontSize: "0.85rem", fontWeight: "600"}}>
                        แก้ไข
                      </Link>
                      <ProductActions productId={product.id} productName={product.name} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <p style={{textAlign: "center", fontSize: "0.8rem", color: "#9ca3af", marginTop: "2rem"}}>
          Boom Plus Marketplace 2026
        </p>
      </div>
    </main>
  )
}