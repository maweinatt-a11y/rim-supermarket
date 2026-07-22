import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { count: storesCount } = await supabase
    .from("stores")
    .select("*", { count: "exact", head: true });

  const { count: productsCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  const { count: ownersCount } = await supabase
    .from("store_owners")
    .select("*", { count: "exact", head: true });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          لوحة تحكم المدير
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold">
              المتاجر
            </h2>

            <p className="text-4xl font-bold text-green-600 mt-4">
              {storesCount ?? 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold">
              المنتجات
            </h2>

            <p className="text-4xl font-bold text-blue-600 mt-4">
              {productsCount ?? 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold">
              أصحاب المتاجر
            </h2>

            <p className="text-4xl font-bold text-purple-600 mt-4">
              {ownersCount ?? 0}
            </p>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <Link
            href="/admin/stores"
            className="bg-green-600 text-white text-center rounded-xl p-6 text-xl hover:bg-green-700"
          >
            إدارة المتاجر
          </Link>

          <Link
            href="/admin/users"
            className="bg-blue-600 text-white text-center rounded-xl p-6 text-xl hover:bg-blue-700"
          >
            إدارة المستخدمين
          </Link>

        </div>

      </div>
    </main>
  );
}