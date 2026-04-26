
"use server"

import { createClient } from "./server"
import { revalidatePath } from "next/cache"

export async function checkSlugAvailable(slug) {
  if (!slug || slug.length < 3) {
    return { available: false, error: "Slug at least 3 chars" }
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { available: false, error: "a-z, 0-9, - only" }
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

  if (!name || name.length < 2) return { error: "ชื่อร้านอย่างน้อย 2 ตัวอักษร" }
  if (name.length > 100) return { error: "ชื่อร้านยาวเกินไป" }
  if (!slug || slug.length < 3) return { error: "Slug อย่างน้อย 3 ตัวอักษร" }
  if (slug.length > 50) return { error: "Slug ยาวเกินไป" }
  if (!/^[a-z0-9-]+$/.test(slug)) return { error: "Slug ใช้ a-z, 0-9, - เท่านั้น" }
  if (!categoryId) return { error: "กรุณาเลือกหมวดหมู่" }
  if (!description || description.length < 10) return { error: "คำอธิบายอย่างน้อย 10 ตัวอักษร" }
  if (description.length > 500) return { error: "คำอธิบายยาวเกินไป" }
  if (!phone || !/^[0-9]{9,10}$/.test(phone.replace(/[-\s]/g, ""))) return { error: "เบอร์โทรไม่ถูกต้อง" }
  if (!pickupAddressId) return { error: "กรุณาเลือกที่อยู่ pickup" }

  const { data: addressCheck } = await supabase
    .from("addresses")
    .select("id")
    .eq("id", pickupAddressId)
    .eq("user_id", profile.id)
    .maybeSingle()

  if (!addressCheck) return { error: "ที่อยู่ที่เลือกไม่ถูกต้อง" }

  const { data: slugCheck } = await supabase
    .from("shops")
    .select("id")
    .eq("slug", slug)
    .maybeSingle()

  if (slugCheck) return { error: "Slug นี้ถูกใช้แล้ว" }

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
      status: "pending",
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
      balance: 0
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
    message: "เปิดร้านค้าสำเร็จ! กำลังพาไปยังแดชบอร์ด...",
    shopSlug: newShop.slug
  }
}

export async function toggleShopStatus(newStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: "กรุณาเข้าสู่ระบบ" }
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .maybeSingle()

  if (!profile) {
    return { error: "ไม่พบข้อมูลผู้ใช้" }
  }

  const allowedStatuses = ["active", "closed"]
  if (!allowedStatuses.includes(newStatus)) {
    return { error: "สถานะไม่ถูกต้อง" }
  }

  const { error: updateError } = await supabase
    .from("shops")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq("owner_id", profile.id)

  if (updateError) {
    console.error("Toggle status error:", updateError)
    return { error: "เกิดข้อผิดพลาด: " + updateError.message }
  }

  revalidatePath("/shop/dashboard")
  revalidatePath("/shop/settings")
  
  return { 
    success: true, 
    message: newStatus === "active" ? "เปิดร้านสำเร็จ! ลูกค้าสามารถซื้อสินค้าได้" : "ปิดร้านชั่วคราวแล้ว"
  }
}



export async function updateShop(formData) {
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

  const name = formData.get("name")?.toString().trim()
  const description = formData.get("description")?.toString().trim()
  const categoryId = formData.get("categoryId")?.toString()
  const phone = formData.get("phone")?.toString().trim()
  const pickupAddressId = formData.get("pickupAddressId")?.toString()

  if (!name || name.length < 2) return { error: "ชื่อร้านอย่างน้อย 2 ตัวอักษร" }
  if (name.length > 100) return { error: "ชื่อร้านยาวเกินไป" }
  if (!categoryId) return { error: "กรุณาเลือกหมวดหมู่" }
  if (!description || description.length < 10) return { error: "คำอธิบายอย่างน้อย 10 ตัวอักษร" }
  if (description.length > 500) return { error: "คำอธิบายยาวเกินไป" }
  if (!phone || !/^[0-9]{9,10}$/.test(phone.replace(/[-\s]/g, ""))) return { error: "เบอร์โทรไม่ถูกต้อง" }
  if (!pickupAddressId) return { error: "กรุณาเลือกที่อยู่ pickup" }

  const { data: addressCheck } = await supabase
    .from("addresses")
    .select("id")
    .eq("id", pickupAddressId)
    .eq("user_id", profile.id)
    .maybeSingle()

  if (!addressCheck) return { error: "ที่อยู่ที่เลือกไม่ถูกต้อง" }

  const { error: updateError } = await supabase
    .from("shops")
    .update({
      name: name,
      description: description,
      category_id: categoryId,
      contact_phone: phone,
      pickup_address_id: pickupAddressId,
      updated_at: new Date().toISOString()
    })
    .eq("id", shop.id)
    .eq("owner_id", profile.id)

  if (updateError) {
    console.error("Update shop error:", updateError)
    return { error: "เกิดข้อผิดพลาด: " + updateError.message }
  }

  revalidatePath("/shop/dashboard")
  revalidatePath("/shop/settings")
  
  return { success: true, message: "บันทึกการเปลี่ยนแปลงสำเร็จ!" }
}
