"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NewStorePage() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function createStore(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    let imageUrl = "";

    if (image) {

      const fileName = `${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("store-images")
        .upload(fileName, image, {
          upsert: true,
        });

      if (uploadError) {
        setMessage(uploadError.message);
        setLoading(false);
        return;
      }

      imageUrl = supabase.storage
        .from("store-images")
        .getPublicUrl(fileName).data.publicUrl;
    }

    const { error } = await supabase
      .from("stores")
      .insert({
        name,
        owner_name: ownerName,
        description,
        whatsapp,
        image: imageUrl,
        subscription_status: "active",
        subscription_start: new Date().toISOString().split("T")[0],
      });

    if (error) {
      setMessage(error.message);
    } else {
      router.push("/admin/stores");
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">

        <h1 className="text-3xl font-bold mb-6">
          إضافة متجر جديد
        </h1>

        <form
          onSubmit={createStore}
          className="space-y-4"
        >

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="border p-3 rounded w-full"
          />

          <input
            className="border p-3 rounded w-full"
            placeholder="اسم المتجر"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-3 rounded w-full"
            placeholder="اسم صاحب المتجر"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />

          <textarea
            className="border p-3 rounded w-full"
            placeholder="وصف المتجر"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="border p-3 rounded w-full"
            placeholder="رقم واتساب"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />

          <button
            disabled={loading}
            className="bg-green-600 text-white w-full p-3 rounded"
          >
            {loading ? "جاري الإنشاء..." : "إنشاء المتجر"}
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