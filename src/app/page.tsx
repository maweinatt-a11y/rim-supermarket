import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function Home() {

  const { data: stores, error } = await supabase
    .from("stores")
    .select("*")
    .order("created_at", { ascending: false });



  return (

    <main className="min-h-screen bg-gray-100">


      <header className="bg-green-600 text-white p-6">


        <div className="max-w-7xl mx-auto">


          <h1 className="text-3xl font-bold">
            RIM Supermarket
          </h1>



          <p className="mt-2">
            سوق إلكتروني يجمع المتاجر والمنتجات في مكان واحد
          </p>




          <Link
            href="/create-store"
            className="inline-block mt-5 bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
          >
            إنشاء متجر جديد
          </Link>



        </div>


      </header>






      <section className="p-6 text-center">


        <input

          className="w-full max-w-xl p-3 rounded border"

          placeholder="ابحث عن منتج أو متجر..."

        />


      </section>








      <section className="p-6">


        <div className="max-w-7xl mx-auto">


          <h2 className="text-2xl font-bold mb-5">
            المتاجر
          </h2>





          {error && (

            <div className="bg-red-100 p-4 rounded">

              حدث خطأ في الاتصال بقاعدة البيانات

            </div>

          )}







          {!stores || stores.length === 0 ? (


            <div className="bg-white p-5 rounded shadow">

              لا توجد متاجر حاليا

            </div>



          ) : (



            <div className="grid gap-5 md:grid-cols-3">





              {stores.map((store:any)=>(



                <Link

                  key={store.id}

                  href={`/store/${store.id}`}

                  className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition"

                >





                  {store.image && (


                    <img

                      src={store.image}

                      alt={store.name}

                      className="w-full h-48 object-cover"

                    />


                  )}







                  <div className="p-5">





                    <h3 className="text-xl font-bold">

                      {store.name}

                    </h3>






                    <p className="mt-2 text-gray-600">

                      {store.description}

                    </p>






                    <p className="mt-4 text-green-600 font-bold">

                      عرض المتجر

                    </p>





                  </div>





                </Link>



              ))}





            </div>



          )}



        </div>



      </section>



    </main>

  );

}