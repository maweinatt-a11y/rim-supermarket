"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function LoginPage() {

  const router = useRouter();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);



  async function login(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);
    setMessage("");



    const { data, error } = await supabase.auth.signInWithPassword({

      email,
      password

    });



    if(error){

      console.log("LOGIN ERROR:", error);

      setMessage(error.message);
      setLoading(false);
      return;

    }



    console.log("LOGIN USER:", data.user);



    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();



    console.log(
      "LOGIN SESSION:",
      sessionData.session
    );


    console.log(
      "SESSION ERROR:",
      sessionError
    );



    if(!sessionData.session){

      setMessage(
        "تم الدخول لكن لم يتم حفظ جلسة المستخدم"
      );

      setLoading(false);
      return;

    }



    // اختبار إضافي
    const {
      data:{ user: currentUser }
    } = await supabase.auth.getUser();



    console.log(
      "CURRENT USER AFTER LOGIN:",
      currentUser
    );



    router.push("/dashboard");
    router.refresh();



    setLoading(false);

  }





  return (

    <main className="min-h-screen bg-gray-100 flex items-center justify-center">


      <div className="bg-white p-8 rounded-xl shadow w-[400px]">


        <h1 className="text-3xl font-bold mb-6 text-center">
          تسجيل دخول صاحب المتجر
        </h1>



        <form
          onSubmit={login}
          className="space-y-4"
        >



          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="border p-3 rounded w-full"
            required
          />



          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="border p-3 rounded w-full"
            required
          />



          <button
            disabled={loading}
            className="bg-green-600 text-white w-full p-3 rounded disabled:opacity-50"
          >

            {loading ? "جاري الدخول..." : "دخول"}

          </button>



        </form>



        {message && (

          <p className="text-red-600 mt-4">
            {message}
          </p>

        )}



      </div>


    </main>

  );

}