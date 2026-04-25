"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteAddress, setDefaultAddress } from "@/lib/supabase/address-actions"

export default function AddressActions({ addressId, isDefault }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSettingDefault, setIsSettingDefault] = useState(false)
  const [error, setError] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }

    setIsDeleting(true)
    setError("")

    const result = await deleteAddress(addressId)

    if (result?.error) {
      setError(result.error)
      setIsDeleting(false)
      setConfirmDelete(false)
    } else {
      router.refresh()
    }
  }

  async function handleSetDefault() {
    setIsSettingDefault(true)
    setError("")

    const result = await setDefaultAddress(addressId)

    if (result?.error) {
      setError(result.error)
    } else {
      router.refresh()
    }
    setIsSettingDefault(false)
  }

  return (
    <div>
      {error && (
        <p style={{color: "#ef4444", fontSize: "0.8rem", marginBottom: "0.5rem", margin: "0 0 0.5rem"}}>
          {error}
        </p>
      )}

      <div style={{display: "flex", gap: "0.5rem", flexWrap: "wrap"}}>
        {!isDefault && (
          <button
            onClick={handleSetDefault}
            disabled={isSettingDefault}
            style={{padding: "0.5rem 0.875rem", background: "white", color: "#2563eb", border: "1.5px solid #2563eb", borderRadius: "8px", fontSize: "0.8rem", fontWeight: "600", cursor: isSettingDefault ? "not-allowed" : "pointer"}}
          >
            {isSettingDefault ? "กำลังตั้ง..." : "⭐ ตั้งเป็นหลัก"}
          </button>
        )}

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          style={{padding: "0.5rem 0.875rem", background: confirmDelete ? "#dc2626" : "white", color: confirmDelete ? "white" : "#dc2626", border: "1.5px solid #dc2626", borderRadius: "8px", fontSize: "0.8rem", fontWeight: "600", cursor: isDeleting ? "not-allowed" : "pointer"}}
        >
          {isDeleting ? "กำลังลบ..." : confirmDelete ? "✓ ยืนยันลบ" : "🗑️ ลบ"}
        </button>
      </div>
    </div>
  )
}