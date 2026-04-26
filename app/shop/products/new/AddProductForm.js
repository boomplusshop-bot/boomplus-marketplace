"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createProduct, uploadProductImage } from "@/lib/supabase/product-actions"

export default function AddProductForm({ categories }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [data, setData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    categoryId: "",
    price: "",
    originalPrice: "",
    stock: "",
    thumbnailUrl: ""
  })

  function updateField(field, value) {
    setData({ ...data, [field]: value })
    setError("")
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")

    const result = await uploadProductImage(file)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      updateField("thumbnailUrl", result.url)
    }
    setUploading(false)
  }

  async function handleSubmit(e, action) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("shortDescription", data.shortDescription)
    formData.append("description", data.description)
    formData.append("categoryId", data.categoryId)
    formData.append("price", data.price)
    formData.append("originalPrice", data.originalPrice || "0")
    formData.append("stock", data.stock || "0")
    formData.append("thumbnailUrl", data.thumbnailUrl)
    formData.append("action", action)

    const result = await createProduct(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.success) {
      setSuccess(result.message)
      setTimeout(() => {
        router.push("/shop/products")
        router.refresh()
      }, 1500)
    }
  }

  const inputStyle = {width: "100%", padding: "0.875rem 1rem", border: "2px solid #d1d5db", borderRadius: "10px", fontSize: "1rem", outline: "none", color: "#111827", background: "#ffffff", fontWeight: "500"}
  const labelStyle = {display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#1f2937", marginBottom: "0.5rem"}

  return (
    <main style={{minHeight: "100vh", background: "#f9fafb", padding: "2rem 1rem"}}>
      <div style={{maxWidth: "700px", margin: "0 auto"}}>
        
        <Link href="/shop/products" style={{display: "inline-block", color: "#2563eb", textDecoration: "none", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
          กลับไปหน้าสินค้า
        </Link>

        <div style={{background: "white", borderRadius: "16px", padding: "2rem", border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.06)"}}>
          
          <h1 style={{fontSize: "1.75rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem"}}>
            เพิ่มสินค้าใหม่
          </h1>
          <p style={{color: "#6b7280", fontSize: "0.95rem", marginBottom: "2rem"}}>
            กรอกข้อมูลสินค้าของคุณ
          </p>

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

          <form>

            <div style={{marginBottom: "1.5rem"}}>
              <label style={labelStyle}>รูปสินค้า</label>
              {data.thumbnailUrl ? (
                <div style={{position: "relative", marginBottom: "0.5rem"}}>
                  <img src={data.thumbnailUrl} alt="preview" style={{width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "10px", border: "2px solid #e5e7eb"}} />
                  <button type="button" onClick={() => updateField("thumbnailUrl", "")} style={{position: "absolute", top: "0.5rem", right: "0.5rem", padding: "0.5rem 1rem", background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "8px", fontSize: "0.85rem", cursor: "pointer"}}>
                    ลบรูป
                  </button>
                </div>
              ) : (
                <label style={{display: "block", padding: "2rem", border: "2px dashed #d1d5db", borderRadius: "10px", textAlign: "center", cursor: "pointer", background: "#fafafa"}}>
                  {uploading ? (
                    <p style={{color: "#2563eb", margin: 0, fontWeight: "600"}}>กำลังอัปโหลด...</p>
                  ) : (
                    <>
                      <p style={{fontSize: "2.5rem", margin: 0, marginBottom: "0.25rem"}}>📷</p>
                      <p style={{color: "#374151", fontSize: "0.95rem", margin: 0, fontWeight: "600"}}>คลิกเพื่ออัปโหลดรูป</p>
                      <p style={{color: "#6b7280", fontSize: "0.8rem", margin: "0.25rem 0 0"}}>JPG, PNG, WEBP (5 MB)</p>
                    </>
                  )}
                  <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImageUpload} disabled={uploading} style={{display: "none"}} />
                </label>
              )}
            </div>

            <div style={{marginBottom: "1.25rem"}}>
              <label style={labelStyle}>ชื่อสินค้า *</label>
              <input type="text" value={data.name} onChange={(e) => updateField("name", e.target.value)} placeholder="เช่น เสื้อยืด Boom Plus" maxLength={200} required style={inputStyle} />
            </div>

            <div style={{marginBottom: "1.25rem"}}>
              <label style={labelStyle}>หมวดหมู่ *</label>
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem"}}>
                {categories.map(cat => (
                  <button key={cat.id} type="button" onClick={() => updateField("categoryId", cat.id)} style={{padding: "0.75rem", background: data.categoryId === cat.id ? "#2563eb" : "white", color: data.categoryId === cat.id ? "white" : "#374151", border: data.categoryId === cat.id ? "2px solid #2563eb" : "2px solid #e5e7eb", borderRadius: "10px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer"}}>
                    {cat.icon || ""} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem"}}>
              <div>
                <label style={labelStyle}>ราคาขาย (฿) *</label>
                <input type="number" value={data.price} onChange={(e) => updateField("price", e.target.value)} placeholder="299" min="1" step="0.01" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>ราคาเดิม (ถ้าลด)</label>
                <input type="number" value={data.originalPrice} onChange={(e) => updateField("originalPrice", e.target.value)} placeholder="399" min="0" step="0.01" style={inputStyle} />
              </div>
            </div>

            <div style={{marginBottom: "1.25rem"}}>
              <label style={labelStyle}>สต็อก *</label>
              <input type="number" value={data.stock} onChange={(e) => updateField("stock", e.target.value)} placeholder="100" min="0" required style={inputStyle} />
            </div>

            <div style={{marginBottom: "1.25rem"}}>
              <label style={labelStyle}>คำอธิบายสั้น</label>
              <input type="text" value={data.shortDescription} onChange={(e) => updateField("shortDescription", e.target.value)} placeholder="สรุปสั้น ๆ 1 ประโยค" maxLength={150} style={inputStyle} />
            </div>

            <div style={{marginBottom: "1.5rem"}}>
              <label style={labelStyle}>รายละเอียดสินค้า *</label>
              <textarea value={data.description} onChange={(e) => updateField("description", e.target.value)} rows={6} maxLength={2000} required placeholder="อธิบายสินค้า วัสดุ ขนาด..." style={{...inputStyle, resize: "vertical", minHeight: "150px"}} />
              <p style={{fontSize: "0.8rem", color: "#6b7280", marginTop: "0.375rem"}}>{data.description.length}/2000 ตัวอักษร</p>
            </div>

            <div style={{display: "flex", gap: "0.75rem"}}>
              <button type="button" onClick={(e) => handleSubmit(e, "draft")} disabled={isLoading} style={{flex: 1, padding: "0.875rem", background: "white", color: "#374151", border: "2px solid #d1d5db", borderRadius: "10px", fontSize: "1rem", fontWeight: "600", cursor: isLoading ? "not-allowed" : "pointer"}}>
                บันทึกแบบร่าง
              </button>
              <button type="button" onClick={(e) => handleSubmit(e, "publish")} disabled={isLoading} style={{flex: 2, padding: "0.875rem", background: isLoading ? "#9ca3af" : "linear-gradient(135deg, #10b981, #059669)", color: "white", border: "none", borderRadius: "10px", fontSize: "1rem", fontWeight: "700", cursor: isLoading ? "not-allowed" : "pointer", boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)"}}>
                {isLoading ? "กำลังเพิ่ม..." : "เพิ่มและเปิดขาย"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  )
}