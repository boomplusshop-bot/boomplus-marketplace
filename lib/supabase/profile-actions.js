"use server"

import { createClient } from "./server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "กรุณาเข้าสู่ระบบ" }
  }

  const fullName = formData.get("fullName")?.toString().trim()
  const username = formData.get("username")?.toString().trim().toLowerCase()
  const bio = formData.get("bio")?.toString().trim()
  const phone = formData.get("phone")?.toString().trim()

  if (!fullName || fullName.length < 2) {
    return { error: "กรุณากรอกชื่อ-นามสกุล อย่างน้อย 2 ตัวอักษร" }
  }

  if (fullName.length > 100) {
    return { error: "ชื่อ-นามสกุล ยาวเกินไป (สูงสุด 100 ตัวอักษร)" }
  }

  if (!username || username.length < 3) {
    return { error: "Username ต้องอย่างน้อย 3 ตัวอักษร" }
  }

  if (username.length > 30) {
    return { error: "Username ยาวเกินไป (สูงสุด 30 ตัวอักษร)" }
  }

  if (!/^[a-z0-9_]+$/.test(username)) {
    return { error: "Username ใช้ได้เฉพาะ a-z, 0-9, _ เท่านั้น" }
  }

  if (bio && bio.length > 500) {
    return { error: "Bio ยาวเกินไป (สูงสุด 500 ตัวอักษร)" }
  }

  if (phone && !/^[0-9]{9,10}$/.test(phone.replace(/[-\s]/g, ""))) {
    return { error: "เบอร์โทรไม่ถูกต้อง (ต้องเป็นตัวเลข 9-10 หลัก)" }
  }

  const { data: existing } = await supabase
    .from("users")
    .select("id, auth_id")
    .eq("username", username)
    .maybeSingle()

  if (existing && existing.auth_id !== user.id) {
    return { error: "Username นี้มีคนใช้แล้ว กรุณาเลือกใหม่" }
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({
      full_name: fullName,
      username: username,
      bio: bio || null,
      phone: phone || null,
      updated_at: new Date().toISOString()
    })
    .eq("auth_id", user.id)

  if (updateError) {
    console.error("Update error:", updateError)
    return { error: "เกิดข้อผิดพลาด: " + updateError.message }
  }

  revalidatePath("/profile")
  revalidatePath("/")

  return { success: true, message: "บันทึกสำเร็จ!" }
}