"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

export default function DeleteProductPage() {

  const params = useParams();
  const router = useRouter();

  const productId = Number(params.productId);


  const [storeId, setStoreId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);



  useEffect(() => {

    checkAdmin();

  }, [productId]);





  async function checkAdmin(){

    const {
      data:{user}
    } = await supabase.auth.getUser();



    if(!user){

      router.push("/login");
      return;

    }



    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();



    if(profile?.role !== "admin"){

      router.push("/dashboard");
      return;

    }



    if(productId){

      loadProduct();

    }

  }







  async function loadProduct() {

    const { data, error } = await supabase
      .from("products")
      .select("id,name,store_id")
      .eq("id", productId)
      .maybeSingle();



    if (error) {

      console.log("LOAD ERROR:", error);
      setLoaded(true);
      return;

    }



    if (data) {

      console.log("PRODUCT FOUND:", data);
      console.log("STORE ID:", data.store_id);

      setName(data.name);
      setStoreId(Number(data.store_id));

    } else {

      console.log("PRODUCT NOT FOUND");

    }


    setLoaded(true);

  }








  async function deleteProduct() {


    if (!storeId) {

      alert("رقم المتجر غير موجود");
      return;

    }



    setLoading(true);



    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);



    if (error) {

      console.log("DELETE ERROR:", error);
      alert(error.message);

      setLoading(false);
      return;

    }



    alert("تم حذف المنتج بنجاح");


    router.replace(`/admin/stores/${storeId}/products`);
    router.refresh();


  }







  return (

    <main className="min-h-screen bg-gray-100 flex items-center justify-center">


      <div className="bg-white p-8 rounded-xl shadow w-[450px]">


        <h1 className="text-2xl font-bold mb-6">
          حذف المنتج
        </h1>



        <p className="mb-8">

          هل تريد حذف المنتج

          <strong> {name} </strong>

          ؟

        </p>




        <div className="flex gap-4">


          <button
            onClick={deleteProduct}
            disabled={loading || !loaded || !storeId}
            className="bg-red-600 text-white px-6 py-3 rounded disabled:opacity-50"
          >

            {loading ? "جاري الحذف..." : "حذف"}

          </button>





          <button
            onClick={() => router.back()}
            className="bg-gray-300 px-6 py-3 rounded"
          >

            إلغاء

          </button>



        </div>


      </div>


    </main>

  );

}