import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AddProductForm from "./AddProductForm"

export default async function AddProductPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/shop/products/new")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .maybeSingle()

  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", profile?.id)
    .maybeSingle()

  if (!shop) {
    redirect("/shop/onboarding")
  }

  const { data: categories } = await supabase
    .from("product_categories")
    .select("id, name, name_en, icon")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  return <AddProductForm categories={categories || []} />
}