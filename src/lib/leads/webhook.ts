const WEBHOOK_TIMEOUT_MS = 8_000;

export type LeadWebhookResult = {
  ok: true;
  lead_id?: string;
  status?: string;
  created?: boolean;
};

export function isLeadWebhookConfigured() {
  return Boolean(
    process.env.GOOGLE_SHEETS_WEBHOOK_URL &&
    process.env.GOOGLE_SHEETS_WEBHOOK_SECRET,
  );
}

export async function postToLeadWebhook(
  payload: Record<string, unknown>,
): Promise<LeadWebhookResult> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
  if (!webhookUrl || !webhookSecret)
    throw new Error("Lead storage is not configured");

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...payload, webhook_secret: webhookSecret }),
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    redirect: "follow",
    cache: "no-store",
  });
  const result = (await response.json().catch(() => null)) as
    LeadWebhookResult | { ok?: false; error?: string } | null;
  if (!response.ok || !result?.ok)
    throw new Error(`Webhook rejected request (${response.status})`);
  return result;
}
