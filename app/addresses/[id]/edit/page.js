import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import AddressForm from "../../AddressForm"

export default async function EditAddressPage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/addresses")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .maybeSingle()

  const { data: address } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", id)
    .eq("user_id", profile?.id)
    .maybeSingle()

  if (!address) {
    notFound()
  }

  return <AddressForm initialData={address} addressId={id} />
}