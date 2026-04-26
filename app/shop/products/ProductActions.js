"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteProduct } from "@/lib/supabase/product-actions"

export default function ProductActions({ productId, productName }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleDelete() {
    if (!showConfirm) {
      setShowConfirm(true)
      setTimeout(() => setShowConfirm(false), 5000)
      return
    }

    setIsLoading(true)
    const result = await deleteProduct(productId)

    if (result?.success) {
      router.refresh()
    } else if (result?.error) {
      alert(result.error)
    }
    setIsLoading(false)
    setShowConfirm(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      style={{
        flex: 1,
        padding: "0.5rem",
        background: showConfirm ? "#dc2626" : "#fef2f2",
        color: showConfirm ? "white" : "#dc2626",
        border: showConfirm ? "1px solid #dc2626" : "1px solid #fecaca",
        borderRadius: "8px",
        fontSize: "0.85rem",
        fontWeight: "600",
        cursor: isLoading ? "not-allowed" : "pointer"
      }}
    >
      {isLoading ? "..." : (showConfirm ? "ยืนยันลบ" : "ลบ")}
    </button>
  )
}