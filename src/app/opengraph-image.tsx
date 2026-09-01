import { ImageResponse } from "next/og";
export const alt =
  "Descubre qué necesitas para abrir un negocio con fuentes oficiales — Locapto";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 84px",
        background: "#fbfbfd",
        color: "#10152f",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 32,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "#7565e6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          L
        </div>
        Locapto
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 22,
          maxWidth: 930,
        }}
      >
        <div
          style={{
            fontSize: 72,
            lineHeight: 1.04,
            fontWeight: 750,
            letterSpacing: "-3px",
          }}
        >
          Descubre qué necesitas para abrir un negocio con fuentes oficiales.
        </div>
        <div style={{ fontSize: 28, lineHeight: 1.35, color: "#5f6478" }}>
          Consulta trámites, requisitos y datos pendientes antes de invertir
          tiempo o dinero.
        </div>
      </div>
      <div style={{ display: "flex", gap: 18, fontSize: 22, color: "#6556d9" }}>
        <span>Fuentes oficiales</span>
        <span>·</span>
        <span>Contexto territorial</span>
        <span>·</span>
        <span>Próximamente</span>
      </div>
    </div>,
    size,
  );
}
