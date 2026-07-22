"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

export default function DeleteProductPage() {

  const params = useParams();
  const router = useRouter();

  const productId = Number(params.productId);

  const [storeId, setStoreId] = useState<number>(0);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

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
      .select("id,name,store_id")
      .eq("id", productId)
      .eq("store_id", owner.store_id)
      .maybeSingle();

    if (!data) {
      router.push("/dashboard/products");
      return;
    }

    setStoreId(owner.store_id);
    setName(data.name);
    setLoaded(true);
  }

  async function deleteProduct() {

    setLoading(true);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .eq("store_id", storeId);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("تم حذف المنتج بنجاح");

    router.push("/dashboard/products");
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white p-8 rounded-xl shadow w-[450px]">

        <h1 className="text-2xl font-bold mb-6">
          حذف المنتج
        </h1>

        <p className="mb-8">
          هل تريد حذف المنتج
          <strong> {name} </strong>
          ؟
        </p>

        <div className="flex gap-4">

          <button
            onClick={deleteProduct}
            disabled={!loaded || loading}
            className="bg-red-600 text-white px-6 py-3 rounded disabled:opacity-50"
          >
            {loading ? "جاري الحذف..." : "حذف"}
          </button>

          <button
            onClick={() => router.back()}
            className="bg-gray-300 px-6 py-3 rounded"
          >
            إلغاء
          </button>

        </div>

      </div>

    </main>
  );

}