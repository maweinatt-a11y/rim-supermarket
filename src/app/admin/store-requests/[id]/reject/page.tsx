import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function RejectStoreRequest({
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

  // تحديث حالة الطلب إلى مرفوض
  const { error } = await supabase
    .from("store_requests")
    .update({
      status: "rejected",
    })
    .eq("id", id);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow rounded-xl p-6">
          <h1 className="text-xl font-bold text-red-600">
            حدث خطأ
          </h1>

          <p className="mt-4">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  redirect("/admin/store-requests");
}