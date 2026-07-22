"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {

  const params = useParams();
  const router = useRouter();

  const productId = Number(params.productId);

  const [storeId, setStoreId] = useState<number>(0);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [currentImage, setCurrentImage] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");



  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);



  async function loadProduct() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: owner } = await supabase
      .from("store_owners")
      .select("store_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!owner) {
      router.push("/dashboard");
      return;
    }

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("store_id", owner.store_id)
      .maybeSingle();

    if (!data) {
      router.push("/dashboard/products");
      return;
    }

    setStoreId(owner.store_id);
    setName(data.name || "");
    setDescription(data.description || "");
    setPrice(String(data.price || ""));
    setCurrentImage(data.image || "");
  }



  async function updateProduct(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);
    setMessage("");

    let imageUrl = currentImage;

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
      .update({
        name,
        description,
        price: Number(price),
        image: imageUrl,
      })
      .eq("id", productId)
      .eq("store_id", storeId);

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
          تعديل المنتج
        </h1>

        <form
          onSubmit={updateProduct}
          className="space-y-4"
        >

          {currentImage && (
            <img
              src={currentImage}
              alt={name}
              className="w-40 h-40 object-cover rounded"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files?.[0] || null)
            }
            className="border p-3 rounded w-full"
          />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded w-full"
            placeholder="اسم المنتج"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-3 rounded w-full"
            placeholder="الوصف"
          />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-3 rounded w-full"
            placeholder="السعر"
          />

          <button
            disabled={loading}
            className="bg-green-600 text-white w-full p-3 rounded"
          >
            {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
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