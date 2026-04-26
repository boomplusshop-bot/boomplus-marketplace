"use server"

import { createClient } from "./server"
import { revalidatePath } from "next/cache"

async function getOwnerShop() {
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
    .select("id, status")
    .eq("owner_id", profile.id)
    .maybeSingle()

  if (!shop) return { error: "ไม่พบร้านค้า กรุณาเปิดร้านก่อน" }

  return { supabase, user, profile, shop }
}

function generateSlug(name) {
  const timestamp = Date.now().toString().slice(-6)
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9\u0E00-\u0E7F\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 50)
  return cleanName + "-" + timestamp
}

export async function createProduct(formData) {
  const ctx = await getOwnerShop()
  if (ctx.error) return { error: ctx.error }

  const name = formData.get("name")?.toString().trim()
  const description = formData.get("description")?.toString().trim()
  const shortDescription = formData.get("shortDescription")?.toString().trim()
  const categoryId = formData.get("categoryId")?.toString()
  const price = parseFloat(formData.get("price")?.toString() || "0")
  const originalPrice = parseFloat(formData.get("originalPrice")?.toString() || "0")
  const stock = parseInt(formData.get("stock")?.toString() || "0")
  const thumbnailUrl = formData.get("thumbnailUrl")?.toString().trim()
  const action = formData.get("action")?.toString() || "draft"

  if (!name || name.length < 2) return { error: "ชื่อสินค้าอย่างน้อย 2 ตัวอักษร" }
  if (name.length > 200) return { error: "ชื่อสินค้ายาวเกินไป" }
  if (!categoryId) return { error: "กรุณาเลือกหมวดหมู่" }
  if (price <= 0) return { error: "ราคาต้องมากกว่า 0" }
  if (price > 1000000) return { error: "ราคาสูงเกินไป" }
  if (stock < 0) return { error: "สต็อกต้องไม่ติดลบ" }
  if (!description || description.length < 10) return { error: "คำอธิบายอย่างน้อย 10 ตัวอักษร" }

  const slug = generateSlug(name)
  const status = action === "publish" ? "active" : "draft"

  const productData = {
    shop_id: ctx.shop.id,
    category_id: categoryId,
    name: name,
    slug: slug,
    description: description,
    short_description: shortDescription || null,
    price: price,
    original_price: originalPrice > price ? originalPrice : null,
    stock: stock,
    thumbnail_url: thumbnailUrl || null,
    images: thumbnailUrl ? [thumbnailUrl] : [],
    status: status,
    is_cod_allowed: true,
    is_pickup_allowed: true,
    has_variants: false,
    is_on_sale: originalPrice > price,
    published_at: status === "active" ? new Date().toISOString() : null
  }

  const { data: newProduct, error } = await ctx.supabase
    .from("products")
    .insert(productData)
    .select("id, slug")
    .single()

  if (error) {
    console.error("Create product error:", error)
    return { error: "เกิดข้อผิดพลาด: " + error.message }
  }

  revalidatePath("/shop/products")
  revalidatePath("/shop/dashboard")

  return { 
    success: true, 
    message: status === "active" ? "เพิ่มสินค้าและเปิดขายสำเร็จ!" : "บันทึกแบบร่างสำเร็จ!",
    productId: newProduct.id,
    slug: newProduct.slug
  }
}

export async function updateProduct(productId, formData) {
  const ctx = await getOwnerShop()
  if (ctx.error) return { error: ctx.error }

  const { data: existing } = await ctx.supabase
    .from("products")
    .select("id, status")
    .eq("id", productId)
    .eq("shop_id", ctx.shop.id)
    .maybeSingle()

  if (!existing) return { error: "ไม่พบสินค้า" }

  const name = formData.get("name")?.toString().trim()
  const description = formData.get("description")?.toString().trim()
  const shortDescription = formData.get("shortDescription")?.toString().trim()
  const categoryId = formData.get("categoryId")?.toString()
  const price = parseFloat(formData.get("price")?.toString() || "0")
  const originalPrice = parseFloat(formData.get("originalPrice")?.toString() || "0")
  const stock = parseInt(formData.get("stock")?.toString() || "0")
  const thumbnailUrl = formData.get("thumbnailUrl")?.toString().trim()
  const action = formData.get("action")?.toString() || existing.status

  if (!name || name.length < 2) return { error: "ชื่อสินค้าอย่างน้อย 2 ตัวอักษร" }
  if (!categoryId) return { error: "กรุณาเลือกหมวดหมู่" }
  if (price <= 0) return { error: "ราคาต้องมากกว่า 0" }
  if (stock < 0) return { error: "สต็อกต้องไม่ติดลบ" }
  if (!description || description.length < 10) return { error: "คำอธิบายอย่างน้อย 10 ตัวอักษร" }

  let newStatus = existing.status
  if (action === "publish") newStatus = "active"
  else if (action === "draft") newStatus = "draft"
  else if (action === "hide") newStatus = "hidden"

  const updateData = {
    name: name,
    description: description,
    short_description: shortDescription || null,
    category_id: categoryId,
    price: price,
    original_price: originalPrice > price ? originalPrice : null,
    stock: stock,
    thumbnail_url: thumbnailUrl || null,
    images: thumbnailUrl ? [thumbnailUrl] : [],
    status: newStatus,
    is_on_sale: originalPrice > price,
    published_at: newStatus === "active" && !existing.status === "active" 
      ? new Date().toISOString() 
      : undefined,
    updated_at: new Date().toISOString()
  }

  if (updateData.published_at === undefined) {
    delete updateData.published_at
  }

  const { error } = await ctx.supabase
    .from("products")
    .update(updateData)
    .eq("id", productId)
    .eq("shop_id", ctx.shop.id)

  if (error) {
    console.error("Update product error:", error)
    return { error: "เกิดข้อผิดพลาด: " + error.message }
  }

  revalidatePath("/shop/products")
  revalidatePath("/shop/dashboard")

  return { 
    success: true, 
    message: "อัปเดตสินค้าสำเร็จ!"
  }
}

export async function deleteProduct(productId) {
  const ctx = await getOwnerShop()
  if (ctx.error) return { error: ctx.error }

  const { error } = await ctx.supabase
    .from("products")
    .update({ 
      status: "deleted",
      updated_at: new Date().toISOString()
    })
    .eq("id", productId)
    .eq("shop_id", ctx.shop.id)

  if (error) {
    console.error("Delete product error:", error)
    return { error: "เกิดข้อผิดพลาด: " + error.message }
  }

  revalidatePath("/shop/products")

  return { success: true, message: "ลบสินค้าสำเร็จ" }
}

export async function uploadProductImage(file) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: "กรุณาเข้าสู่ระบบ" }

  const fileExt = file.name.split('.').pop().toLowerCase()
  const allowedExts = ['jpg', 'jpeg', 'png', 'webp']
  
  if (!allowedExts.includes(fileExt)) {
    return { error: "รองรับเฉพาะ JPG, PNG, WEBP" }
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "ขนาดไฟล์ต้องไม่เกิน 5 MB" }
  }

  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const filePath = user.id + "/product_" + timestamp + "_" + random + "." + fileExt

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false
    })

  if (uploadError) {
    console.error("Upload error:", uploadError)
    return { error: "อัปโหลดไม่สำเร็จ: " + uploadError.message }
  }

  const { data: publicUrl } = supabase.storage
    .from("products")
    .getPublicUrl(filePath)

  return { 
    success: true, 
    url: publicUrl.publicUrl,
    path: filePath
  }
}