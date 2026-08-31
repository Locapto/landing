"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics/events";

type Consent = { analytics: boolean; marketing: boolean; decided: boolean };
const KEY = "locapto_consent_v1";
const empty: Consent = { analytics: false, marketing: false, decided: false };

function readConsent(): Consent {
  if (typeof window === "undefined") return empty;
  try {
    return { ...empty, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
  } catch {
    return empty;
  }
}

export function ConsentManager() {
  const [consent, setConsent] = useState<Consent>(empty);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const linkedInId = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;

  useEffect(() => {
    const timer = window.setTimeout(() => setConsent(readConsent()), 0);
    const handler = () => setOpen(true);
    window.addEventListener("locapto:open-consent", handler);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("locapto:open-consent", handler);
    };
  }, []);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  useEffect(() => {
    if (!ready || (!consent.analytics && !consent.marketing)) return;
    track("page_view", { page_path: pathname });
  }, [pathname, ready, consent.analytics, consent.marketing]);

  const save = (next: Consent) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    setConsent(next);
    setOpen(false);
    window.dispatchEvent(new CustomEvent("locapto:consent", { detail: next }));
  };
  const useGtm = Boolean(gtmId && consent.marketing);
  const useGa = Boolean(!gtmId && gaId && consent.analytics);

  return (
    <>
      {!consent.decided && (
        <aside className="consent-banner" aria-label="Preferencias de cookies">
          <div>
            <strong>Tu privacidad importa</strong>
            <p>
              Usamos almacenamiento necesario para el sitio. La analítica y el
              marketing permanecen desactivados hasta que elijas.
            </p>
          </div>
          <div className="consent-actions">
            <button
              className="button button-quiet"
              onClick={() => setOpen(true)}
            >
              Configurar
            </button>
            <button
              className="button button-quiet"
              onClick={() =>
                save({ analytics: false, marketing: false, decided: true })
              }
            >
              Rechazar
            </button>
            <button
              className="button button-dark"
              onClick={() =>
                save({ analytics: true, marketing: true, decided: true })
              }
            >
              Aceptar
            </button>
          </div>
        </aside>
      )}
      <dialog
        ref={dialogRef}
        className="consent-dialog"
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <form method="dialog" onSubmit={(event) => event.preventDefault()}>
          <div className="dialog-heading">
            <div>
              <p className="eyebrow">Privacidad</p>
              <h2>Configura tus preferencias</h2>
            </div>
            <button
              aria-label="Cerrar configuración"
              className="dialog-close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          <p>
            El almacenamiento necesario permite recordar tu elección y mantener
            los datos mientras completas el formulario. Puedes activar por
            separado las estadísticas de uso opcionales.
          </p>
          <label className="consent-option">
            <span>
              <strong>Necesarias</strong>
              <small>Siempre activas para el funcionamiento del sitio.</small>
            </span>
            <input type="checkbox" checked disabled />
          </label>
          <label className="consent-option">
            <span>
              <strong>Analítica</strong>
              <small>
                Ayuda a entender el uso del sitio sin enviar datos del
                formulario.
              </small>
            </span>
            <input
              type="checkbox"
              checked={consent.analytics}
              onChange={(e) =>
                setConsent((value) => ({
                  ...value,
                  analytics: e.target.checked,
                }))
              }
            />
          </label>
          <label className="consent-option">
            <span>
              <strong>Marketing</strong>
              <small>Permite medir campañas de Google Ads y LinkedIn.</small>
            </span>
            <input
              type="checkbox"
              checked={consent.marketing}
              onChange={(e) =>
                setConsent((value) => ({
                  ...value,
                  marketing: e.target.checked,
                }))
              }
            />
          </label>
          <div className="consent-actions">
            <button
              className="button button-quiet"
              onClick={() =>
                save({ analytics: false, marketing: false, decided: true })
              }
            >
              Rechazar todo
            </button>
            <button
              className="button button-dark"
              onClick={() => save({ ...consent, decided: true })}
            >
              Guardar configuración
            </button>
          </div>
        </form>
      </dialog>
      {useGtm && (
        <>
          <Script
            id="gtm-init"
            strategy="afterInteractive"
            onReady={() => setReady(true)}
          >{`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`}</Script>
          <Script
            id="gtm-lib"
            src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
            strategy="afterInteractive"
            onLoad={() => setReady(true)}
          />
        </>
      )}
      {useGa && (
        <>
          <Script
            id="ga-lib"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga-init"
            strategy="afterInteractive"
            onReady={() => setReady(true)}
          >{`window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${gaId}',{send_page_view:false});`}</Script>
        </>
      )}
      {linkedInId && consent.marketing && (
        <Script
          id="linkedin-insight"
          strategy="lazyOnload"
          onReady={() => setReady(true)}
        >{`window._linkedin_partner_id='${linkedInId}';window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(window._linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName('script')[0];var b=document.createElement('script');b.type='text/javascript';b.async=true;b.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';s.parentNode.insertBefore(b,s)})(window.lintrk);`}</Script>
      )}
    </>
  );
}

declare global {
  interface Window {
    _linkedin_partner_id?: string;
    _linkedin_data_partner_ids?: string[];
    lintrk?: { (a: unknown, b: unknown): void; q: unknown[] };
  }
}
