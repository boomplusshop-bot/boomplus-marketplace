"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toggleShopStatus } from "@/lib/supabase/shop-actions"

export default function StatusToggle({ currentStatus }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)

  const isActive = currentStatus === "active"
  const isPending = currentStatus === "pending"

  async function handleToggle() {
    if (!showConfirm) {
      setShowConfirm(true)
      setTimeout(() => setShowConfirm(false), 5000)
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    const newStatus = isActive ? "closed" : "active"
    const result = await toggleShopStatus(newStatus)

    if (result?.error) {
      setError(result.error)
      setShowConfirm(false)
    } else if (result?.success) {
      setSuccess(result.message)
      setShowConfirm(false)
      setTimeout(() => router.refresh(), 1000)
    }
    setIsLoading(false)
  }

  if (isPending) {
    return (
      <div style={{padding: "1.25rem", background: "#fef3c7", border: "2px solid #fcd34d", borderRadius: "12px"}}>
        <div style={{display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem"}}>
          <span style={{fontSize: "1.5rem"}}>⏳</span>
          <h3 style={{fontSize: "1rem", fontWeight: "700", color: "#78350f", margin: 0}}>ร้านยังไม่ได้รับการยืนยัน</h3>
        </div>
        <p style={{fontSize: "0.875rem", color: "#92400e", margin: 0, lineHeight: "1.6"}}>กรุณายืนยันตัวตนก่อนเปิดร้านให้ลูกค้าซื้อสินค้าได้ (Day 9)</p>
      </div>
    )
  }

  const bgColor = isActive ? "#f0fdf4" : "#fef2f2"
  const borderColor = isActive ? "2px solid #bbf7d0" : "2px solid #fecaca"
  const titleColor = isActive ? "#166534" : "#991b1b"
  const textColor = isActive ? "#15803d" : "#7f1d1d"
  const btnBg = isLoading ? "#9ca3af" : (showConfirm ? "#f59e0b" : (isActive ? "#dc2626" : "#10b981"))
  const btnText = isLoading ? "กำลังบันทึก..." : (showConfirm ? "ยืนยัน" : (isActive ? "ปิดร้านชั่วคราว" : "เปิดร้าน"))

  return (
    <div style={{padding: "1.25rem", background: bgColor, border: borderColor, borderRadius: "12px"}}>
      <div style={{display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem"}}>
        <span style={{fontSize: "1.5rem"}}>{isActive ? "🟢" : "🔴"}</span>
        <h3 style={{fontSize: "1rem", fontWeight: "700", color: titleColor, margin: 0}}>{isActive ? "ร้านเปิดให้บริการ" : "ร้านปิดชั่วคราว"}</h3>
      </div>
      <p style={{fontSize: "0.875rem", color: textColor, margin: 0, marginBottom: "1rem", lineHeight: "1.6"}}>{isActive ? "ลูกค้าสามารถเห็นและซื้อสินค้าจากร้านได้" : "ลูกค้ามองเห็นร้าน แต่ซื้อสินค้าไม่ได้"}</p>

      {error && <div style={{background: "white", border: "1px solid #fecaca", color: "#991b1b", padding: "0.625rem 0.875rem", borderRadius: "8px", marginBottom: "0.75rem", fontSize: "0.875rem"}}>{error}</div>}
      {success && <div style={{background: "white", border: "1px solid #bbf7d0", color: "#166534", padding: "0.625rem 0.875rem", borderRadius: "8px", marginBottom: "0.75rem", fontSize: "0.875rem"}}>{success}</div>}
      {showConfirm && <div style={{padding: "0.875rem", background: "white", border: "2px solid #f59e0b", borderRadius: "8px", marginBottom: "0.75rem", fontSize: "0.875rem", color: "#78350f"}}>กดปุ่มอีกครั้งเพื่อยืนยัน</div>}

      <button type="button" onClick={handleToggle} disabled={isLoading} style={{padding: "0.75rem 1.5rem", background: btnBg, color: "white", border: "none", borderRadius: "8px", fontSize: "0.95rem", fontWeight: "600", cursor: isLoading ? "not-allowed" : "pointer"}}>
        {btnText}
      </button>
    </div>
  )
}