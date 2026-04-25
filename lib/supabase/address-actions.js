"use server"

import { createClient } from "./server"
import { revalidatePath } from "next/cache"

export async function createAddress(formData) {
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

  const label = formData.get("label")?.toString().trim() || null
  const recipientName = formData.get("recipientName")?.toString().trim()
  const recipientPhone = formData.get("recipientPhone")?.toString().trim()
  const addressLine = formData.get("addressLine")?.toString().trim()
  const subdistrict = formData.get("subdistrict")?.toString().trim()
  const district = formData.get("district")?.toString().trim()
  const province = formData.get("province")?.toString().trim()
  const postalCode = formData.get("postalCode")?.toString().trim()
  const isDefault = formData.get("isDefault") === "on"
  const isPickup = formData.get("isPickup") === "on"

  if (!recipientName || recipientName.length < 2) {
    return { error: "กรุณากรอกชื่อผู้รับ" }
  }
  if (!recipientPhone || !/^[0-9]{9,10}$/.test(recipientPhone.replace(/[-\s]/g, ""))) {
    return { error: "เบอร์โทรไม่ถูกต้อง (ต้องเป็นตัวเลข 9-10 หลัก)" }
  }
  if (!addressLine || addressLine.length < 5) {
    return { error: "กรุณากรอกที่อยู่อย่างน้อย 5 ตัวอักษร" }
  }
  if (!subdistrict) return { error: "กรุณากรอกตำบล/แขวง" }
  if (!district) return { error: "กรุณากรอกอำเภอ/เขต" }
  if (!province) return { error: "กรุณากรอกจังหวัด" }
  if (!postalCode || !/^[0-9]{5}$/.test(postalCode)) {
    return { error: "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก" }
  }

  if (isDefault) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", profile.id)
  }

  const { error } = await supabase
    .from("addresses")
    .insert({
      user_id: profile.id,
      label: label,
      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      address_line: addressLine,
      subdistrict: subdistrict,
      district: district,
      province: province,
      postal_code: postalCode,
      country: "TH",
      is_default: isDefault,
      is_pickup_address: isPickup
    })

  if (error) {
    console.error("Create address error:", error)
    return { error: "เกิดข้อผิดพลาด: " + error.message }
  }

  revalidatePath("/addresses")
  return { success: true, message: "เพิ่มที่อยู่สำเร็จ!" }
}

export async function updateAddress(addressId, formData) {
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

  const label = formData.get("label")?.toString().trim() || null
  const recipientName = formData.get("recipientName")?.toString().trim()
  const recipientPhone = formData.get("recipientPhone")?.toString().trim()
  const addressLine = formData.get("addressLine")?.toString().trim()
  const subdistrict = formData.get("subdistrict")?.toString().trim()
  const district = formData.get("district")?.toString().trim()
  const province = formData.get("province")?.toString().trim()
  const postalCode = formData.get("postalCode")?.toString().trim()
  const isDefault = formData.get("isDefault") === "on"
  const isPickup = formData.get("isPickup") === "on"

  if (!recipientName || recipientName.length < 2) return { error: "กรุณากรอกชื่อผู้รับ" }
  if (!recipientPhone || !/^[0-9]{9,10}$/.test(recipientPhone.replace(/[-\s]/g, ""))) {
    return { error: "เบอร์โทรไม่ถูกต้อง" }
  }
  if (!addressLine || addressLine.length < 5) return { error: "กรุณากรอกที่อยู่" }
  if (!subdistrict) return { error: "กรุณากรอกตำบล/แขวง" }
  if (!district) return { error: "กรุณากรอกอำเภอ/เขต" }
  if (!province) return { error: "กรุณากรอกจังหวัด" }
  if (!postalCode || !/^[0-9]{5}$/.test(postalCode)) {
    return { error: "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก" }
  }

  if (isDefault) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", profile.id)
      .neq("id", addressId)
  }

  const { error } = await supabase
    .from("addresses")
    .update({
      label: label,
      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      address_line: addressLine,
      subdistrict: subdistrict,
      district: district,
      province: province,
      postal_code: postalCode,
      is_default: isDefault,
      is_pickup_address: isPickup,
      updated_at: new Date().toISOString()
    })
    .eq("id", addressId)
    .eq("user_id", profile.id)

  if (error) {
    console.error("Update address error:", error)
    return { error: "เกิดข้อผิดพลาด: " + error.message }
  }

  revalidatePath("/addresses")
  return { success: true, message: "บันทึกการเปลี่ยนแปลงสำเร็จ!" }
}

export async function deleteAddress(addressId) {
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

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", profile.id)

  if (error) {
    console.error("Delete address error:", error)
    return { error: "เกิดข้อผิดพลาด: " + error.message }
  }

  revalidatePath("/addresses")
  return { success: true, message: "ลบที่อยู่สำเร็จ" }
}

export async function setDefaultAddress(addressId) {
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

  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", profile.id)

  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("user_id", profile.id)

  if (error) {
    return { error: "เกิดข้อผิดพลาด: " + error.message }
  }

  revalidatePath("/addresses")
  return { success: true, message: "ตั้งเป็นที่อยู่หลักแล้ว" }
}