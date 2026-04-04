import { type MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Indexa - Organize Your Digital World",
    short_name: "Indexa",
    description:
      "A hierarchical, authenticated information indexing platform. Store, organize, and retrieve structured bookmarks in a deeply nested tree.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6366f1",
    orientation: "portrait-primary",
    categories: ["productivity", "utilities", "organization"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
