import { tools } from "@/lib/tools";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pdfbolt-gamma.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-11-19"),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...tools.map((tool) => ({
      url: `${baseUrl}${tool.href}`,
      lastModified: new Date("2026-11-19"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/about`,
      lastModified: new Date("2026-11-19"),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2026-11-19"),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];
}
