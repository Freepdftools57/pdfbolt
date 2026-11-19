import { tools } from "@/lib/tools";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pdfbolt.vercel.app";

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
  ];
}
