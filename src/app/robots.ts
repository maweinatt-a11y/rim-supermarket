import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://rim-supermarket-eight.vercel.app/sitemap.xml",
    host: "https://rim-supermarket-eight.vercel.app",
  };
}