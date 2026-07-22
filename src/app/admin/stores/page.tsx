import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function StoresPage() {
  const { data: stores } = await supabase
    .from("stores")
    .select("*")
    .order("id", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            إدارة المتاجر
          </h1>

          <Link
            href="/admin/stores/new"
            className="bg-green-600 text-white px-5 py-3 rounded-lg"
          >
            + إضافة متجر
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-200">
              <tr>
                <th className="p-4 text-right">الصورة</th>
                <th className="p-4 text-right">المتجر</th>
                <th className="p-4 text-right">صاحب المتجر</th>
                <th className="p-4 text-right">واتساب</th>
                <th className="p-4 text-right">الحالة</th>
                <th className="p-4 text-right">الإجراءات</th>
              </tr>
            </thead>

            <tbody>

              {stores?.map((store: any) => (

                <tr
                  key={store.id}
                  className="border-t"
                >

                  <td className="p-4">
                    {store.image ? (
                      <img
                        src={store.image}
                        className="w-16 h-16 rounded object-cover"
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="p-4">
                    {store.name}
                  </td>

                  <td className="p-4">
                    {store.owner_name}
                  </td>

                  <td className="p-4">
                    {store.whatsapp}
                  </td>

                  <td className="p-4">
                    {store.subscription_status === "active"
                      ? "🟢 نشط"
                      : "🔴 منتهي"}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">

                      <Link
                        href={`/admin/stores/${store.id}/products`}
                        className="bg-blue-600 text-white px-3 py-2 rounded"
                      >
                        المنتجات
                      </Link>

                      <Link
                        href={`/store/${store.id}`}
                        target="_blank"
                        className="bg-gray-700 text-white px-3 py-2 rounded"
                      >
                        عرض
                      </Link>

                    </div>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}