"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { BETA_CTA_LABEL, type LandingVariant } from "@/config/marketing";
import { getFirstTouchAttribution } from "@/lib/analytics/attribution";
import { track } from "@/lib/analytics/events";
import {
  INTERESTS,
  MONTHLY_CASES,
  MONTHLY_CASE_LABELS,
  PERSONAS,
  type Interest,
  type Persona,
} from "@/lib/leads/types";
import { PRICING_CONTEXT_KEY } from "./PricingExperiment";

const LEAD_KEY = "locapto_beta_lead_id";
type Step = "partial" | "details" | "done";
type PricingContext = {
  selectedPlan: "professional" | null;
  priceSeen: number | null;
  pricingExperiment: boolean;
};
const noPricing: PricingContext = {
  selectedPlan: null,
  priceSeen: null,
  pricingExperiment: false,
};

export function BetaLeadForm({
  landingVariant = "home",
  compact = false,
}: {
  landingVariant?: LandingVariant;
  compact?: boolean;
}) {
  const [step, setStep] = useState<Step>("partial");
  const [email, setEmail] = useState("");
  const [persona, setPersona] = useState<Persona | "">("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [monthlyCases, setMonthlyCases] = useState("");
  const [locations, setLocations] = useState("");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [website, setWebsite] = useState("");
  const [leadId, setLeadId] = useState("");
  const [pricing, setPricing] = useState<PricingContext>(noPricing);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getFirstTouchAttribution(landingVariant);
    track("beta_form_view", { landing_variant: landingVariant });
    const saved = sessionStorage.getItem(PRICING_CONTEXT_KEY);
    if (saved) {
      try {
        const restored = { ...noPricing, ...JSON.parse(saved) };
        window.setTimeout(() => setPricing(restored), 0);
      } catch {
        sessionStorage.removeItem(PRICING_CONTEXT_KEY);
      }
    }
    const select = (event: Event) =>
      setPricing((event as CustomEvent<PricingContext>).detail);
    window.addEventListener("locapto:pricing-selected", select);
    return () => window.removeEventListener("locapto:pricing-selected", select);
  }, [landingVariant]);

  const attribution = () => getFirstTouchAttribution(landingVariant);
  const commonPayload = () => {
    const value = attribution();
    return {
      action: "upsert",
      persona,
      selectedPlan: pricing.selectedPlan,
      priceSeen: pricing.priceSeen,
      pricingExperiment: pricing.pricingExperiment,
      website,
      utmSource: value.utmSource,
      utmMedium: value.utmMedium,
      utmCampaign: value.utmCampaign,
      utmContent: value.utmContent,
      utmTerm: value.utmTerm,
      landingVariant: value.landingVariant,
      pagePath: value.pagePath,
      referrer: value.referrer,
    };
  };
  const post = async (payload: Record<string, unknown>) => {
    const response = await fetch("/api/beta", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok)
      throw new Error(
        "No hemos podido guardar la solicitud. Inténtalo de nuevo.",
      );
    return data as {
      ok: true;
      leadId: string;
      status: "partial" | "complete";
      qualified: boolean;
    };
  };
  const submitPartial = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!email || !persona) {
      setError("Completa el email profesional y selecciona tu perfil.");
      return;
    }
    setPending(true);
    const value = attribution();
    track("beta_step1_submit", {
      persona,
      landing_variant: landingVariant,
      selected_plan: pricing.selectedPlan ?? undefined,
      price_seen: pricing.priceSeen ?? undefined,
      utm_source: value.utmSource,
      utm_campaign: value.utmCampaign,
    });
    try {
      const data = await post({
        ...commonPayload(),
        stage: "partial",
        email,
        leadId: leadId || sessionStorage.getItem(LEAD_KEY) || undefined,
      });
      setLeadId(data.leadId);
      sessionStorage.setItem(LEAD_KEY, data.leadId);
      setStep("details");
      track("beta_step1_success", {
        persona,
        landing_variant: landingVariant,
        selected_plan: pricing.selectedPlan ?? undefined,
        price_seen: pricing.priceSeen ?? undefined,
        utm_source: value.utmSource,
        utm_campaign: value.utmCampaign,
      });
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No hemos podido guardar la solicitud.",
      );
    } finally {
      setPending(false);
    }
  };
  const finish = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setPending(true);
    track("beta_step2_submit", {
      persona: persona || undefined,
      landing_variant: landingVariant,
    });
    try {
      const data = await post({
        ...commonPayload(),
        stage: "complete",
        leadId,
        name,
        company,
        monthlyCases: monthlyCases || undefined,
        locations,
        interests,
      });
      track("beta_complete", {
        persona: persona || undefined,
        landing_variant: landingVariant,
        selected_plan: pricing.selectedPlan ?? undefined,
        price_seen: pricing.priceSeen ?? undefined,
        qualified: data.qualified,
      });
      sessionStorage.removeItem(LEAD_KEY);
      setStep("done");
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No hemos podido completar la solicitud.",
      );
    } finally {
      setPending(false);
    }
  };
  const skip = () => {
    sessionStorage.removeItem(LEAD_KEY);
    setStep("done");
  };
  const toggleInterest = (value: Interest) =>
    setInterests((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );

  if (step === "done")
    return (
      <div className="form-success" role="status">
        <span aria-hidden="true">✓</span>
        <h3>Ya estás en la lista de acceso.</h3>
        <p>
          Podremos contactarte usando los datos que nos has facilitado cuando
          Locapto esté disponible y abramos nuevas plazas.
        </p>
      </div>
    );

  return (
    <div className={compact ? "beta-form compact-form" : "beta-form"}>
      {step === "partial" ? (
        <form onSubmit={submitPartial} noValidate>
          <div className="form-heading">
            <p className="form-step">Paso 1 de 2</p>
            <h3>Apúntate para cuando esté disponible</h3>
            <p>
              Empieza con dos datos. Los guardaremos para poder contactarte
              cuando abramos el acceso.
            </p>
          </div>
          <div className="form-field">
            <label htmlFor={`email-${landingVariant}`}>
              Email profesional <span aria-hidden="true">*</span>
            </label>
            <input
              id={`email-${landingVariant}`}
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-describedby={
                error ? `form-error-${landingVariant}` : undefined
              }
            />
          </div>
          <div className="form-field">
            <label htmlFor={`persona-${landingVariant}`}>
              Persona <span aria-hidden="true">*</span>
            </label>
            <select
              id={`persona-${landingVariant}`}
              value={persona}
              onChange={(e) => setPersona(e.target.value as Persona)}
              required
            >
              <option value="">Selecciona una opción</option>
              {PERSONAS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="honeypot" aria-hidden="true">
            <label>
              Web
              <input
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
          </div>
          {error && (
            <p
              className="form-error"
              id={`form-error-${landingVariant}`}
              role="alert"
            >
              {error}
            </p>
          )}
          <button
            className="button button-dark form-submit"
            type="submit"
            disabled={pending}
          >
            {pending ? "Guardando…" : BETA_CTA_LABEL}
          </button>
          <p className="privacy-copy">
            Usaremos tus datos para gestionar tu solicitud y avisarte cuando
            Locapto esté disponible. Consulta nuestra{" "}
            <Link href="/privacidad">Política de privacidad</Link>.
          </p>
        </form>
      ) : (
        <form onSubmit={finish} noValidate>
          <div className="form-heading">
            <p className="form-step">Solicitud guardada</p>
            <h3>Dos preguntas para priorizar el contacto</h3>
            <p>
              Todo lo siguiente es opcional. Tu solicitud inicial ya está
              guardada.
            </p>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor={`name-${landingVariant}`}>Nombre</label>
              <input
                id={`name-${landingVariant}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                maxLength={120}
              />
            </div>
            <div className="form-field">
              <label htmlFor={`company-${landingVariant}`}>Empresa</label>
              <input
                id={`company-${landingVariant}`}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                autoComplete="organization"
                maxLength={160}
              />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor={`cases-${landingVariant}`}>
              ¿Cuántos expedientes de apertura o actividad gestionáis
              aproximadamente al mes?
            </label>
            <select
              id={`cases-${landingVariant}`}
              value={monthlyCases}
              onChange={(e) => setMonthlyCases(e.target.value)}
            >
              <option value="">Selecciona una opción</option>
              {MONTHLY_CASES.map((value) => (
                <option key={value} value={value}>
                  {MONTHLY_CASE_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor={`locations-${landingVariant}`}>
              ¿Dónde trabajáis principalmente?
            </label>
            <input
              id={`locations-${landingVariant}`}
              value={locations}
              onChange={(e) => setLocations(e.target.value)}
              placeholder="Madrid, Barcelona, Getafe…"
              maxLength={300}
            />
          </div>
          <fieldset className="interest-field">
            <legend>¿Qué te interesa más?</legend>
            {INTERESTS.map(([value, label]) => (
              <label key={value}>
                <input
                  type="checkbox"
                  checked={interests.includes(value)}
                  onChange={() => toggleInterest(value)}
                />
                {label}
              </label>
            ))}
          </fieldset>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="form-actions">
            <button
              className="button button-dark"
              type="submit"
              disabled={pending}
            >
              {pending ? "Guardando…" : "Terminar"}
            </button>
            <button
              className="button button-quiet"
              type="button"
              onClick={skip}
              disabled={pending}
            >
              Ahora no
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
