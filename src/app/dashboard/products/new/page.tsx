"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NewDashboardProductPage() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");



  async function createProduct(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);
    setMessage("");



    const {
      data: { user },
    } = await supabase.auth.getUser();



    if (!user) {

      router.push("/login");
      return;

    }



    const { data: owner, error: ownerError } = await supabase
      .from("store_owners")
      .select("store_id")
      .eq("user_id", user.id)
      .maybeSingle();



    if (ownerError || !owner) {

      setMessage("لا يوجد متجر مرتبط بهذا الحساب");
      setLoading(false);
      return;

    }



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

        setMessage(uploadError.message);
        setLoading(false);
        return;

      }

      imageUrl = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName).data.publicUrl;

    }



    const { error } = await supabase
      .from("products")
      .insert({
        store_id: owner.store_id,
        name,
        description,
        price: Number(price),
        image: imageUrl,
      });



    if (error) {

      setMessage(error.message);

    } else {

      router.push("/dashboard/products");

    }



    setLoading(false);

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
            onChange={(e) =>
              setImage(e.target.files?.[0] || null)
            }
            className="border p-3 rounded w-full"
            required
          />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم المنتج"
            className="border p-3 rounded w-full"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف المنتج"
            className="border p-3 rounded w-full"
          />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="السعر"
            className="border p-3 rounded w-full"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white w-full p-3 rounded"
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