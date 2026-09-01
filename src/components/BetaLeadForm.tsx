"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { BETA_CTA_LABEL, type LandingVariant } from "@/config/marketing";
import { getFirstTouchAttribution } from "@/lib/analytics/attribution";
import { track, trackGenerateLeadOnce } from "@/lib/analytics/events";
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
const CONTEXT_KEY = "locapto_lead_context_v1";
const professionalPersonas = new Set<Persona>([
  "gestoria",
  "tecnico",
  "consultoria",
  "empresa",
  "proptech",
  "otro",
]);

type Step = "partial" | "details" | "done";
type FieldErrors = Partial<
  Record<"email" | "persona" | "otherPersona", string>
>;
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

function landingPageType(pathname: string) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/lp/")) return "campaign";
  if (pathname.startsWith("/recursos/")) return "resource";
  if (pathname.startsWith("/abrir-negocio/")) return "activity";
  if (pathname.startsWith("/municipios/")) return "territory";
  return "content";
}

export function BetaLeadForm({
  landingVariant = "home",
  compact = false,
}: {
  landingVariant?: LandingVariant;
  compact?: boolean;
}) {
  const [step, setStep] = useState<Step>("partial");
  const [savingPartial, setSavingPartial] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [email, setEmail] = useState("");
  const [persona, setPersona] = useState<Persona | "">("");
  const [otherPersona, setOtherPersona] = useState("");
  const [activity, setActivity] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [analyticsActivity, setAnalyticsActivity] = useState("");
  const [analyticsMunicipality, setAnalyticsMunicipality] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [monthlyCases, setMonthlyCases] = useState("");
  const [locations, setLocations] = useState("");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [website, setWebsite] = useState("");
  const [leadId, setLeadId] = useState("");
  const [pricing, setPricing] = useState<PricingContext>(noPricing);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const submittingRef = useRef(false);
  const formStartedRef = useRef(false);
  const contextReadyRef = useRef(false);

  useEffect(() => {
    getFirstTouchAttribution(landingVariant);
    const timer = window.setTimeout(() => {
      const query = new URLSearchParams(window.location.search);
      let savedContext: Record<string, string> = {};
      try {
        savedContext = JSON.parse(sessionStorage.getItem(CONTEXT_KEY) ?? "{}");
      } catch {
        sessionStorage.removeItem(CONTEXT_KEY);
      }
      const nextActivity =
        query.get("activity")?.slice(0, 160) ?? savedContext.activity;
      const nextMunicipality =
        query.get("municipality")?.slice(0, 160) ?? savedContext.municipality;
      if (nextActivity) setActivity(nextActivity);
      if (nextMunicipality) setMunicipality(nextMunicipality);
      setAnalyticsActivity(query.get("activity_key")?.slice(0, 80) ?? "");
      setAnalyticsMunicipality(
        query.get("municipality_code")?.slice(0, 10) ?? "",
      );

      const savedPricing = sessionStorage.getItem(PRICING_CONTEXT_KEY);
      if (savedPricing) {
        try {
          setPricing({ ...noPricing, ...JSON.parse(savedPricing) });
        } catch {
          sessionStorage.removeItem(PRICING_CONTEXT_KEY);
        }
      }
      contextReadyRef.current = true;
    }, 0);
    const select = (event: Event) =>
      setPricing((event as CustomEvent<PricingContext>).detail);
    window.addEventListener("locapto:pricing-selected", select);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("locapto:pricing-selected", select);
    };
  }, [landingVariant]);

  useEffect(() => {
    if (!contextReadyRef.current) return;
    sessionStorage.setItem(
      CONTEXT_KEY,
      JSON.stringify({ activity, municipality }),
    );
  }, [activity, municipality]);

  const attribution = () => getFirstTouchAttribution(landingVariant);
  const startForm = () => {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    const value = attribution();
    track("form_start", {
      landing_variant: landingVariant,
      landing_page_type: landingPageType(value.landingPage),
      page_path: value.landingPage,
    });
  };
  const commonPayload = () => {
    const value = attribution();
    return {
      action: "upsert",
      leadType: "launch_interest",
      leadSource: "landing",
      persona,
      otherPersona,
      activity,
      municipality,
      selectedPlan: pricing.selectedPlan,
      priceSeen: pricing.priceSeen,
      pricingExperiment: pricing.pricingExperiment,
      website,
      utmSource: value.utmSource,
      utmMedium: value.utmMedium,
      utmCampaign: value.utmCampaign,
      utmContent: value.utmContent,
      utmTerm: value.utmTerm,
      gclid: value.gclid,
      gbraid: value.gbraid,
      wbraid: value.wbraid,
      msclkid: value.msclkid,
      liFatId: value.liFatId,
      landingVariant: value.landingVariant,
      landingPage: value.landingPage,
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
    if (submittingRef.current) return;
    setError("");
    const nextErrors: FieldErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      nextErrors.email = "Introduce un email válido.";
    if (!persona) nextErrors.persona = "Selecciona tu perfil.";
    if (persona === "otro" && !otherPersona.trim())
      nextErrors.otherPersona = "Describe brevemente tu perfil.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      track("form_error", { landing_variant: landingVariant });
      return;
    }

    submittingRef.current = true;
    setSavingPartial(true);
    const value = attribution();
    const nextLeadId =
      leadId || sessionStorage.getItem(LEAD_KEY) || crypto.randomUUID();
    setLeadId(nextLeadId);
    sessionStorage.setItem(LEAD_KEY, nextLeadId);
    try {
      const data = await post({
        ...commonPayload(),
        stage: "partial",
        email,
        leadId: nextLeadId,
      });
      setLeadId(data.leadId);
      sessionStorage.setItem(LEAD_KEY, data.leadId);
      trackGenerateLeadOnce(data.leadId, {
        lead_type: "launch_interest",
        persona,
        activity: analyticsActivity || undefined,
        municipality: analyticsMunicipality || undefined,
        landing_variant: landingVariant,
        landing_page_type: landingPageType(value.landingPage),
        utm_source: value.utmSource,
        utm_medium: value.utmMedium,
        utm_campaign: value.utmCampaign,
      });
      if (professionalPersonas.has(persona as Persona)) setStep("details");
      else {
        sessionStorage.removeItem(LEAD_KEY);
        setStep("done");
      }
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No hemos podido guardar la solicitud.",
      );
      track("form_error", { landing_variant: landingVariant });
    } finally {
      submittingRef.current = false;
      setSavingPartial(false);
    }
  };

  const finish = async (event: FormEvent) => {
    event.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSavingDetails(true);
    setError("");
    try {
      await post({
        ...commonPayload(),
        stage: "complete",
        leadId,
        name,
        company,
        companyWebsite,
        monthlyCases: monthlyCases || undefined,
        locations,
        interests,
      });
      sessionStorage.removeItem(LEAD_KEY);
      setStep("done");
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No hemos podido completar la solicitud.",
      );
      track("form_error", { landing_variant: landingVariant });
    } finally {
      submittingRef.current = false;
      setSavingDetails(false);
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
      <div className="form-success" role="status" aria-live="polite">
        <span aria-hidden="true">✓</span>
        <h3>Gracias. Te avisaremos cuando Locapto esté disponible.</h3>
        <p>
          Revisa tu bandeja de entrada para confirmar el correo y completar el
          alta en la lista de avisos.
        </p>
      </div>
    );

  return (
    <div className={compact ? "beta-form compact-form" : "beta-form"}>
      {step === "partial" ? (
        <form onSubmit={submitPartial} onFocus={startForm} noValidate>
          <div className="form-heading">
            <p className="form-step">Aviso de disponibilidad</p>
            <h3>Te avisamos cuando esté disponible</h3>
            <p>
              Indica cómo contactarte y, si quieres, qué actividad y ubicación
              te interesan.
            </p>
          </div>
          <div className="form-field">
            <label htmlFor={`email-${landingVariant}`}>
              Email <span aria-hidden="true">*</span>
            </label>
            <input
              id={`email-${landingVariant}`}
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={
                fieldErrors.email ? `email-error-${landingVariant}` : undefined
              }
            />
            {fieldErrors.email && (
              <small
                id={`email-error-${landingVariant}`}
                className="form-error"
              >
                {fieldErrors.email}
              </small>
            )}
          </div>
          <div className="form-field">
            <label htmlFor={`persona-${landingVariant}`}>
              ¿Cuál es tu perfil? <span aria-hidden="true">*</span>
            </label>
            <select
              id={`persona-${landingVariant}`}
              value={persona}
              onChange={(event) => {
                const value = event.target.value as Persona | "";
                setPersona(value);
                setFieldErrors((current) => ({
                  ...current,
                  persona: undefined,
                }));
                if (value !== "otro") setOtherPersona("");
                if (value) track("persona_selected", { persona: value });
              }}
              required
              aria-invalid={Boolean(fieldErrors.persona)}
              aria-describedby={
                fieldErrors.persona
                  ? `persona-error-${landingVariant}`
                  : undefined
              }
            >
              <option value="">Selecciona tu perfil</option>
              {PERSONAS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {fieldErrors.persona && (
              <small
                id={`persona-error-${landingVariant}`}
                className="form-error"
              >
                {fieldErrors.persona}
              </small>
            )}
          </div>
          {persona === "otro" && (
            <div className="form-field">
              <label htmlFor={`other-persona-${landingVariant}`}>
                Describe tu perfil <span aria-hidden="true">*</span>
              </label>
              <input
                id={`other-persona-${landingVariant}`}
                value={otherPersona}
                onChange={(event) => setOtherPersona(event.target.value)}
                placeholder="Por ejemplo, consultoría inmobiliaria"
                maxLength={120}
                required
                aria-invalid={Boolean(fieldErrors.otherPersona)}
                aria-describedby={
                  fieldErrors.otherPersona
                    ? `other-persona-error-${landingVariant}`
                    : undefined
                }
              />
              {fieldErrors.otherPersona && (
                <small
                  id={`other-persona-error-${landingVariant}`}
                  className="form-error"
                >
                  {fieldErrors.otherPersona}
                </small>
              )}
            </div>
          )}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor={`activity-${landingVariant}`}>
                ¿Qué quieres abrir? <span>(opcional)</span>
              </label>
              <input
                id={`activity-${landingVariant}`}
                value={activity}
                onChange={(event) => setActivity(event.target.value)}
                placeholder="Por ejemplo, una cafetería"
                maxLength={160}
              />
            </div>
            <div className="form-field">
              <label htmlFor={`municipality-${landingVariant}`}>
                ¿Dónde? <span>(opcional)</span>
              </label>
              <input
                id={`municipality-${landingVariant}`}
                value={municipality}
                onChange={(event) => setMunicipality(event.target.value)}
                placeholder="Municipio o ubicación"
                autoComplete="address-level2"
                maxLength={160}
              />
            </div>
          </div>
          <div className="honeypot" aria-hidden="true">
            <label>
              Web
              <input
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </label>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="button button-dark form-submit"
            type="submit"
            disabled={savingPartial}
          >
            {savingPartial ? "Guardando…" : BETA_CTA_LABEL}
          </button>
          <p className="privacy-copy">
            Usaremos tus datos para gestionar el aviso de disponibilidad. Te
            enviaremos un correo de confirmación. Consulta nuestra{" "}
            <Link href="/privacidad">Política de privacidad</Link>.
          </p>
        </form>
      ) : (
        <form onSubmit={finish} noValidate>
          <div className="form-heading">
            <p className="form-step">El aviso ya está guardado</p>
            <h3>Cuéntanos un poco más</h3>
            <p>
              Estos datos profesionales son opcionales y nos ayudan a entender
              mejor las necesidades de uso.
            </p>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor={`name-${landingVariant}`}>Nombre</label>
              <input
                id={`name-${landingVariant}`}
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                maxLength={120}
              />
            </div>
            <div className="form-field">
              <label htmlFor={`company-${landingVariant}`}>Empresa</label>
              <input
                id={`company-${landingVariant}`}
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                autoComplete="organization"
                maxLength={160}
              />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor={`company-website-${landingVariant}`}>
              Web de la empresa
            </label>
            <input
              id={`company-website-${landingVariant}`}
              type="url"
              value={companyWebsite}
              onChange={(event) => setCompanyWebsite(event.target.value)}
              autoComplete="url"
              placeholder="https://"
              maxLength={200}
            />
          </div>
          <div className="form-field">
            <label htmlFor={`cases-${landingVariant}`}>
              ¿Cuántas aperturas gestionáis aproximadamente al mes?
            </label>
            <select
              id={`cases-${landingVariant}`}
              value={monthlyCases}
              onChange={(event) => setMonthlyCases(event.target.value)}
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
              ¿En qué ubicaciones trabajáis principalmente?
            </label>
            <input
              id={`locations-${landingVariant}`}
              value={locations}
              onChange={(event) => setLocations(event.target.value)}
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
              disabled={savingDetails}
            >
              {savingDetails ? "Guardando…" : "Guardar respuestas"}
            </button>
            <button
              className="button button-quiet"
              type="button"
              onClick={skip}
              disabled={savingDetails}
            >
              Omitir
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
