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
  return `<!doctype html>
<html lang="es">
  <body style="margin:0;background:#f7f5ff;color:#14182b;font-family:Arial,sans-serif">
    <div style="display:none;max-height:0;overflow:hidden">Confirma tu correo para completar tu solicitud de aviso en Locapto.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5ff;padding:32px 16px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e5e5ee;border-radius:18px;padding:36px">
          <tr><td>
            <p style="margin:0 0 18px;color:#6556d9;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Locapto</p>
            <h1 style="margin:0 0 18px;font-size:30px;line-height:1.15">Confirma tu correo</h1>
            <p style="margin:0 0 24px;color:#5f6478;font-size:16px;line-height:1.65">Hemos recibido tu solicitud. Confirma que esta dirección es correcta y te avisaremos cuando Locapto esté disponible.</p>
            <p style="margin:0 0 28px"><a href="${url}" style="display:inline-block;border-radius:10px;background:#10152f;color:#ffffff;padding:14px 22px;font-size:16px;font-weight:700;text-decoration:none">Confirmar mi correo</a></p>
            <p style="margin:0;color:#777b8d;font-size:13px;line-height:1.6">Si no has solicitado este aviso, puedes ignorar este mensaje. El enlace caduca en 30 días.</p>
          </td></tr>
        </table>
      </td></tr>
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
