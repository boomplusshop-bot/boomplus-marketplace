"use server"

import { createClient } from "./server"
import { revalidatePath } from "next/cache"

export async function checkSlugAvailable(slug) {
  if (!slug || slug.length < 3) {
    return { available: false, error: "Slug ต้องอย่างน้อย 3 ตัวอักษร" }
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { available: false, error: "Slug ใช้ได้เฉพาะ a-z, 0-9, - เท่านั้น" }
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from("shops")
    .select("id")
    .eq("slug", slug)
    .maybeSingle()

  return { available: !data }
}

export async function createShop(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: "กรุณาเข้าสู่ระบบ" }
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, role")
    .eq("auth_id", user.id)
    .maybeSingle()

  if (!profile) {
    return { error: "ไม่พบข้อมูลผู้ใช้" }
  }

  const { data: existingShop } = await supabase
    .from("shops")
    .select("id, slug")
    .eq("owner_id", profile.id)
    .maybeSingle()

  if (existingShop) {
    return { error: "คุณมีร้านค้าอยู่แล้ว", existingSlug: existingShop.slug }
  }

  const name = formData.get("name")?.toString().trim()
  const slug = formData.get("slug")?.toString().trim().toLowerCase()
  const description = formData.get("description")?.toString().trim()
  const categoryId = formData.get("categoryId")?.toString()
  const phone = formData.get("phone")?.toString().trim()
  const pickupAddressId = formData.get("pickupAddressId")?.toString()

  if (!name || name.length < 2) {
    return { error: "กรุณากรอกชื่อร้านอย่างน้อย 2 ตัวอักษร" }
  }
  if (name.length > 100) {
    return { error: "ชื่อร้านยาวเกินไป (สูงสุด 100 ตัวอักษร)" }
  }

  if (!slug || slug.length < 3) {
    return { error: "Slug ต้องอย่างน้อย 3 ตัวอักษร" }
  }
  if (slug.length > 50) {
    return { error: "Slug ยาวเกินไป (สูงสุด 50 ตัวอักษร)" }
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: "Slug ใช้ได้เฉพาะ a-z, 0-9, - เท่านั้น" }
  }

  if (!categoryId) {
    return { error: "กรุณาเลือกหมวดหมู่ร้าน" }
  }

  if (!description || description.length < 10) {
    return { error: "กรุณากรอกคำอธิบายร้านอย่างน้อย 10 ตัวอักษร" }
  }
  if (description.length > 500) {
    return { error: "คำอธิบายยาวเกินไป (สูงสุด 500 ตัวอักษร)" }
  }

  if (!phone || !/^[0-9]{9,10}$/.test(phone.replace(/[-\s]/g, ""))) {
    return { error: "เบอร์โทรร้านไม่ถูกต้อง (9-10 หลัก)" }
  }

  if (!pickupAddressId) {
    return { error: "กรุณาเลือกที่อยู่สำหรับให้ขนส่งมารับสินค้า" }
  }

  const { data: addressCheck } = await supabase
    .from("addresses")
    .select("id")
    .eq("id", pickupAddressId)
    .eq("user_id", profile.id)
    .maybeSingle()

  if (!addressCheck) {
    return { error: "ที่อยู่ที่เลือกไม่ถูกต้อง" }
  }

  const { data: slugCheck } = await supabase
    .from("shops")
    .select("id")
    .eq("slug", slug)
    .maybeSingle()

  if (slugCheck) {
    return { error: "Slug นี้ถูกใช้แล้ว กรุณาเลือกใหม่" }
  }

  const { data: newShop, error: shopError } = await supabase
    .from("shops")
    .insert({
      owner_id: profile.id,
      name: name,
      slug: slug,
      description: description,
      category_id: categoryId,
      contact_phone: phone,
      pickup_address_id: pickupAddressId,
      status: "pending_verification",
      verification_level: "unverified",
      commission_rate: 2.0
    })
    .select("id, slug")
    .single()

  if (shopError) {
    console.error("Create shop error:", shopError)
    return { error: "เกิดข้อผิดพลาด: " + shopError.message }
  }

  const { error: walletError } = await supabase
    .from("shop_wallets")
    .insert({
      shop_id: newShop.id,
      balance: 0,
      pending_balance: 0,
      total_earnings: 0,
      total_withdrawn: 0
    })

  if (walletError) {
    console.error("Create wallet error:", walletError)
  }

  const { error: roleError } = await supabase
    .from("users")
    .update({ 
      role: "shop_owner",
      updated_at: new Date().toISOString()
    })
    .eq("id", profile.id)

  if (roleError) {
    console.error("Update role error:", roleError)
  }

  revalidatePath("/shop/dashboard")
  revalidatePath("/profile")
  revalidatePath("/")

  return { 
    success: true, 
    message: "เปิดร้านค้าสำเร็จ! กำลังพาไปยังแดชบอร์ดร้านค้า...",
    shopSlug: newShop.slug
  }
}