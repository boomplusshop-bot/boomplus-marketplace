"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createAddress, updateAddress } from "@/lib/supabase/address-actions"

export default function AddressForm({ initialData = null, addressId = null }) {
  const router = useRouter()
  const isEdit = !!addressId
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(formData) {
    setIsLoading(true)
    setError("")
    setSuccess("")

    const result = isEdit
      ? await updateAddress(addressId, formData)
      : await createAddress(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.success) {
      setSuccess(result.message)
      setTimeout(() => {
        router.push("/addresses")
        router.refresh()
      }, 1000)
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "2px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "0.95rem",
    outline: "none",
    color: "#111827",
    background: "#ffffff",
    fontWeight: "500",
    fontFamily: "inherit"
  }

  const labelStyle = {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "0.375rem"
  }

  return (
    <main style={{minHeight: "100vh", background: "#f9fafb", padding: "2rem 1rem"}}>
      <style>{`
        input::placeholder { color: #9ca3af !important; opacity: 1 !important; font-weight: 400 !important; }
        input:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        textarea:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
      `}</style>

      <div style={{maxWidth: "700px", margin: "0 auto"}}>
        
        <Link href="/addresses" style={{display: "inline-block", color: "#2563eb", textDecoration: "none", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
          ← กลับรายการที่อยู่
        </Link>

        <div style={{background: "white", borderRadius: "16px", padding: "2rem", border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.06)"}}>
          
          <h1 style={{fontSize: "1.75rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem"}}>
            {isEdit ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
          </h1>
          <p style={{color: "#6b7280", fontSize: "0.95rem", marginBottom: "2rem"}}>
            {isEdit ? "อัปเดตข้อมูลที่อยู่ของคุณ" : "กรอกข้อมูลที่อยู่สำหรับการจัดส่ง"}
          </p>

          {error && (
            <div style={{background: "#fef2f2", border: "2px solid #fecaca", color: "#991b1b", padding: "0.875rem 1rem", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{background: "#f0fdf4", border: "2px solid #bbf7d0", color: "#166534", padding: "0.875rem 1rem", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
              ✅ {success} กำลังกลับไป...
            </div>
          )}

          <form action={handleSubmit}>

            <div style={{padding: "1rem", background: "#eff6ff", borderRadius: "10px", marginBottom: "1.5rem"}}>
              <h2 style={{fontSize: "1rem", fontWeight: "700", color: "#1e3a8a", margin: 0, marginBottom: "0.25rem"}}>
                🏷️ ป้ายชื่อ (ไม่จำเป็น)
              </h2>
              <p style={{fontSize: "0.8rem", color: "#1e40af", marginBottom: "0.75rem", margin: "0 0 0.75rem"}}>
                ตั้งชื่อเรียกที่อยู่นี้ เช่น "บ้าน", "ที่ทำงาน"
              </p>
              <input
                type="text"
                name="label"
                defaultValue={initialData?.label || ""}
                placeholder="เช่น บ้าน, ที่ทำงาน, คอนโด"
                maxLength={50}
                disabled={isLoading}
                style={inputStyle}
              />
            </div>

            <h2 style={{fontSize: "1.05rem", fontWeight: "700", color: "#111827", marginBottom: "1rem", marginTop: "1.5rem", paddingBottom: "0.5rem", borderBottom: "2px solid #f3f4f6"}}>
              👤 ข้อมูลผู้รับ
            </h2>

            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem"}}>
              <div>
                <label style={labelStyle}>
                  ชื่อ-นามสกุลผู้รับ <span style={{color: "#ef4444"}}>*</span>
                </label>
                <input
                  type="text"
                  name="recipientName"
                  defaultValue={initialData?.recipient_name || ""}
                  placeholder="ชื่อ-นามสกุล"
                  required
                  maxLength={100}
                  disabled={isLoading}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  เบอร์โทร <span style={{color: "#ef4444"}}>*</span>
                </label>
                <input
                  type="tel"
                  name="recipientPhone"
                  defaultValue={initialData?.recipient_phone || ""}
                  placeholder="0812345678"
                  required
                  disabled={isLoading}
                  style={inputStyle}
                />
              </div>
            </div>

            <h2 style={{fontSize: "1.05rem", fontWeight: "700", color: "#111827", marginBottom: "1rem", marginTop: "1.5rem", paddingBottom: "0.5rem", borderBottom: "2px solid #f3f4f6"}}>
              📍 ที่อยู่
            </h2>

            <div style={{marginBottom: "1.25rem"}}>
              <label style={labelStyle}>
                บ้านเลขที่/หมู่/ซอย/ถนน <span style={{color: "#ef4444"}}>*</span>
              </label>
              <textarea
                name="addressLine"
                defaultValue={initialData?.address_line || ""}
                placeholder="เช่น 123 หมู่ 5 ซอยสุขุมวิท 21 ถนนสุขุมวิท"
                required
                rows={2}
                maxLength={300}
                disabled={isLoading}
                style={{...inputStyle, resize: "vertical", minHeight: "60px", fontFamily: "inherit"}}
              />
            </div>

            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem"}}>
              <div>
                <label style={labelStyle}>
                  ตำบล/แขวง <span style={{color: "#ef4444"}}>*</span>
                </label>
                <input
                  type="text"
                  name="subdistrict"
                  defaultValue={initialData?.subdistrict || ""}
                  placeholder="เช่น คลองเตยเหนือ"
                  required
                  maxLength={100}
                  disabled={isLoading}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  อำเภอ/เขต <span style={{color: "#ef4444"}}>*</span>
                </label>
                <input
                  type="text"
                  name="district"
                  defaultValue={initialData?.district || ""}
                  placeholder="เช่น วัฒนา"
                  required
                  maxLength={100}
                  disabled={isLoading}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1.5rem"}}>
              <div>
                <label style={labelStyle}>
                  จังหวัด <span style={{color: "#ef4444"}}>*</span>
                </label>
                <input
                  type="text"
                  name="province"
                  defaultValue={initialData?.province || ""}
                  placeholder="เช่น กรุงเทพมหานคร"
                  required
                  maxLength={100}
                  disabled={isLoading}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  รหัสไปรษณีย์ <span style={{color: "#ef4444"}}>*</span>
                </label>
                <input
                  type="text"
                  name="postalCode"
                  defaultValue={initialData?.postal_code || ""}
                  placeholder="10110"
                  required
                  pattern="[0-9]{5}"
                  maxLength={5}
                  disabled={isLoading}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{padding: "1rem", background: "#f9fafb", borderRadius: "10px", marginBottom: "1.5rem"}}>
              <h2 style={{fontSize: "0.95rem", fontWeight: "700", color: "#111827", marginBottom: "0.75rem"}}>
                ⚙️ ตัวเลือก
              </h2>

              <label style={{display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", padding: "0.5rem 0"}}>
                <input
                  type="checkbox"
                  name="isDefault"
                  defaultChecked={initialData?.is_default || false}
                  disabled={isLoading}
                  style={{width: "20px", height: "20px", accentColor: "#2563eb", cursor: "pointer"}}
                />
                <div>
                  <p style={{margin: 0, fontSize: "0.9rem", fontWeight: "600", color: "#111827"}}>⭐ ตั้งเป็นที่อยู่หลัก</p>
                  <p style={{margin: 0, fontSize: "0.8rem", color: "#6b7280"}}>ใช้เป็นค่าเริ่มต้นในการสั่งซื้อ</p>
                </div>
              </label>

              <label style={{display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", padding: "0.5rem 0", marginTop: "0.5rem"}}>
                <input
                  type="checkbox"
                  name="isPickup"
                  defaultChecked={initialData?.is_pickup_address || false}
                  disabled={isLoading}
                  style={{width: "20px", height: "20px", accentColor: "#2563eb", cursor: "pointer"}}
                />
                <div>
                  <p style={{margin: 0, fontSize: "0.9rem", fontWeight: "600", color: "#111827"}}>📦 ใช้เป็นที่อยู่ pickup</p>
                  <p style={{margin: 0, fontSize: "0.8rem", color: "#6b7280"}}>ที่อยู่สำหรับให้ขนส่งมารับสินค้า (สำหรับร้านค้า)</p>
                </div>
              </label>
            </div>

            <div style={{display: "flex", gap: "0.75rem"}}>
              <Link
                href="/addresses"
                style={{flex: 1, padding: "0.875rem", background: "white", color: "#374151", border: "2px solid #d1d5db", borderRadius: "10px", textAlign: "center", textDecoration: "none", fontWeight: "600", fontSize: "1rem"}}
              >
                ยกเลิก
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                style={{flex: 2, padding: "0.875rem", background: isLoading ? "#93c5fd" : "#2563eb", color: "white", border: "none", borderRadius: "10px", fontSize: "1rem", fontWeight: "600", cursor: isLoading ? "not-allowed" : "pointer", boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)"}}
              >
                {isLoading ? "กำลังบันทึก..." : isEdit ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มที่อยู่"}
              </button>
            </div>

          </form>
        </div>

        <p style={{textAlign: "center", fontSize: "0.8rem", color: "#9ca3af", marginTop: "1.5rem"}}>
          Boom Plus Marketplace © 2026
        </p>

      </div>
    </main>
  )
}