import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import EditShopForm from "./EditShopForm"

export default async function ShopSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/shop/settings")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .maybeSingle()

  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("owner_id", profile?.id)
    .maybeSingle()

  if (!shop) {
    redirect("/shop/onboarding")
  }

  const { data: categories } = await supabase
    .from("shop_categories")
    .select("id, name, name_en, icon")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", profile?.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })

  return <EditShopForm shop={shop} categories={categories || []} addresses={addresses || []} />
}