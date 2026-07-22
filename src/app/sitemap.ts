import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://rim-supermarket-eight.vercel.app";

  const { data: stores } = await supabase
    .from("stores")
    .select("id");

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/create-store`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const storePages: MetadataRoute.Sitemap =
    stores?.map((store) => ({
      url: `${baseUrl}/store/${store.id}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    })) ?? [];

  return [...staticPages, ...storePages];
}