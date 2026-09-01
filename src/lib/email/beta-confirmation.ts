import nodemailer from "nodemailer";
import { marketingConfig } from "@/config/marketing";
import { postToLeadWebhook } from "@/lib/leads/webhook";
import { createConfirmationToken } from "./confirmation-token";

type EmailEvent = "sent" | "failed" | "confirmed";

export function isConfirmationEmailConfigured() {
  return Boolean(
    process.env.ZOHO_SMTP_HOST &&
    process.env.ZOHO_SMTP_USER &&
    process.env.ZOHO_SMTP_PASSWORD &&
    process.env.EMAIL_CONFIRMATION_SECRET,
  );
}

export async function recordEmailEvent({
  leadId,
  event,
  emailId,
  occurredAt = new Date().toISOString(),
}: {
  leadId: string;
  event: EmailEvent;
  emailId?: string;
  occurredAt?: string;
}) {
  return postToLeadWebhook({
    action: "email_event",
    lead_id: leadId,
    event,
    email_id: emailId ?? "",
    occurred_at: occurredAt,
  });
}

function confirmationUrl(leadId: string) {
  const url = new URL("/api/email/confirm", marketingConfig.siteUrl);
  url.searchParams.set("token", createConfirmationToken(leadId));
  return url.toString();
}

function emailHtml(url: string) {
  const logoUrl = new URL(
    "/brand/full-logo-colors.png",
    marketingConfig.siteUrl,
  ).toString();

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="color-scheme" content="light">
    <style>
      @media only screen and (max-width:620px) {
        .email-shell { padding:20px 12px !important; }
        .email-card { padding:30px 22px !important; }
        .email-title { font-size:30px !important; }
        .email-button { display:block !important; text-align:center !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f5f3ff;color:#10152f;font-family:Arial,Helvetica,sans-serif">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">Confirma tu correo para completar tu solicitud de aviso en Locapto.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#f5f3ff">
      <tr>
        <td class="email-shell" align="center" style="padding:36px 16px">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px">
            <tr>
              <td class="email-card" style="padding:42px 44px;background:#ffffff;border:1px solid #dedbea;border-radius:20px">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:0 0 30px">
                      <img src="${logoUrl}" width="170" alt="Locapto" style="display:block;width:170px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none">
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="margin:0 0 14px;color:#6556d9;font-size:12px;font-weight:700;line-height:1.4;letter-spacing:.12em;text-transform:uppercase">Lista de avisos</p>
                      <h1 class="email-title" style="margin:0 0 18px;color:#10152f;font-size:36px;line-height:1.14;letter-spacing:-.02em">Confirma tu correo</h1>
                      <p style="margin:0 0 26px;color:#5f6478;font-size:17px;line-height:1.65">Hemos recibido tu solicitud. Confirma que esta dirección es correcta y te avisaremos cuando Locapto esté disponible.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 28px">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td bgcolor="#10152f" style="border-radius:11px">
                            <a class="email-button" href="${url}" style="display:inline-block;padding:15px 24px;color:#ffffff;font-size:16px;font-weight:700;line-height:1.2;text-decoration:none;border:1px solid #10152f;border-radius:11px">Confirmar mi correo</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 20px;background:#f7f8ff;border:1px solid #e8e7f4;border-radius:12px">
                      <p style="margin:0;color:#464c63;font-size:14px;line-height:1.55"><strong style="color:#267f67">✓ Solicitud recibida.</strong> Usaremos tu correo para gestionar este aviso; no registramos la apertura del mensaje.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:26px 0 0">
                      <p style="margin:0 0 10px;color:#777b8d;font-size:13px;line-height:1.6">Si no has solicitado este aviso, puedes ignorar este mensaje. El enlace caduca en 30 días.</p>
                      <p style="margin:0;color:#777b8d;font-size:12px;line-height:1.6">Si el botón no funciona, abre este enlace:<br><a href="${url}" style="color:#6556d9;text-decoration:underline;word-break:break-all">${url}</a></p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:22px 20px 0;color:#7b7f91;font-size:12px;line-height:1.6">
                <p style="margin:0">Locapto · Información para preparar aperturas de negocio</p>
                <p style="margin:4px 0 0"><a href="https://locapto.com" style="color:#6556d9;text-decoration:none">locapto.com</a> · <a href="mailto:victor@locapto.com" style="color:#6556d9;text-decoration:none">victor@locapto.com</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendBetaConfirmationEmail({
  leadId,
  email,
}: {
  leadId: string;
  email: string;
}) {
  if (!isConfirmationEmailConfigured()) return;
  const host = process.env.ZOHO_SMTP_HOST as string;
  const port = Number(process.env.ZOHO_SMTP_PORT ?? "465");
  const user = process.env.ZOHO_SMTP_USER as string;
  const password = process.env.ZOHO_SMTP_PASSWORD as string;
  const from = process.env.ZOHO_FROM_EMAIL ?? `Locapto <${user}>`;
  const replyTo = process.env.ZOHO_REPLY_TO ?? user;
  const url = confirmationUrl(leadId);
  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 15_000,
  });

  let info;
  try {
    info = await transport.sendMail({
      from,
      to: email,
      replyTo,
      subject: "Confirma tu correo para Locapto",
      html: emailHtml(url),
      text: `Hemos recibido tu solicitud. Confirma tu correo en ${url}\n\nSi no has solicitado este aviso, puedes ignorar este mensaje. El enlace caduca en 30 días.`,
      headers: { "X-Locapto-Lead-Id": leadId },
    });
    if (!info.accepted.map(String).includes(email))
      throw new Error("Zoho SMTP rejected the recipient");
  } catch (error) {
    try {
      await recordEmailEvent({ leadId, event: "failed" });
    } catch (recordingError) {
      console.error("Beta email failure could not be recorded", {
        leadId,
        error:
          recordingError instanceof Error ? recordingError.message : "unknown",
      });
    }
    throw error;
  }

  await recordEmailEvent({
    leadId,
    event: "sent",
    emailId: info.messageId,
  });
}
