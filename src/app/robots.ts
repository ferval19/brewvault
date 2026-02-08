import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://brewvault.app"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/callback"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
