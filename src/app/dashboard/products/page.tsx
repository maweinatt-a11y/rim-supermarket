"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardProductsPage() {


  const [products, setProducts] = useState<any[]>([]);
  const [storeId, setStoreId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    loadProducts();

  }, []);





  async function loadProducts(){


    const {
      data:{user}
    } = await supabase.auth.getUser();



    if(!user){

      window.location.href="/login";
      return;

    }




    const { data: owner } = await supabase
      .from("store_owners")
      .select("store_id")
      .eq("user_id", user.id)
      .maybeSingle();




    if(!owner){

      setLoading(false);
      return;

    }



    setStoreId(owner.store_id);




    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", owner.store_id)
      .order("id", { ascending:false });




    setProducts(data || []);

    setLoading(false);


  }






  if(loading){

    return (

      <main className="p-8">

        جاري تحميل المنتجات...

      </main>

    );

  }







  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <div className="max-w-6xl mx-auto">



        <div className="flex justify-between items-center mb-6">


          <h1 className="text-3xl font-bold">

            منتجات متجري

          </h1>




          <a
            href="/dashboard/products/new"
            className="bg-green-600 text-white px-5 py-3 rounded"
          >

            + إضافة منتج

          </a>


        </div>






        {products.length === 0 ? (


          <div className="bg-white p-6 rounded shadow">

            لا توجد منتجات

          </div>



        ) : (



          <div className="grid md:grid-cols-3 gap-5">


            {products.map((product)=>(



              <div
                key={product.id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >



                {product.image && (

                  <img
                    src={product.image}
                    className="w-full h-48 object-cover"
                    alt={product.name}
                  />

                )}




                <div className="p-4">


                  <h2 className="text-xl font-bold">

                    {product.name}

                  </h2>




                  <p className="text-gray-600 mt-2">

                    {product.description}

                  </p>




                  <p className="font-bold text-green-600 mt-3">

                    {product.price} أوقية

                  </p>





                  <div className="flex gap-3 mt-5">


                    <a
                      href={`/dashboard/products/${product.id}/edit`}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >

                      تعديل

                    </a>




                    <a
                      href={`/dashboard/products/${product.id}/delete`}
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >

                      حذف

                    </a>


                  </div>



                </div>


              </div>



            ))}



          </div>



        )}



      </div>


    </main>

  );

}