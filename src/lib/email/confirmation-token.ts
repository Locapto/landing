import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ConfirmationTokenPayload = {
  leadId: string;
  expiresAt: number;
};

function signingSecret() {
  const secret = process.env.EMAIL_CONFIRMATION_SECRET;
  if (!secret) throw new Error("Email confirmation is not configured");
  return secret;
}

function signature(payload: string) {
  return createHmac("sha256", signingSecret())
    .update(payload)
    .digest("base64url");
}

export function createConfirmationToken(
  leadId: string,
  now = Math.floor(Date.now() / 1000),
) {
  if (!UUID.test(leadId)) throw new Error("Invalid lead ID");
  const payload = Buffer.from(
    JSON.stringify({ leadId, expiresAt: now + TOKEN_TTL_SECONDS }),
  ).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function verifyConfirmationToken(token: string) {
  if (!token || token.length > 1_000) return null;
  const [payload, receivedSignature, extra] = token.split(".");
  if (!payload || !receivedSignature || extra) return null;

  const expected = Buffer.from(signature(payload), "base64url");
  const received = Buffer.from(receivedSignature, "base64url");
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  )
    return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Partial<ConfirmationTokenPayload>;
    if (
      typeof parsed.leadId !== "string" ||
      !UUID.test(parsed.leadId) ||
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt < Math.floor(Date.now() / 1000)
    )
      return null;
    return { leadId: parsed.leadId, expiresAt: parsed.expiresAt };
  } catch {
    return null;
  }
}
