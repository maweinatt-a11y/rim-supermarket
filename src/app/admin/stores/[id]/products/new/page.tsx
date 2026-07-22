"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";

export default function NewProductPage() {

  const router = useRouter();
  const params = useParams();

  const storeId = Number(params.id);


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [checking, setChecking] = useState(true);




  useEffect(() => {

    checkAdmin();

  }, []);





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



    setChecking(false);

  }







  async function createProduct(e: React.FormEvent) {

    e.preventDefault();



    if (!storeId) {

      setMessage("لم يتم العثور على معرف المتجر.");
      return;

    }



    setLoading(true);
    setMessage("");



    let imageUrl = "";



    if (image) {


      const extension = image.name.split(".").pop();


      const fileName =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;



      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, image, {
          upsert: true,
        });



      if (uploadError) {

        console.error(uploadError);

        setMessage(uploadError.message);

        setLoading(false);

        return;

      }



      imageUrl =
        supabase.storage
        .from("product-images")
        .getPublicUrl(fileName)
        .data
        .publicUrl;

    }







    const { error } = await supabase
      .from("products")
      .insert({

        store_id: storeId,

        name,

        description,

        price: Number(price),

        image: imageUrl,

      });





    if (error) {

      console.error(error);

      setMessage(error.message);


    } else {


      alert("تم إضافة المنتج بنجاح");


      router.push(`/admin/stores/${storeId}/products`);

      router.refresh();


    }



    setLoading(false);

  }







  if(checking){

    return (

      <main className="min-h-screen flex items-center justify-center">

        <p>
          جاري التحقق من الصلاحيات...
        </p>

      </main>

    );

  }







  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">


        <h1 className="text-3xl font-bold mb-6">
          إضافة منتج
        </h1>



        <form
          onSubmit={createProduct}
          className="space-y-4"
        >


          <input
            type="file"
            accept="image/*"
            onChange={(e)=>
              setImage(e.target.files?.[0] || null)
            }
            className="border p-3 rounded w-full"
            required
          />



          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder="اسم المنتج"
            className="border p-3 rounded w-full"
            required
          />



          <textarea
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            placeholder="وصف المنتج"
            className="border p-3 rounded w-full"
          />



          <input
            type="number"
            value={price}
            onChange={(e)=>setPrice(e.target.value)}
            placeholder="السعر"
            className="border p-3 rounded w-full"
            required
          />





          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white w-full p-3 rounded disabled:opacity-50"
          >

            {loading ? "جاري الإضافة..." : "إضافة المنتج"}

          </button>



        </form>





        {message && (

          <p className="mt-4 text-red-600">

            {message}

          </p>

        )}



      </div>


    </main>

  );

}