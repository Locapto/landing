import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Locapto",
    short_name: "Locapto",
    description:
      "Información para preparar aperturas de negocio con fuentes oficiales.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfbfd",
    theme_color: "#10152f",
    lang: "es",
    icons: [{ src: "/icon.png?v=3", sizes: "894x894", type: "image/png" }],
  };
}
