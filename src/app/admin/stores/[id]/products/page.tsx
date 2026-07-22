import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export default async function ProductsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {


  const cookieStore = await cookies();


  const supabase = createServerClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    {
      cookies: {

        getAll() {

          return cookieStore.getAll();

        },

        setAll(cookiesToSet) {

          cookiesToSet.forEach(({ name, value, options }) => {

            cookieStore.set(
              name,
              value,
              options
            );

          });

        },

      },
    }

  );



  const {
    data: { user }
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



  const { id } = await params;



  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("id", id)
    .single();



  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", id)
    .order("id", { ascending: false});



  return (

    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-6xl mx-auto">


        <div className="flex justify-between items-center mb-6">

          <div>

            <h1 className="text-3xl font-bold">
              {store?.name}
            </h1>

            <p className="text-gray-500">
              إدارة المنتجات
            </p>

          </div>


          <div className="flex gap-3">


            <Link
              href={`/admin/stores/${id}/edit`}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg"
            >
              تعديل المتجر
            </Link>


            <Link
              href={`/admin/stores/${id}/products/new`}
              className="bg-green-600 text-white px-5 py-3 rounded-lg"
            >
              + إضافة منتج
            </Link>


          </div>

        </div>



        <div className="grid md:grid-cols-3 gap-5">


          {products?.map((product:any)=>(


            <div
              key={product.id}
              className="bg-white rounded-xl shadow overflow-hidden"
            >


              {product.image && (

                <img
                  src={product.image}
                  className="w-full h-52 object-cover"
                  alt={product.name}
                />

              )}


              <div className="p-4">


                <h2 className="font-bold text-xl">
                  {product.name}
                </h2>


                <p className="text-gray-500 mt-2">
                  {product.description}
                </p>


                <p className="font-bold text-green-600 mt-3">
                  {product.price} أوقية
                </p>


                <div className="flex gap-3 mt-5">


                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    تعديل
                  </Link>


                  <Link
                    href={`/admin/products/${product.id}/delete`}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    حذف
                  </Link>


                </div>


              </div>


            </div>


          ))}


        </div>


      </div>


    </main>

  );

}