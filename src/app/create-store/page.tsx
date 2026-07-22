"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CreateStore() {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [storeImage, setStoreImage] = useState<File | null>(null);
  const [paymentImage, setPaymentImage] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);



  async function uploadFile(file: File, bucket: string) {


    const ext = file.name.split(".").pop();

    const fileName =
      `${Date.now()}-${crypto.randomUUID()}.${ext}`;



    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });



    if(error){

      throw new Error(error.message);

    }




    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);



    return data.publicUrl;

  }







  async function submitStore(e: React.FormEvent) {

    e.preventDefault();


    setLoading(true);
    setMessage("");



    try {


      const {
        data:{user}
      } = await supabase.auth.getUser();




      if(!user){

        setMessage("يجب تسجيل الدخول أولا");

        setLoading(false);

        return;

      }





      if(!storeImage || !paymentImage){

        setMessage("يرجى اختيار صورة المتجر وصورة إثبات الدفع");

        setLoading(false);

        return;

      }






      const storeImageUrl = await uploadFile(
        storeImage,
        "store-images"
      );





      const paymentImageUrl = await uploadFile(
        paymentImage,
        "payment-receipts"
      );







      const { error } = await supabase
        .from("store_requests")
        .insert({

          user_id: user.id,

          name,

          description,

          whatsapp,

          store_image: storeImageUrl,

          payment_image: paymentImageUrl,

          status: "pending"

        });







      if(error){

        throw error;

      }







      setMessage("تم إرسال طلب إنشاء المتجر، انتظر موافقة الإدارة");

      setName("");
      setDescription("");
      setWhatsapp("");
      setStoreImage(null);
      setPaymentImage(null);



    } catch(err:any){


      console.error(err);

      setMessage(err.message);



    }



    setLoading(false);

  }








  return (

    <main className="min-h-screen bg-gray-100 p-6">


      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">


        <h1 className="text-3xl font-bold mb-6">
          إنشاء متجر
        </h1>





        <form
          onSubmit={submitStore}
          className="space-y-4"
        >




          <input
            className="border w-full p-3 rounded"
            placeholder="اسم المتجر"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />





          <textarea
            className="border w-full p-3 rounded"
            placeholder="وصف المتجر"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            required
          />





          <input
            className="border w-full p-3 rounded"
            placeholder="رقم واتساب"
            value={whatsapp}
            onChange={(e)=>setWhatsapp(e.target.value)}
            required
          />





          <div>

            <p className="mb-2">
              صورة المتجر
            </p>


            <input
              type="file"
              accept="image/*"
              onChange={(e)=>
                setStoreImage(e.target.files?.[0] || null)
              }
              required
            />

          </div>







          <div>

            <p className="mb-2">
              صورة إثبات الدفع
            </p>


            <input
              type="file"
              accept="image/*"
              onChange={(e)=>
                setPaymentImage(e.target.files?.[0] || null)
              }
              required
            />

          </div>








          <button
            disabled={loading}
            className="bg-green-600 text-white w-full py-3 rounded disabled:opacity-50"
          >

            {loading ? "جاري الإرسال..." : "إرسال الطلب"}

          </button>





        </form>







        {message && (

          <p className="mt-4 text-center">

            {message}

          </p>

        )}



      </div>



    </main>

  );

}