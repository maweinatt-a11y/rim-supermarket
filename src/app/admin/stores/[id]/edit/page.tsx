"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

export default function EditStorePage() {

  const params = useParams();
  const router = useRouter();

  const storeId = Number(params.id);


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");



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



    if(storeId){

      loadStore();

    }

  }






  async function loadStore(){

    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("id", storeId)
      .single();



    if(error){

      setMessage(error.message);
      return;

    }



    setName(data.name);
    setDescription(data.description || "");
    setWhatsapp(data.whatsapp || "");
    setCurrentImage(data.image || "");

  }








  async function updateStore(e: React.FormEvent){

    e.preventDefault();

    setLoading(true);



    let imageUrl = currentImage;



    if(image){


      const extension = image.name.split(".").pop();


      const fileName =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;



      const { error: uploadError } =
        await supabase.storage
        .from("store-images")
        .upload(fileName, image);



      if(uploadError){

        setMessage(uploadError.message);
        setLoading(false);
        return;

      }



      imageUrl =
        supabase.storage
        .from("store-images")
        .getPublicUrl(fileName)
        .data
        .publicUrl;

    }






    const { error } = await supabase
      .from("stores")
      .update({

        name,
        description,
        whatsapp,
        image:imageUrl

      })
      .eq("id",storeId);




    if(error){

      setMessage(error.message);

    }else{

      router.push(`/admin/stores/${storeId}/products`);
      router.refresh();

    }



    setLoading(false);

  }







  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">


        <h1 className="text-3xl font-bold mb-6">
          تعديل المتجر
        </h1>



        <form
          onSubmit={updateStore}
          className="space-y-4"
        >



          {currentImage && (

            <img
              src={currentImage}
              className="w-32 h-32 rounded-full object-cover"
              alt="store"
            />

          )}






          <input
            type="file"
            accept="image/*"
            onChange={(e)=>
              setImage(e.target.files?.[0] || null)
            }
            className="border p-3 rounded w-full"
          />






          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder="اسم المتجر"
            className="border p-3 rounded w-full"
          />






          <textarea
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            placeholder="وصف المتجر"
            className="border p-3 rounded w-full"
          />






          <input
            value={whatsapp}
            onChange={(e)=>setWhatsapp(e.target.value)}
            placeholder="رقم واتساب بدون +222"
            className="border p-3 rounded w-full"
          />







          <button
            disabled={loading}
            className="bg-green-600 text-white w-full p-3 rounded"
          >

            {loading ? "جاري الحفظ..." : "حفظ التعديلات"}

          </button>



        </form>





        <p className="text-red-600 mt-4">
          {message}
        </p>



      </div>


    </main>

  );

}