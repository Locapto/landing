import type { Metadata } from "next";
import { ArrowLeft, MailCheck } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { verifyConfirmationToken } from "@/lib/email/confirmation-token";

export const metadata: Metadata = {
  title: "Confirma tu correo | Locapto",
  description: "Confirma el correo de tu solicitud de aviso de Locapto.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/confirmar-email" },
};

type State = "confirmado" | "invalido" | "error";

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; estado?: State }>;
}) {
  const { token = "", estado } = await searchParams;
  let validToken = false;
  if (token) {
    try {
      validToken = Boolean(verifyConfirmationToken(token));
    } catch {
      validToken = false;
    }
  }
  if (token && validToken) {
    redirect(`/api/email/confirm?token=${encodeURIComponent(token)}`);
  }

  const confirmed = estado === "confirmado";
  const failed = estado === "error";
  const invalid = estado === "invalido" || Boolean(token);

  return (
    <>
      <SiteHeader reduced />
      <main id="contenido" className="thanks-page">
        <div className="shell narrow">
          <span className="thanks-check" aria-hidden="true">
            {confirmed ? "✓" : <MailCheck />}
          </span>
          <p className="eyebrow">Lista de avisos</p>
          {confirmed ? (
            <>
              <h1>Correo confirmado.</h1>
              <p>
                La dirección ha quedado confirmada. Te avisaremos cuando Locapto
                esté disponible.
              </p>
            </>
          ) : failed ? (
            <>
              <h1>No hemos podido confirmar el correo.</h1>
              <p>
                Ha ocurrido un problema temporal. Vuelve a intentarlo desde el
                enlace del email dentro de unos minutos.
              </p>
            </>
          ) : invalid ? (
            <>
              <h1>Este enlace ya no es válido.</h1>
              <p>
                El enlace puede haber caducado o estar incompleto. Puedes volver
                a solicitar el aviso desde la landing.
              </p>
            </>
          ) : (
            <>
              <h1>Falta el enlace de confirmación.</h1>
              <p>Abre el enlace completo que has recibido por correo.</p>
            </>
          )}
          <Link className="button button-quiet" href="/#acceso-beta">
            <ArrowLeft aria-hidden="true" />
            Volver a Locapto
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
