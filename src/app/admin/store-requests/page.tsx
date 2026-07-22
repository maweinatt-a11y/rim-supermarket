import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function StoreRequestsPage() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("STORE REQUEST USER:", user);
  console.log("CURRENT USER ID:", user?.id);


  if (!user) {
    redirect("/login");
  }


  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();


  console.log("STORE REQUEST PROFILE:", profile);
  console.log("CURRENT PROFILE:", profile);
  console.log("STORE REQUEST PROFILE ERROR:", profileError);


  console.log("ADMIN ROLE CHECK:", {
    userId: user.id,
    profile,
    profileError,
    role: profile?.role,
  });



  if (profileError || profile?.role !== "admin") {

    console.log("ADMIN CHECK FAILED - REDIRECT DASHBOARD");

    redirect("/dashboard");

  }



  const { data: requests, error } = await supabase
    .from("store_requests")
    .select("*")
    .order("created_at", { ascending: false });



  console.log("REQUESTS:", requests);
  console.log("REQUEST COUNT:", requests?.length);
  console.log("REQUESTS ERROR:", error);



  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          طلبات إنشاء المتاجر
        </h1>


        <div className="grid md:grid-cols-3 gap-6">

          {requests?.map((item: any) => (

            <div
              key={item.id}
              className="bg-white rounded-xl shadow p-5"
            >

              {item.store_image && (

                <img
                  src={item.store_image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded"
                />

              )}


              <h2 className="text-xl font-bold mt-4">
                {item.name}
              </h2>


              <p className="mt-2 text-gray-600">
                {item.description}
              </p>


              <p className="mt-3">
                <strong>واتساب:</strong> {item.whatsapp}
              </p>


              {item.payment_image && (

                <a
                  href={item.payment_image}
                  target="_blank"
                  className="text-blue-600 block mt-3"
                >
                  مشاهدة إثبات الدفع
                </a>

              )}


              <p className="mt-4">
                الحالة: <strong>{item.status}</strong>
              </p>


              {item.status === "pending" && (

                <div className="flex gap-3 mt-5">

                  <Link
                    href={`/admin/store-requests/${item.id}/approve`}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    قبول
                  </Link>


                  <Link
                    href={`/admin/store-requests/${item.id}/reject`}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    رفض
                  </Link>

                </div>

              )}


            </div>

          ))}

        </div>

      </div>
    </main>
  );
}