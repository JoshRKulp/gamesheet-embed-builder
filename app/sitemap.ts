import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: "https://www.embed-gamesheet.dev/", lastModified, changeFrequency: "monthly", priority: 1 },
    { url: "https://www.embed-gamesheet.dev/gamesheet-standings-embed", lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.embed-gamesheet.dev/gamesheet-schedule-embed", lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.embed-gamesheet.dev/gamesheet-tournament-embed", lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
