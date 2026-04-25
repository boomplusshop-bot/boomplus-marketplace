import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import EditForm from "./EditForm"

export default async function EditProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/profile/edit")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("username, full_name, bio, phone, email")
    .eq("auth_id", user.id)
    .maybeSingle()

  if (!profile) {
    redirect("/profile")
  }

  return <EditForm initialProfile={profile} />
}