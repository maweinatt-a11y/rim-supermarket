import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";


export default async function AdminPage() {


  const supabase = await createServerSupabase();



  const {
    data: { user }
  } = await supabase.auth.getUser();



  console.log("ADMIN PAGE USER:", user);



  if (!user) {

    redirect("/login");

  }




  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();




  console.log("ADMIN CHECK:", {
    userId: user.id,
    profile,
    error
  });






  if (error || profile?.role !== "admin") {

    console.log("NOT ADMIN - REDIRECT DASHBOARD");

    redirect("/dashboard");

  }






  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        لوحة الإدارة
      </h1>



      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">



        <a
          href="/admin/stores"
          className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
        >

          <h2 className="text-2xl font-bold">
            🏪 المتاجر
          </h2>

          <p className="mt-3 text-gray-600">
            إدارة جميع المتاجر
          </p>

        </a>





        <a
          href="/admin/products"
          className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
        >

          <h2 className="text-2xl font-bold">
            📦 المنتجات
          </h2>

          <p className="mt-3 text-gray-600">
            إدارة المنتجات
          </p>

        </a>





        <a
          href="/admin/orders"
          className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
        >

          <h2 className="text-2xl font-bold">
            🛒 الطلبات
          </h2>

          <p className="mt-3 text-gray-600">
            متابعة الطلبات
          </p>

        </a>





        <a
          href="/admin/subscriptions"
          className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
        >

          <h2 className="text-2xl font-bold">
            💳 الاشتراكات
          </h2>

          <p className="mt-3 text-gray-600">
            إدارة اشتراكات المتاجر
          </p>

        </a>



      </div>


    </main>
  );
}