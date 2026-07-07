import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/dashboard/", "/api/", "/booking/payment"],
      },
    ],
    sitemap: "https://fmbeauty.ir/sitemap.xml",
  };
}
