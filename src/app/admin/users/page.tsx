import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";


export default async function UsersPage() {


  const supabase = await createServerSupabase();



  const {
    data: { user }
  } = await supabase.auth.getUser();



  console.log("ADMIN USER:", user);



  if (!user) {

    redirect("/login");

  }




  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();



  console.log("ADMIN PROFILE:", profile);
  console.log("PROFILE ERROR:", profileError);




  if (!profile) {

    return (

      <main className="p-8">

        <h1 className="text-2xl font-bold text-red-600">
          لا يوجد ملف Profile لهذا الحساب
        </h1>

      </main>

    );

  }





  if (profile.role !== "admin") {

    redirect("/dashboard");

  }





  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", {
      ascending: false
    });



  console.log("USERS:", users);
  console.log("USERS ERROR:", usersError);






  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <div className="max-w-6xl mx-auto">



        <h1 className="text-3xl font-bold mb-8">
          إدارة المستخدمين
        </h1>





        <div className="bg-white rounded-xl shadow overflow-hidden">



          <table className="w-full">



            <thead className="bg-gray-200">

              <tr>

                <th className="p-4 text-right">
                  البريد
                </th>


                <th className="p-4 text-right">
                  الصلاحية
                </th>


                <th className="p-4 text-right">
                  التاريخ
                </th>


              </tr>

            </thead>





            <tbody>


              {users?.map((item:any)=>(


                <tr
                  key={item.id}
                  className="border-t"
                >



                  <td className="p-4">
                    {item.email}
                  </td>




                  <td className="p-4">

                    {item.role === "admin"
                      ? "مدير"
                      : "بائع"}

                  </td>





                  <td className="p-4">

                    {new Date(item.created_at)
                      .toLocaleDateString("ar-MR")}

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