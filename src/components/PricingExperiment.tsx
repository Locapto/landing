"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { marketingConfig } from "@/config/marketing";
import { getFirstTouchAttribution } from "@/lib/analytics/attribution";
import { track } from "@/lib/analytics/events";

export const PRICING_CONTEXT_KEY = "locapto_pricing_context_v1";

export function PricingExperiment() {
  const ref = useRef<HTMLDivElement>(null);
  const viewed = useRef(false);
  const price = marketingConfig.professionalBetaPrice;
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || viewed.current) return;
        viewed.current = true;
        sessionStorage.setItem(
          PRICING_CONTEXT_KEY,
          JSON.stringify({
            priceSeen: price,
            pricingExperiment: true,
            selectedPlan: null,
          }),
        );
        const attribution = getFirstTouchAttribution("lp_gestorias");
        track("pricing_view", {
          price_seen: price,
          pricing_experiment: true,
          landing_variant: "lp_gestorias",
          utm_source: attribution.utmSource,
          utm_campaign: attribution.utmCampaign,
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [price]);
  const select = () => {
    const detail = {
      priceSeen: price,
      pricingExperiment: true,
      selectedPlan: "professional" as const,
    };
    sessionStorage.setItem(PRICING_CONTEXT_KEY, JSON.stringify(detail));
    track("pricing_cta_click", {
      price_seen: price,
      pricing_experiment: true,
      selected_plan: "professional",
      landing_variant: "lp_gestorias",
    });
    window.dispatchEvent(
      new CustomEvent("locapto:pricing-selected", { detail }),
    );
    document
      .getElementById("acceso-beta")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <section ref={ref} className="pricing-card" aria-labelledby="pricing-title">
      <p className="eyebrow">Validación de precio</p>
      <h2 id="pricing-title">Locapto Pro</h2>
      <p>Precio previsto para acceso profesional</p>
      <p className="price">
        <strong>{price} €</strong>
        <span>/mes</span>
      </p>
      <ul>
        {[
          "Múltiples expedientes",
          "Historial",
          "Evidencias",
          "Seguimiento",
          "Informes",
          "Acceso profesional",
        ].map((item) => (
          <li key={item}>
            <Check aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
      <button className="button button-dark" type="button" onClick={select}>
        Quiero acceso Pro
      </button>
      <small>
        Precio orientativo en fase de validación. No se realizará ningún cargo.
      </small>
    </section>
  );
}
