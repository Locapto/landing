import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Locapto",
    short_name: "Locapto",
    description:
      "Precalificación de aperturas de negocio con fuentes oficiales.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfbfd",
    theme_color: "#10152f",
    lang: "es",
    icons: [
      { src: "/brand/icon-colors.webp", sizes: "128x128", type: "image/webp" },
    ],
  };
}
