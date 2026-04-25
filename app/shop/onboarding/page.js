import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import OnboardingWizard from "./OnboardingWizard"

export default async function ShopOnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/shop/onboarding")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, role")
    .eq("auth_id", user.id)
    .maybeSingle()

  const { data: existingShop } = await supabase
    .from("shops")
    .select("id, slug")
    .eq("owner_id", profile?.id)
    .maybeSingle()

  if (existingShop) {
    redirect("/shop/dashboard")
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

  return <OnboardingWizard categories={categories || []} addresses={addresses || []} />
}