import { redirect } from "next/navigation"
import { getVerification } from "@/lib/supabase/verification-actions"
import { createClient } from "@/lib/supabase/server"
import VerificationForm from "./VerificationForm"

export default async function VerificationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/shop/verification")
  }

  const result = await getVerification()

  if (!result) {
    redirect("/shop/onboarding")
  }

  return (
    <VerificationForm 
      initialData={result.verification} 
      shopId={result.shopId}
      userId={result.userId}
    />
  )
}