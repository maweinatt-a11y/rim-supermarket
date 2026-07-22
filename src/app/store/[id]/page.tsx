import { Metadata } from "next";
import { supabase } from "@/lib/supabase";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {


  const { id } = await params;


  const { data: store } = await supabase
    .from("stores")
    .select("name, description, image")
    .eq("id", id)
    .single();



  if (!store) {

    return {
      title: "المتجر غير موجود",
      description: "هذا المتجر غير موجود",
    };

  }




  return {

    title: `${store.name} | RIM supermarket`,


    description:
      store.description ||
      `تسوق من متجر ${store.name} في RIM supermarket`,



    openGraph: {

      title: store.name,


      description:
        store.description ||
        `منتجات متجر ${store.name}`,


      images: store.image
        ? [store.image]
        : [],

    },



    twitter: {

      card: "summary_large_image",


      title: store.name,


      description:
        store.description ||
        `منتجات متجر ${store.name}`,


      images: store.image
        ? [store.image]
        : [],

    },

  };

}




export default async function StorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {


  const { id: storeId } = await params;



  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("id", storeId)
    .single();





  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", storeId)
    .order("id", { ascending: false });






  if (!store) {

    return (

      <main className="p-8">

        <h1 className="text-2xl font-bold">
          المتجر غير موجود
        </h1>

      </main>

    );

  }







  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <div className="max-w-6xl mx-auto">





        <div className="bg-white rounded-xl shadow p-6 mb-8">


          {store.image && (

            <img
              src={store.image}
              alt={store.name}
              className="w-32 h-32 rounded-full object-cover mb-4"
            />

          )}





          <h1 className="text-3xl font-bold">
            {store.name}
          </h1>





          <p className="text-gray-600 mt-3">
            {store.description}
          </p>


        </div>







        <h2 className="text-2xl font-bold mb-5">
          المنتجات
        </h2>







        <div className="grid md:grid-cols-3 gap-6">



          {products?.map((product:any)=>(



            <div
              key={product.id}
              className="bg-white rounded-xl shadow overflow-hidden"
            >




              {product.image && (

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-52 object-cover"
                />

              )}






              <div className="p-4">





                <h3 className="text-xl font-bold">
                  {product.name}
                </h3>






                <p className="text-gray-600 mt-2">
                  {product.description}
                </p>






                <p className="font-bold text-green-600 mt-3">
                  {product.price} أوقية
                </p>








                <a
                  href={`https://wa.me/222${store.whatsapp}?text=${encodeURIComponent(
                    `السلام عليكم ورحمة الله وبركاته،

أرغب في طلب المنتج التالي:

🛍️ اسم المنتج: ${product.name}
🏪 المتجر: ${store.name}
💰 السعر: ${product.price} أوقية

هل المنتج متوفر؟
وشكرًا لكم.`
                  )}`}
                  target="_blank"
                  className="block text-center bg-green-600 text-white mt-4 py-3 rounded-lg hover:bg-green-700"
                >
                  طلب عبر واتساب
                </a>





              </div>



            </div>



          ))}



        </div>





      </div>


    </main>

  );

}