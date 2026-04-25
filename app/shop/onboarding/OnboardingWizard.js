"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createShop, checkSlugAvailable } from "@/lib/supabase/shop-actions"

export default function OnboardingWizard({ categories, addresses }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [slugStatus, setSlugStatus] = useState("")

  const [data, setData] = useState({
    name: "",
    slug: "",
    phone: "",
    categoryId: "",
    description: "",
    pickupAddressId: addresses?.find(a => a.is_default)?.id || addresses?.[0]?.id || ""
  })

  function updateField(field, value) {
    setData({ ...data, [field]: value })
    setError("")
  }

  function handleSlugChange(value) {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, "").substring(0, 50)
    updateField("slug", cleaned)
    setSlugStatus("")
  }

  async function checkSlug() {
    if (!data.slug || data.slug.length < 3) return
    setSlugStatus("checking")
    const result = await checkSlugAvailable(data.slug)
    setSlugStatus(result.available ? "available" : "taken")
  }

  function nextStep() {
    setError("")
    if (step === 1) {
      if (!data.name || data.name.length < 2) return setError("กรุณากรอกชื่อร้านอย่างน้อย 2 ตัวอักษร")
      if (!data.slug || data.slug.length < 3) return setError("กรุณากรอก Slug อย่างน้อย 3 ตัวอักษร")
      if (slugStatus === "taken") return setError("Slug นี้ถูกใช้แล้ว")
      if (!data.phone || !/^[0-9]{9,10}$/.test(data.phone.replace(/[-\s]/g, ""))) return setError("เบอร์โทรไม่ถูกต้อง")
    }
    if (step === 2) {
      if (!data.categoryId) return setError("กรุณาเลือกหมวดหมู่")
      if (!data.description || data.description.length < 10) return setError("กรุณากรอกคำอธิบายอย่างน้อย 10 ตัวอักษร")
    }
    setStep(step + 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function prevStep() {
    setError("")
    setStep(step - 1)
  }

  async function handleSubmit() {
    if (!data.pickupAddressId) return setError("กรุณาเลือกที่อยู่ pickup")
    setIsLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("slug", data.slug)
    formData.append("phone", data.phone)
    formData.append("categoryId", data.categoryId)
    formData.append("description", data.description)
    formData.append("pickupAddressId", data.pickupAddressId)

    const result = await createShop(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.success) {
      setSuccess(result.message)
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
    <main style={{minHeight: "100vh", background: "linear-gradient(135deg, #eff6ff, #ffffff)", padding: "2rem 1rem"}}>
      <div style={{maxWidth: "700px", margin: "0 auto"}}>
        <Link href="/profile" style={{display: "inline-block", color: "#2563eb", textDecoration: "none", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>← กลับโปรไฟล์</Link>

        <div style={{background: "white", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid #e5e7eb"}}>
          <h1 style={{fontSize: "1.5rem", fontWeight: "700", color: "#111827", margin: 0, marginBottom: "0.5rem"}}>🏪 เปิดร้านค้าบน Boom Plus</h1>
          <p style={{color: "#6b7280", fontSize: "0.9rem", margin: 0, marginBottom: "1.5rem"}}>ขั้นที่ {step}/3 — {step === 1 ? "ข้อมูลพื้นฐาน" : step === 2 ? "หมวดหมู่และคำอธิบาย" : "ที่อยู่ pickup และยืนยัน"}</p>
          <div style={{display: "flex", gap: "0.5rem"}}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{flex: 1, height: "8px", background: n <= step ? "#2563eb" : "#e5e7eb", borderRadius: "4px"}} />
            ))}
          </div>
        </div>

        <div style={{background: "white", borderRadius: "16px", padding: "2rem", border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.06)"}}>

          {error && <div style={{background: "#fef2f2", border: "2px solid #fecaca", color: "#991b1b", padding: "0.875rem 1rem", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>⚠️ {error}</div>}
          {success && <div style={{background: "#f0fdf4", border: "2px solid #bbf7d0", color: "#166534", padding: "0.875rem 1rem", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>✅ {success}</div>}

          {step === 1 && (
            <div>
              <h2 style={{fontSize: "1.25rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem"}}>ข้อมูลพื้นฐานของร้าน</h2>
              <p style={{color: "#6b7280", fontSize: "0.9rem", marginBottom: "1.5rem"}}>ตั้งชื่อร้านและสร้าง URL ของร้านคุณ</p>

              <div style={{marginBottom: "1.5rem"}}>
                <label style={labelStyle}>ชื่อร้าน <span style={{color: "#ef4444"}}>*</span></label>
                <input type="text" value={data.name} onChange={(e) => updateField("name", e.target.value)} placeholder="เช่น Boom Plus Shop" maxLength={100} disabled={isLoading} style={inputStyle} />
                <p style={helpStyle}>ชื่อร้านที่ลูกค้าจะเห็น</p>
              </div>

              <div style={{marginBottom: "1.5rem"}}>
                <label style={labelStyle}>Slug (URL ร้าน) <span style={{color: "#ef4444"}}>*</span></label>
                <div style={{display: "flex", alignItems: "stretch", gap: "0.5rem"}}>
                  <span style={{display: "flex", alignItems: "center", padding: "0 1rem", background: "#f3f4f6", border: "2px solid #d1d5db", borderRight: "none", borderRadius: "10px 0 0 10px", color: "#6b7280", fontSize: "0.9rem"}}>boomplus.shop/</span>
                  <input type="text" value={data.slug} onChange={(e) => handleSlugChange(e.target.value)} onBlur={checkSlug} placeholder="boom-plus-shop" maxLength={50} disabled={isLoading} style={{...inputStyle, borderRadius: "0 10px 10px 0", borderLeft: "none"}} />
                </div>
                {slugStatus === "checking" && <p style={{...helpStyle, color: "#3b82f6"}}>กำลังเช็ค...</p>}
                {slugStatus === "available" && <p style={{...helpStyle, color: "#10b981", fontWeight: "600"}}>✓ Slug นี้ใช้ได้</p>}
                {slugStatus === "taken" && <p style={{...helpStyle, color: "#ef4444", fontWeight: "600"}}>✗ Slug นี้ถูกใช้แล้ว</p>}
                {!slugStatus && <p style={helpStyle}>ใช้ได้เฉพาะ a-z, 0-9, -</p>}
              </div>

              <div>
                <label style={labelStyle}>เบอร์โทรร้าน <span style={{color: "#ef4444"}}>*</span></label>
                <input type="tel" value={data.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="0812345678" maxLength={15} disabled={isLoading} style={inputStyle} />
                <p style={helpStyle}>สำหรับติดต่อร้าน</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{fontSize: "1.25rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem"}}>หมวดหมู่และคำอธิบาย</h2>
              <p style={{color: "#6b7280", fontSize: "0.9rem", marginBottom: "1.5rem"}}>บอกลูกค้าว่าร้านคุณขายอะไร</p>

              <div style={{marginBottom: "1.5rem"}}>
                <label style={labelStyle}>หมวดหมู่ร้าน <span style={{color: "#ef4444"}}>*</span></label>
                <div style={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem"}}>
                  {categories?.map((cat) => (
                    <button key={cat.id} type="button" onClick={() => updateField("categoryId", cat.id)} disabled={isLoading} style={{padding: "0.875rem 1rem", background: data.categoryId === cat.id ? "#2563eb" : "white", color: data.categoryId === cat.id ? "white" : "#374151", border: data.categoryId === cat.id ? "2px solid #2563eb" : "2px solid #e5e7eb", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer", textAlign: "left"}}>
                      {cat.icon || "📦"} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>คำอธิบายร้าน <span style={{color: "#ef4444"}}>*</span></label>
                <textarea value={data.description} onChange={(e) => updateField("description", e.target.value)} placeholder="แนะนำร้านของคุณสั้น ๆ..." rows={5} maxLength={500} disabled={isLoading} style={{...inputStyle, resize: "vertical", minHeight: "120px"}} />
                <p style={helpStyle}>{data.description.length}/500 ตัวอักษร</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{fontSize: "1.25rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem"}}>ที่อยู่ Pickup และยืนยัน</h2>
              <p style={{color: "#6b7280", fontSize: "0.9rem", marginBottom: "1.5rem"}}>เลือกที่อยู่สำหรับให้ขนส่งมารับสินค้า</p>

              <div style={{marginBottom: "1.5rem"}}>
                <label style={labelStyle}>ที่อยู่ Pickup <span style={{color: "#ef4444"}}>*</span></label>
                {addresses && addresses.length > 0 ? (
                  <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                    {addresses.map((addr) => (
                      <button key={addr.id} type="button" onClick={() => updateField("pickupAddressId", addr.id)} disabled={isLoading} style={{padding: "1rem", background: data.pickupAddressId === addr.id ? "#eff6ff" : "white", border: data.pickupAddressId === addr.id ? "2px solid #2563eb" : "2px solid #e5e7eb", borderRadius: "10px", cursor: "pointer", textAlign: "left"}}>
                        <div style={{display: "flex", justifyContent: "space-between", marginBottom: "0.5rem"}}>
                          <span style={{fontSize: "0.95rem", fontWeight: "700", color: "#111827"}}>{addr.label || "ที่อยู่"} {addr.is_default && "⭐"}</span>
                          {data.pickupAddressId === addr.id && <span style={{color: "#2563eb", fontSize: "1.25rem"}}>✓</span>}
                        </div>
                        <p style={{fontSize: "0.85rem", color: "#374151", margin: 0, marginBottom: "0.25rem"}}>{addr.recipient_name} • {addr.recipient_phone}</p>
                        <p style={{fontSize: "0.8rem", color: "#6b7280", margin: 0, lineHeight: "1.5"}}>{addr.address_line}<br/>{addr.subdistrict} • {addr.district} • {addr.province} {addr.postal_code}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{padding: "1.5rem", background: "#fef2f2", borderRadius: "10px", textAlign: "center"}}>
                    <p style={{color: "#991b1b", fontSize: "0.9rem", margin: 0, marginBottom: "1rem"}}>⚠️ คุณยังไม่มีที่อยู่ในระบบ</p>
                    <Link href="/addresses/new" style={{display: "inline-block", padding: "0.625rem 1.25rem", background: "#2563eb", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "0.875rem", fontWeight: "600"}}>+ เพิ่มที่อยู่ก่อน</Link>
                  </div>
                )}
              </div>

              <div style={{padding: "1.25rem", background: "#fef3c7", borderRadius: "12px", marginBottom: "1rem"}}>
                <h3 style={{fontSize: "0.95rem", fontWeight: "700", color: "#78350f", margin: "0 0 0.75rem"}}>📋 สรุปข้อมูลร้าน</h3>
                <div style={{fontSize: "0.85rem", color: "#92400e", lineHeight: "1.8"}}>
                  <div><strong>ชื่อร้าน:</strong> {data.name}</div>
                  <div><strong>URL:</strong> boomplus.shop/{data.slug}</div>
                  <div><strong>เบอร์:</strong> {data.phone}</div>
                  <div><strong>หมวดหมู่:</strong> {categories?.find(c => c.id === data.categoryId)?.name || "-"}</div>
                  <div><strong>คำอธิบาย:</strong> {data.description.substring(0, 80)}{data.description.length > 80 ? "..." : ""}</div>
                </div>
              </div>

              <div style={{padding: "1rem", background: "#dbeafe", borderRadius: "10px", marginBottom: "1rem", fontSize: "0.85rem", color: "#1e40af", lineHeight: "1.7"}}>
                ✨ สิทธิพิเศษ Boom Plus:<br/>
                ✓ ค่าธรรมเนียม 2% • ✓ เลือกขนส่งได้<br/>
                ✓ รับที่สาขาได้ • ✓ COD ทั่วไทย
              </div>
            </div>
          )}

          <div style={{display: "flex", gap: "0.75rem", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #f3f4f6"}}>
            {step > 1 && (
              <button type="button" onClick={prevStep} disabled={isLoading} style={{flex: 1, padding: "0.875rem", background: "white", color: "#374151", border: "2px solid #d1d5db", borderRadius: "10px", fontSize: "1rem", fontWeight: "600", cursor: "pointer"}}>← ย้อนกลับ</button>
            )}
            {step < 3 ? (
              <button type="button" onClick={nextStep} disabled={isLoading} style={{flex: 2, padding: "0.875rem", background: "#2563eb", color: "white", border: "none", borderRadius: "10px", fontSize: "1rem", fontWeight: "600", cursor: "pointer"}}>ถัดไป →</button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={isLoading || !data.pickupAddressId || success} style={{flex: 2, padding: "0.875rem", background: (isLoading || success) ? "#93c5fd" : "#10b981", color: "white", border: "none", borderRadius: "10px", fontSize: "1rem", fontWeight: "700", cursor: (isLoading || success) ? "not-allowed" : "pointer"}}>
                {isLoading ? "กำลังเปิดร้าน..." : success ? "สำเร็จ!" : "🏪 เปิดร้านค้า!"}
              </button>
            )}
          </div>
        </div>

        <p style={{textAlign: "center", fontSize: "0.8rem", color: "#9ca3af", marginTop: "1.5rem"}}>Boom Plus Marketplace © 2026</p>
      </div>
    </main>
  )
}