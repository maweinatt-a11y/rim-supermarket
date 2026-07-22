import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function ApproveStoreRequest({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createServerSupabase();

  // التأكد من تسجيل الدخول
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // التأكد أن المستخدم مدير
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // جلب الطلب
  const { data: request } = await supabase
    .from("store_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (!request) {
    redirect("/admin/store-requests");
  }

  // إذا كان الطلب مقبولاً مسبقاً
  if (request.status === "approved") {
    redirect("/admin/store-requests");
  }

  // إنشاء المتجر
  const { data: store, error: storeError } = await supabase
    .from("stores")
    .insert({
      name: request.name,
      description: request.description,
      whatsapp: request.whatsapp,
      image: request.store_image,
      subscription_status: "active",
    })
    .select()
    .single();

  if (storeError) {
    return <pre>{storeError.message}</pre>;
  }

  // ربط صاحب الطلب بالمتجر
  if (request.user_id) {
    const { error: ownerError } = await supabase
      .from("store_owners")
      .insert({
        user_id: request.user_id,
        store_id: store.id,
      });

    if (ownerError) {
      return <pre>{ownerError.message}</pre>;
    }

    // تحديث ملف المستخدم
    await supabase
      .from("profiles")
      .update({
        store_id: store.id,
        role: "seller",
      })
      .eq("id", request.user_id);
  }

  // تحديث حالة الطلب
  await supabase
    .from("store_requests")
    .update({
      status: "approved",
    })
    .eq("id", id);

  redirect("/admin/store-requests");
}