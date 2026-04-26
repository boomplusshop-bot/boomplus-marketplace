"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { updateShop } from "@/lib/supabase/shop-actions"
import StatusToggle from "./StatusToggle"

export default function EditShopForm({ shop, categories, addresses }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [data, setData] = useState({
    name: shop.name || "",
    description: shop.description || "",
    categoryId: shop.category_id || "",
    phone: shop.contact_phone || "",
    pickupAddressId: shop.pickup_address_id || ""
  })

  function updateField(field, value) {
    setData({ ...data, [field]: value })
    setError("")
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("categoryId", data.categoryId)
    formData.append("phone", data.phone)
    formData.append("pickupAddressId", data.pickupAddressId)

    const result = await updateShop(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.success) {
      setSuccess(result.message)
      setIsLoading(false)
      setTimeout(() => {
        router.push("/shop/dashboard")
        router.refresh()
      }, 1500)
    }
  }

  const inputStyle = {width: "100%", padding: "0.875rem 1rem", border: "2px solid #d1d5db", borderRadius: "10px", fontSize: "1rem", outline: "none", color: "#111827", background: "#ffffff", fontWeight: "500"}
  const labelStyle = {display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#1f2937", marginBottom: "0.5rem"}
  const helpStyle = {fontSize: "0.8rem", color: "#6b7280", marginTop: "0.375rem"}

  return (
    <main style={{minHeight: "100vh", background: "#f9fafb", padding: "2rem 1rem"}}>
      <div style={{maxWidth: "700px", margin: "0 auto"}}>
        
        <Link href="/shop/dashboard" style={{display: "inline-block", color: "#2563eb", textDecoration: "none", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
          กลับแดชบอร์ด
        </Link>

        <div style={{background: "white", borderRadius: "16px", padding: "2rem", border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.06)"}}>
          
          <h1 style={{fontSize: "1.75rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem"}}>
            ตั้งค่าร้านค้า
          </h1>
          <p style={{color: "#6b7280", fontSize: "0.95rem", marginBottom: "0.5rem"}}>
            แก้ไขข้อมูลร้านของคุณ
          </p>
          <div style={{padding: "0.625rem 1rem", background: "#f3f4f6", borderRadius: "8px", marginBottom: "2rem", fontSize: "0.85rem", color: "#4b5563"}}>
            URL ร้าน: <strong>boomplus.shop/{shop.slug}</strong> (เปลี่ยนไม่ได้)
          </div>

          <div style={{marginBottom: "2rem"}}>
            <h2 style={{fontSize: "1.125rem", fontWeight: "700", color: "#111827", marginBottom: "0.75rem"}}>สถานะร้าน</h2>
            <StatusToggle currentStatus={shop.status} />
          </div>

          <h2 style={{fontSize: "1.125rem", fontWeight: "700", color: "#111827", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #f3f4f6"}}>ข้อมูลร้าน</h2>

          {error && (
            <div style={{background: "#fef2f2", border: "2px solid #fecaca", color: "#991b1b", padding: "0.875rem 1rem", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
              {error}
            </div>
          )}

          {success && (
            <div style={{background: "#f0fdf4", border: "2px solid #bbf7d0", color: "#166534", padding: "0.875rem 1rem", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div style={{marginBottom: "1.5rem"}}>
              <label style={labelStyle}>ชื่อร้าน *</label>
              <input type="text" value={data.name} onChange={(e) => updateField("name", e.target.value)} maxLength={100} required disabled={isLoading} style={inputStyle} />
              <p style={helpStyle}>ชื่อร้านที่ลูกค้าจะเห็น</p>
            </div>

            <div style={{marginBottom: "1.5rem"}}>
              <label style={labelStyle}>เบอร์โทรร้าน *</label>
              <input type="tel" value={data.phone} onChange={(e) => updateField("phone", e.target.value)} maxLength={15} required disabled={isLoading} style={inputStyle} />
              <p style={helpStyle}>สำหรับติดต่อร้าน</p>
            </div>

            <div style={{marginBottom: "1.5rem"}}>
              <label style={labelStyle}>หมวดหมู่ร้าน *</label>
              <div style={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem"}}>
                {categories?.map((cat) => (
                  <button key={cat.id} type="button" onClick={() => updateField("categoryId", cat.id)} disabled={isLoading} style={{padding: "0.875rem 1rem", background: data.categoryId === cat.id ? "#2563eb" : "white", color: data.categoryId === cat.id ? "white" : "#374151", border: data.categoryId === cat.id ? "2px solid #2563eb" : "2px solid #e5e7eb", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer", textAlign: "left"}}>
                    {cat.icon || ""} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{marginBottom: "1.5rem"}}>
              <label style={labelStyle}>คำอธิบายร้าน *</label>
              <textarea value={data.description} onChange={(e) => updateField("description", e.target.value)} rows={5} maxLength={500} required disabled={isLoading} style={{...inputStyle, resize: "vertical", minHeight: "120px"}} />
              <p style={helpStyle}>{data.description.length}/500 ตัวอักษร</p>
            </div>

            <div style={{marginBottom: "1.5rem"}}>
              <label style={labelStyle}>ที่อยู่ Pickup *</label>
              {addresses && addresses.length > 0 ? (
                <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                  {addresses.map((addr) => (
                    <button key={addr.id} type="button" onClick={() => updateField("pickupAddressId", addr.id)} disabled={isLoading} style={{padding: "1rem", background: data.pickupAddressId === addr.id ? "#eff6ff" : "white", border: data.pickupAddressId === addr.id ? "2px solid #2563eb" : "2px solid #e5e7eb", borderRadius: "10px", cursor: "pointer", textAlign: "left"}}>
                      <div style={{display: "flex", justifyContent: "space-between", marginBottom: "0.5rem"}}>
                        <span style={{fontSize: "0.95rem", fontWeight: "700", color: "#111827"}}>{addr.label || "ที่อยู่"} {addr.is_default && "(หลัก)"}</span>
                        {data.pickupAddressId === addr.id && <span style={{color: "#2563eb", fontSize: "1.25rem"}}>OK</span>}
                      </div>
                      <p style={{fontSize: "0.85rem", color: "#374151", margin: 0, marginBottom: "0.25rem"}}>{addr.recipient_name} - {addr.recipient_phone}</p>
                      <p style={{fontSize: "0.8rem", color: "#6b7280", margin: 0, lineHeight: "1.5"}}>{addr.address_line}<br/>{addr.subdistrict}, {addr.district}, {addr.province} {addr.postal_code}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{padding: "1.5rem", background: "#fef2f2", borderRadius: "10px", textAlign: "center"}}>
                  <p style={{color: "#991b1b", fontSize: "0.9rem", margin: 0, marginBottom: "1rem"}}>คุณยังไม่มีที่อยู่ในระบบ</p>
                  <Link href="/addresses/new" style={{display: "inline-block", padding: "0.625rem 1.25rem", background: "#2563eb", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "0.875rem", fontWeight: "600"}}>เพิ่มที่อยู่ก่อน</Link>
                </div>
              )}
            </div>

            <div style={{display: "flex", gap: "0.75rem"}}>
              <Link href="/shop/dashboard" style={{flex: 1, padding: "0.875rem", background: "white", color: "#374151", border: "2px solid #d1d5db", borderRadius: "10px", textAlign: "center", textDecoration: "none", fontWeight: "600", fontSize: "1rem"}}>
                ยกเลิก
              </Link>
              <button type="submit" disabled={isLoading} style={{flex: 2, padding: "0.875rem", background: isLoading ? "#93c5fd" : "#2563eb", color: "white", border: "none", borderRadius: "10px", fontSize: "1rem", fontWeight: "600", cursor: isLoading ? "not-allowed" : "pointer", boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)"}}>
                {isLoading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
              </button>
            </div>

          </form>
        </div>

        <p style={{textAlign: "center", fontSize: "0.8rem", color: "#9ca3af", marginTop: "1.5rem"}}>
          Boom Plus Marketplace 2026
        </p>

      </div>
    </main>
  )
}