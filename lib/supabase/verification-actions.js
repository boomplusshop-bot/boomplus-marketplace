"use server"

import { createClient } from "./server"
import { revalidatePath } from "next/cache"

export async function getVerification() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .maybeSingle()

  if (!profile) return null

  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", profile.id)
    .maybeSingle()

  if (!shop) return null

  const { data: verification } = await supabase
    .from("shop_verifications")
    .select("*")
    .eq("shop_id", shop.id)
    .maybeSingle()

  return { verification, shopId: shop.id, userId: user.id }
}

export async function saveVerification(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: "กรุณาเข้าสู่ระบบ" }

  const { data: profile } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .maybeSingle()

  if (!profile) return { error: "ไม่พบข้อมูลผู้ใช้" }

  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", profile.id)
    .maybeSingle()

  if (!shop) return { error: "ไม่พบร้านค้าของคุณ" }

  const bankName = formData.get("bankName")?.toString().trim()
  const bankAccountNumber = formData.get("bankAccountNumber")?.toString().trim()
  const bankAccountName = formData.get("bankAccountName")?.toString().trim()
  const idCardUrl = formData.get("idCardUrl")?.toString().trim()
  const businessDocUrl = formData.get("businessDocUrl")?.toString().trim()
  const bankAccountUrl = formData.get("bankAccountUrl")?.toString().trim()
  const action = formData.get("action")?.toString()

  if (action === "submit") {
    if (!bankName || bankName.length < 2) return { error: "กรุณาเลือกธนาคาร" }
    if (!bankAccountNumber || !/^[0-9]{10,15}$/.test(bankAccountNumber.replace(/[-\s]/g, ""))) {
      return { error: "เลขบัญชีไม่ถูกต้อง (10-15 หลัก)" }
    }
    if (!bankAccountName || bankAccountName.length < 2) return { error: "กรุณากรอกชื่อบัญชี" }
    if (!idCardUrl) return { error: "กรุณาอัปโหลดบัตรประชาชน" }
    if (!bankAccountUrl) return { error: "กรุณาอัปโหลดหน้าสมุดบัญชี" }
  }

  const { data: existing } = await supabase
    .from("shop_verifications")
    .select("id, status")
    .eq("shop_id", shop.id)
    .maybeSingle()

  const newStatus = action === "submit" ? "pending" : "draft"

  const dataToSave = {
    shop_id: shop.id,
    bank_name: bankName,
    bank_account_number: bankAccountNumber,
    bank_account_name: bankAccountName,
    id_card_url: idCardUrl,
    business_doc_url: businessDocUrl,
    bank_account_url: bankAccountUrl,
    status: newStatus,
    updated_at: new Date().toISOString()
  }

  let result
  if (existing) {
    if (existing.status === "approved") {
      return { error: "ข้อมูลได้รับการอนุมัติแล้ว ไม่สามารถแก้ไขได้" }
    }
    result = await supabase
      .from("shop_verifications")
      .update(dataToSave)
      .eq("id", existing.id)
  } else {
    result = await supabase
      .from("shop_verifications")
      .insert(dataToSave)
  }

  if (result.error) {
    console.error("Save verification error:", result.error)
    return { error: "เกิดข้อผิดพลาด: " + result.error.message }
  }

  revalidatePath("/shop/verification")
  revalidatePath("/shop/dashboard")

  return { 
    success: true, 
    message: action === "submit" 
      ? "ส่งคำขอยืนยันสำเร็จ! รอการตรวจสอบ 1-3 วัน" 
      : "บันทึกแบบร่างสำเร็จ!",
    status: newStatus
  }
}

export async function uploadVerificationFile(file, fileType) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: "กรุณาเข้าสู่ระบบ" }

  const fileExt = file.name.split('.').pop().toLowerCase()
  const allowedExts = ['jpg', 'jpeg', 'png', 'pdf']
  
  if (!allowedExts.includes(fileExt)) {
    return { error: "รองรับเฉพาะ JPG, PNG, PDF" }
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "ขนาดไฟล์ต้องไม่เกิน 5 MB" }
  }

  const timestamp = Date.now()
  const filePath = user.id + "/" + fileType + "_" + timestamp + "." + fileExt

  const { error: uploadError } = await supabase.storage
    .from("verifications")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false
    })

  if (uploadError) {
    console.error("Upload error:", uploadError)
    return { error: "อัปโหลดไม่สำเร็จ: " + uploadError.message }
  }

  return { 
    success: true, 
    path: filePath
  }
}