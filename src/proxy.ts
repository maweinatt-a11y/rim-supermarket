import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function proxy(request: NextRequest) {

  let response = NextResponse.next({
    request,
  });


  const supabase = createServerClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    {

      cookies: {

        getAll() {

          return request.cookies.getAll();

        },


        setAll(cookiesToSet) {

          cookiesToSet.forEach(({ name, value, options }) => {

            response.cookies.set(
              name,
              value,
              options
            );

          });

        },

      },

    }

  );


  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();


  console.log("PROXY USER:", user?.email);
  console.log("PROXY ERROR:", error?.message);


  if (!user && request.nextUrl.pathname.startsWith("/admin")) {

    return NextResponse.redirect(
      new URL("/login", request.url)
    );

  }


  return response;

}



export const config = {

  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
  ],

};