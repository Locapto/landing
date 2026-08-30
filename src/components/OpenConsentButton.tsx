"use client";

export function OpenConsentButton() {
  return (
    <button
      className="footer-button"
      type="button"
      onClick={() => window.dispatchEvent(new Event("locapto:open-consent"))}
    >
      Configurar cookies
    </button>
  );
}
