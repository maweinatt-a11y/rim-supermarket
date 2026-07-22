"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function StoreSettings() {

  const [storeId, setStoreId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState("");

  const [message, setMessage] = useState("");



  useEffect(() => {
    loadStore();
  }, []);



  async function loadStore() {

    const { data:{user} } = await supabase.auth.getUser();

    if(!user) return;


    const { data: profile } = await supabase
      .from("profiles")
      .select("store_id")
      .eq("id", user.id)
      .single();


    if(profile?.store_id){

      setStoreId(profile.store_id);


      const { data: store } = await supabase
        .from("stores")
        .select("*")
        .eq("id", profile.store_id)
        .single();


      if(store){

        setName(store.name || "");
        setDescription(store.description || "");
        setWhatsapp(store.whatsapp || "");
        setCurrentImage(store.image || "");

      }

    }

  }





  async function saveStore(e:React.FormEvent){

    e.preventDefault();


    if(!storeId) return;


    let imageUrl = currentImage;



    if(image){

      const safeName = image.name.replace(/\s+/g,"-");

      const fileName = `${Date.now()}-${safeName}`;



      const { error: uploadError } =
        await supabase.storage
        .from("store-images")
        .upload(fileName,image);



      if(uploadError){

        setMessage(uploadError.message);
        return;

      }



      const publicUrl =
        supabase.storage
        .from("store-images")
        .getPublicUrl(fileName)
        .data
        .publicUrl;



      imageUrl = publicUrl;

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

      setCurrentImage(imageUrl);

      setMessage("تم تحديث بيانات المتجر");

    }

  }





  return (

    <main className="p-8 bg-gray-100 min-h-screen">

      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">


        <h1 className="text-2xl font-bold mb-5">
          إعدادات المتجر
        </h1>



        <form
          onSubmit={saveStore}
          className="space-y-4"
        >


          {currentImage && (

            <img
              src={currentImage}
              alt="صورة المتجر"
              className="w-40 h-40 object-cover rounded"
            />

          )}




          <input
            type="file"
            accept="image/*"
            className="border p-3 w-full rounded"
            onChange={(e)=>
              setImage(e.target.files?.[0] || null)
            }
          />




          <input
            className="border p-3 w-full rounded"
            placeholder="اسم المتجر"
            value={name}
            onChange={e=>setName(e.target.value)}
          />



          <textarea
            className="border p-3 w-full rounded"
            placeholder="وصف المتجر"
            value={description}
            onChange={e=>setDescription(e.target.value)}
          />



          <input
            className="border p-3 w-full rounded"
            placeholder="رقم واتساب"
            value={whatsapp}
            onChange={e=>setWhatsapp(e.target.value)}
          />



          <button
            className="bg-green-600 text-white p-3 rounded w-full"
          >
            حفظ
          </button>


        </form>


        <p className="mt-4">
          {message}
        </p>


      </div>

    </main>

  );

}