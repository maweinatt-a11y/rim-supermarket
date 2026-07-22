"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DashboardPage() {

  const [store, setStore] = useState<any>(null);
  const [message, setMessage] = useState("");



  useEffect(() => {
    loadStore();
  }, []);




  async function loadStore() {


    const {
      data: { user },
    } = await supabase.auth.getUser();



    if (!user) {

      window.location.href = "/login";
      return;

    }




    const { data: owners, error: ownerError } = await supabase
      .from("store_owners")
      .select("store_id")
      .eq("user_id", user.id);



    if (ownerError) {

      setMessage(ownerError.message);
      return;

    }



    if (!owners || owners.length === 0) {

      setMessage("لا يوجد متجر مرتبط بهذا الحساب");
      return;

    }




    // يأخذ أول متجر فقط للحساب
    const storeId = owners[0].store_id;




    const { data: storeData, error: storeError } = await supabase
      .from("stores")
      .select("*")
      .eq("id", storeId)
      .single();



    if (storeError) {

      setMessage(storeError.message);
      return;

    }



    setStore(storeData);

  }






  async function logout() {

    await supabase.auth.signOut();

    window.location.href = "/login";

  }






  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">



        <div className="flex justify-between items-center mb-8">


          <div>

            <h1 className="text-3xl font-bold">
              لوحة البائع
            </h1>


            <p className="text-gray-500 mt-2">
              إدارة متجرك ومنتجاتك
            </p>

          </div>



          <button
            onClick={logout}
            className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
          >
            تسجيل الخروج
          </button>


        </div>





        {store ? (

          <>


            <div className="flex items-center gap-6">


              <img

                src={
                  store.image ||
                  "https://placehold.co/150x150?text=Store"
                }

                alt={store.name}

                className="w-32 h-32 rounded-full object-cover border"

              />



              <div>


                <h2 className="text-3xl font-bold">
                  {store.name}
                </h2>



                <p className="text-gray-600 mt-3">
                  {store.description}
                </p>



                <p className="mt-3 font-semibold">
                  واتساب: +222 {store.whatsapp}
                </p>



              </div>


            </div>





            <div className="grid md:grid-cols-3 gap-4 mt-10">



              <Link

                href="/dashboard/store/edit"

                className="bg-blue-600 text-white text-center py-4 rounded-lg hover:bg-blue-700"

              >

                ✏️ تعديل المتجر

              </Link>





              <Link

                href="/dashboard/products"

                className="bg-green-600 text-white text-center py-4 rounded-lg hover:bg-green-700"

              >

                📦 إدارة المنتجات

              </Link>





              <Link

                href="/dashboard/products/new"

                className="bg-purple-600 text-white text-center py-4 rounded-lg hover:bg-purple-700"

              >

                ➕ إضافة منتج

              </Link>



            </div>



          </>



        ) : (


          <div className="text-center py-10 text-red-600">

            {message || "جاري تحميل بيانات المتجر..."}

          </div>


        )}



      </div>


    </main>

  );

}