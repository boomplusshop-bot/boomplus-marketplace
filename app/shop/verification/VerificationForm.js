"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { saveVerification, uploadVerificationFile } from "@/lib/supabase/verification-actions"

const THAI_BANKS = [
  "ธนาคารกสิกรไทย (KBANK)",
  "ธนาคารไทยพาณิชย์ (SCB)",
  "ธนาคารกรุงเทพ (BBL)",
  "ธนาคารกรุงไทย (KTB)",
  "ธนาคารกรุงศรีอยุธยา (BAY)",
  "ธนาคารทหารไทยธนชาต (TTB)",
  "ธนาคารออมสิน (GSB)",
  "ธนาคาร ธ.ก.ส. (BAAC)",
  "ธนาคารยูโอบี (UOB)",
  "ธนาคารซีไอเอ็มบี ไทย (CIMB)",
  "ธนาคารเกียรตินาคินภัทร (KKP)",
  "อื่นๆ"
]

export default function VerificationForm({ initialData, shopId, userId }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [uploading, setUploading] = useState(null)

  const [data, setData] = useState({
    bankName: initialData?.bank_name || "",
    bankAccountNumber: initialData?.bank_account_number || "",
    bankAccountName: initialData?.bank_account_name || "",
    idCardUrl: initialData?.id_card_url || "",
    businessDocUrl: initialData?.business_doc_url || "",
    bankAccountUrl: initialData?.bank_account_url || ""
  })

  const status = initialData?.status || "draft"
  const isLocked = status === "approved" || status === "pending"

  function updateField(field, value) {
    setData({ ...data, [field]: value })
    setError("")
  }

  async function handleFileUpload(e, fileType, fieldName) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(fileType)
    setError("")

    const result = await uploadVerificationFile(file, fileType)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      updateField(fieldName, result.path)
    }

    setUploading(null)
  }

  async function handleSubmit(e, action) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData()
    formData.append("bankName", data.bankName)
    formData.append("bankAccountNumber", data.bankAccountNumber)
    formData.append("bankAccountName", data.bankAccountName)
    formData.append("idCardUrl", data.idCardUrl)
    formData.append("businessDocUrl", data.businessDocUrl)
    formData.append("bankAccountUrl", data.bankAccountUrl)
    formData.append("action", action)

    const result = await saveVerification(formData)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.message)
      setTimeout(() => router.refresh(), 1500)
    }
    setIsLoading(false)
  }

  const inputStyle = {width: "100%", padding: "0.875rem 1rem", border: "2px solid #d1d5db", borderRadius: "10px", fontSize: "1rem", outline: "none", color: "#111827", background: "#ffffff", fontWeight: "500"}
  const labelStyle = {display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#1f2937", marginBottom: "0.5rem"}

  const statusInfo = {
    draft: { label: "แบบร่าง", color: "#6b7280", bg: "#f3f4f6", icon: "📝" },
    pending: { label: "รอการตรวจสอบ", color: "#d97706", bg: "#fef3c7", icon: "⏳" },
    approved: { label: "อนุมัติแล้ว", color: "#059669", bg: "#d1fae5", icon: "✅" },
    rejected: { label: "ถูกปฏิเสธ", color: "#dc2626", bg: "#fee2e2", icon: "❌" }
  }[status] || { label: status, color: "#6b7280", bg: "#f3f4f6", icon: "📝" }

  function FileUploadField({ label, fileType, fieldName, currentValue, required }) {
    const isUploading = uploading === fileType
    const hasFile = !!currentValue

    return (
      <div style={{marginBottom: "1.25rem"}}>
        <label style={labelStyle}>
          {label} {required && <span style={{color: "#ef4444"}}>*</span>}
        </label>
        
        <div style={{padding: "1rem", border: hasFile ? "2px solid #10b981" : "2px dashed #d1d5db", borderRadius: "10px", background: hasFile ? "#f0fdf4" : "#fafafa"}}>
          {hasFile ? (
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <div>
                <p style={{margin: 0, color: "#166534", fontSize: "0.9rem", fontWeight: "600"}}>
                  ✅ อัปโหลดแล้ว
                </p>
                <p style={{margin: "0.25rem 0 0", color: "#6b7280", fontSize: "0.75rem"}}>
                  {currentValue.split('/').pop()}
                </p>
              </div>
              {!isLocked && (
                <label style={{padding: "0.5rem 1rem", background: "white", border: "2px solid #d1d5db", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer", color: "#374151"}}>
                  เปลี่ยน
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleFileUpload(e, fileType, fieldName)} disabled={isUploading || isLocked} style={{display: "none"}} />
                </label>
              )}
            </div>
          ) : (
            <label style={{display: "block", textAlign: "center", cursor: isLocked ? "not-allowed" : "pointer", padding: "1rem"}}>
              {isUploading ? (
                <p style={{color: "#2563eb", fontSize: "0.95rem", margin: 0, fontWeight: "600"}}>
                  ⏳ กำลังอัปโหลด...
                </p>
              ) : (
                <>
                  <p style={{fontSize: "2rem", margin: 0, marginBottom: "0.25rem"}}>📤</p>
                  <p style={{color: "#374151", fontSize: "0.95rem", margin: 0, fontWeight: "600"}}>คลิกเพื่ออัปโหลด</p>
                  <p style={{color: "#6b7280", fontSize: "0.8rem", margin: "0.25rem 0 0"}}>JPG, PNG, PDF (ไม่เกิน 5 MB)</p>
                </>
              )}
              <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleFileUpload(e, fileType, fieldName)} disabled={isUploading || isLocked} style={{display: "none"}} />
            </label>
          )}
        </div>
      </div>
    )
  }

  return (
    <main style={{minHeight: "100vh", background: "#f9fafb", padding: "2rem 1rem"}}>
      <div style={{maxWidth: "700px", margin: "0 auto"}}>
        
        <Link href="/shop/dashboard" style={{display: "inline-block", color: "#2563eb", textDecoration: "none", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
          กลับแดชบอร์ด
        </Link>

        <div style={{background: "white", borderRadius: "16px", padding: "2rem", border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.06)"}}>
          
          <h1 style={{fontSize: "1.75rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem"}}>
            🛡️ ยืนยันตัวตนร้านค้า
          </h1>
          <p style={{color: "#6b7280", fontSize: "0.95rem", marginBottom: "1.5rem"}}>
            กรอกข้อมูลและอัปโหลดเอกสารเพื่อเปิดร้านขายได้
          </p>

          <div style={{padding: "1rem", background: statusInfo.bg, borderRadius: "10px", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem"}}>
            <span style={{fontSize: "1.5rem"}}>{statusInfo.icon}</span>
            <div>
              <p style={{margin: 0, fontSize: "0.8rem", color: statusInfo.color, fontWeight: "600"}}>สถานะปัจจุบัน</p>
              <p style={{margin: 0, fontSize: "1.05rem", color: statusInfo.color, fontWeight: "700"}}>{statusInfo.label}</p>
            </div>
          </div>

          {error && (
            <div style={{background: "#fef2f2", border: "2px solid #fecaca", color: "#991b1b", padding: "0.875rem 1rem", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{background: "#f0fdf4", border: "2px solid #bbf7d0", color: "#166534", padding: "0.875rem 1rem", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.95rem", fontWeight: "500"}}>
              ✅ {success}
            </div>
          )}

          {initialData?.rejection_reason && (
            <div style={{background: "#fef2f2", border: "2px solid #fecaca", padding: "1rem", borderRadius: "10px", marginBottom: "1.5rem"}}>
              <p style={{margin: 0, color: "#991b1b", fontWeight: "700", marginBottom: "0.25rem"}}>เหตุผลที่ปฏิเสธ:</p>
              <p style={{margin: 0, color: "#7f1d1d", fontSize: "0.9rem"}}>{initialData.rejection_reason}</p>
            </div>
          )}

          <form>

            <h2 style={{fontSize: "1.125rem", fontWeight: "700", color: "#111827", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #f3f4f6"}}>
              💳 ข้อมูลธนาคาร
            </h2>

            <div style={{marginBottom: "1.25rem"}}>
              <label style={labelStyle}>ธนาคาร *</label>
              <select value={data.bankName} onChange={(e) => updateField("bankName", e.target.value)} disabled={isLocked} style={inputStyle}>
                <option value="">-- เลือกธนาคาร --</option>
                {THAI_BANKS.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>

            <div style={{marginBottom: "1.25rem"}}>
              <label style={labelStyle}>เลขบัญชี *</label>
              <input type="text" value={data.bankAccountNumber} onChange={(e) => updateField("bankAccountNumber", e.target.value)} placeholder="0123456789" maxLength={20} disabled={isLocked} style={inputStyle} />
            </div>

            <div style={{marginBottom: "1.25rem"}}>
              <label style={labelStyle}>ชื่อบัญชี *</label>
              <input type="text" value={data.bankAccountName} onChange={(e) => updateField("bankAccountName", e.target.value)} placeholder="นาย/นางสาว..." maxLength={100} disabled={isLocked} style={inputStyle} />
            </div>

            <h2 style={{fontSize: "1.125rem", fontWeight: "700", color: "#111827", margin: "2rem 0 1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #f3f4f6"}}>
              📄 เอกสาร
            </h2>

            <FileUploadField label="บัตรประชาชน" fileType="id_card" fieldName="idCardUrl" currentValue={data.idCardUrl} required />
            
            <FileUploadField label="เอกสารธุรกิจ (ไม่บังคับ)" fileType="business_doc" fieldName="businessDocUrl" currentValue={data.businessDocUrl} />
            
            <FileUploadField label="หน้าสมุดบัญชีธนาคาร" fileType="bank_account" fieldName="bankAccountUrl" currentValue={data.bankAccountUrl} required />

            {!isLocked && (
              <div style={{display: "flex", gap: "0.75rem", marginTop: "2rem"}}>
                <button type="button" onClick={(e) => handleSubmit(e, "draft")} disabled={isLoading} style={{flex: 1, padding: "0.875rem", background: "white", color: "#374151", border: "2px solid #d1d5db", borderRadius: "10px", fontSize: "1rem", fontWeight: "600", cursor: isLoading ? "not-allowed" : "pointer"}}>
                  💾 บันทึกแบบร่าง
                </button>
                <button type="button" onClick={(e) => handleSubmit(e, "submit")} disabled={isLoading} style={{flex: 2, padding: "0.875rem", background: isLoading ? "#9ca3af" : "linear-gradient(135deg, #10b981, #059669)", color: "white", border: "none", borderRadius: "10px", fontSize: "1rem", fontWeight: "700", cursor: isLoading ? "not-allowed" : "pointer", boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)"}}>
                  {isLoading ? "กำลังส่ง..." : "🚀 ส่งคำขอยืนยัน"}
                </button>
              </div>
            )}

            {isLocked && (
              <div style={{padding: "1.25rem", background: "#fef3c7", borderRadius: "10px", marginTop: "1rem", textAlign: "center"}}>
                <p style={{margin: 0, color: "#78350f", fontSize: "0.95rem", fontWeight: "600"}}>
                  {status === "approved" ? "✅ ข้อมูลได้รับการอนุมัติแล้ว" : "⏳ คำขอกำลังรอการตรวจสอบ"}
                </p>
              </div>
            )}

          </form>

        </div>

      </div>
    </main>
  )
}