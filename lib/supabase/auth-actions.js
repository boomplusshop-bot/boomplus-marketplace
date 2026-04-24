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

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        full_name: fullName || email.split("@")[0],
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  })

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "อีเมลนี้ถูกใช้แล้ว กรุณาเข้าสู่ระบบ" }
    }
    return { error: error.message }
  }

  return { 
    success: true, 
    message: "สมัครสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยัน",
    email: email 
  }
}

export async function login(formData) {
  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "กรุณากรอกอีเมลและรหัสผ่าน" }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

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