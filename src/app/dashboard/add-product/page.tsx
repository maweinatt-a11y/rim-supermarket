"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddProduct() {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [message, setMessage] = useState("");


  async function uploadImage(file: File) {

    const extension = file.name.split(".").pop();

    const fileName = `${Date.now()}.${extension}`;


    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);


    if (error) {
      throw error;
    }


    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);


    return data.publicUrl;
  }



  async function addProduct(e: React.FormEvent) {

    e.preventDefault();

    setMessage("جاري إضافة المنتج...");


    try {

      const {
        data: { user }
      } = await supabase.auth.getUser();


      if (!user) {
        setMessage("يجب تسجيل الدخول");
        return;
      }



      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("store_id")
        .eq("id", user.id)
        .single();



      if (profileError || !profile?.store_id) {
        setMessage("لا يوجد متجر مرتبط بهذا الحساب");
        return;
      }



      let imageUrl = "";

      if (image) {
        imageUrl = await uploadImage(image);
      }



      const { error } = await supabase
        .from("products")
        .insert({
          store_id: profile.store_id,
          name: name,
          description: description,
          price: Number(price),
          image: imageUrl,
        });



      if (error) {
        setMessage(error.message);
        return;
      }



      setMessage("تمت إضافة المنتج بنجاح");


      setName("");
      setDescription("");
      setPrice("");
      setImage(null);



    } catch (error: any) {

      setMessage(error.message || "حدث خطأ");

    }

  }



  return (

    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">


        <h1 className="text-3xl font-bold mb-6">
          إضافة منتج
        </h1>


        <form
          onSubmit={addProduct}
          className="space-y-4"
        >


          <input
            className="border p-3 rounded w-full"
            placeholder="اسم المنتج"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />


          <textarea
            className="border p-3 rounded w-full"
            placeholder="وصف المنتج"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />


          <input
            className="border p-3 rounded w-full"
            type="number"
            placeholder="السعر"
            value={price}
            onChange={(e)=>setPrice(e.target.value)}
            required
          />


          <input
            type="file"
            accept="image/*"
            onChange={(e)=>setImage(e.target.files?.[0] || null)}
          />


          <button
            type="submit"
            className="bg-green-600 text-white w-full py-3 rounded"
          >
            إضافة المنتج
          </button>


        </form>


        <p className="mt-4 text-center">
          {message}
        </p>


      </div>

    </main>

  );
}