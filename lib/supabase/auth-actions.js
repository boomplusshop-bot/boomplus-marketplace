"use server"

import { createClient } from "./server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signup(formData) {
  const email = formData.get("email")
  const password = formData.get("password")
  const fullName = formData.get("fullName")

  if (!email || !password) {
    return { error: "กรุณากรอกอีเมลและรหัสผ่าน" }
  }
  if (password.length < 6) {
    return { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { full_name: fullName || email.split("@")[0] },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  })

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "อีเมลนี้ถูกใช้แล้ว กรุณาเข้าสู่ระบบ" }
    }
    return { error: error.message }
  }

  return { success: true, message: "สมัครสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยัน", email: email }
}

export async function login(formData) {
  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "กรุณากรอกอีเมลและรหัสผ่าน" }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.message.includes("Invalid login")) {
      return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ" }
    }
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}

export async function forgotPassword(formData) {
  const email = formData.get("email")?.toString().trim()

  if (!email) {
    return { error: "กรุณากรอกอีเมล" }
  }
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return { error: "รูปแบบอีเมลไม่ถูกต้อง" }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?next=/reset-password`,
  })

  if (error) {
    console.error("Forgot password error:", error)
    return { error: "เกิดข้อผิดพลาด: " + error.message }
  }

  return { success: true, message: "ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลแล้ว กรุณาตรวจสอบกล่องจดหมาย", email }
}

export async function resetPassword(formData) {
  const password = formData.get("password")?.toString()
  const confirmPassword = formData.get("confirmPassword")?.toString()

  if (!password || !confirmPassword) {
    return { error: "กรุณากรอกรหัสผ่านทั้งสองช่อง" }
  }
  if (password.length < 6) {
    return { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }
  }
  if (password !== confirmPassword) {
    return { error: "รหัสผ่านทั้งสองช่องไม่ตรงกัน" }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Session หมดอายุ กรุณาขอลิงก์ใหม่" }
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error("Reset password error:", error)
    return { error: "เกิดข้อผิดพลาด: " + error.message }
  }

  return { success: true, message: "รีเซ็ตรหัสผ่านสำเร็จ! กำลังพากลับไปหน้าเข้าสู่ระบบ..." }
}

export async function changePassword(formData) {
  const currentPassword = formData.get("currentPassword")?.toString()
  const newPassword = formData.get("newPassword")?.toString()
  const confirmPassword = formData.get("confirmPassword")?.toString()

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "กรุณากรอกข้อมูลให้ครบ" }
  }
  if (newPassword.length < 6) {
    return { error: "รหัสผ่านใหม่ต้องอย่างน้อย 6 ตัวอักษร" }
  }
  if (newPassword !== confirmPassword) {
    return { error: "รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน" }
  }
  if (currentPassword === newPassword) {
    return { error: "รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านปัจจุบัน" }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "กรุณาเข้าสู่ระบบ" }
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword
  })

  if (signInError) {
    return { error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" }
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword })

  if (error) {
    return { error: "เกิดข้อผิดพลาด: " + error.message }
  }

  return { success: true, message: "เปลี่ยนรหัสผ่านสำเร็จ!" }
}