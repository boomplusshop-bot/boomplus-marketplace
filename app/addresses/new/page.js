import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AddressForm from "../AddressForm"

export default async function NewAddressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/addresses/new")
  }

  return <AddressForm />
}