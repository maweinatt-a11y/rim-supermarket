import { supabase } from "@/lib/supabase";

export async function checkAdmin() {

  const {
    data: { user }
  } = await supabase.auth.getUser();


  if (!user) {
    return false;
  }


  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();


  return profile?.role === "admin";

}