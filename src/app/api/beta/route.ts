import { betaLeadSchema } from "@/lib/leads/schema";
import { isQualifiedLead, scoreLead } from "@/lib/leads/scoring";
import { buildSheetsPayload } from "@/lib/leads/sheets";
import type { MonthlyCases, Persona } from "@/lib/leads/types";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 32_000;

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES)
    return json({ ok: false, message: "Solicitud no válida." }, 413);
  if (!sameOrigin(request))
    return json({ ok: false, message: "Solicitud no válida." }, 403);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, message: "Solicitud no válida." }, 400);
  }
  const parsed = betaLeadSchema.safeParse(raw);
  if (!parsed.success)
    return json(
      { ok: false, message: "Revisa los campos e inténtalo de nuevo." },
      400,
    );
  const input = parsed.data;
  const leadId = input.leadId ?? crypto.randomUUID();

  if (input.website)
    return json({ ok: true, leadId, status: input.stage, qualified: false });

  const persona = input.persona as Persona;
  const monthlyCases =
    input.stage === "complete"
      ? (input.monthlyCases as MonthlyCases | undefined)
      : undefined;
  const score = scoreLead(persona, monthlyCases, input.selectedPlan);
  const qualified = isQualifiedLead(input.stage, persona, monthlyCases);
  const payload = buildSheetsPayload(input, { leadId, score, qualified });
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
  if (!webhookUrl || !webhookSecret) {
    console.error("Beta lead storage is not configured", {
      leadId,
      stage: input.stage,
    });
    return json(
      {
        ok: false,
        message:
          "El servicio no está disponible temporalmente. Inténtalo de nuevo.",
      },
      503,
    );
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, webhook_secret: webhookSecret }),
      signal: AbortSignal.timeout(8_000),
      redirect: "follow",
      cache: "no-store",
    });
    const result = (await response.json().catch(() => null)) as {
      ok?: boolean;
    } | null;
    if (!response.ok || !result?.ok)
      throw new Error(`Webhook rejected request (${response.status})`);
    return json({ ok: true, leadId, status: input.stage, qualified });
  } catch (error) {
    console.error("Beta lead storage failed", {
      leadId,
      stage: input.stage,
      error: error instanceof Error ? error.message : "unknown",
    });
    return json(
      {
        ok: false,
        message: "No hemos podido guardar la solicitud. Inténtalo de nuevo.",
      },
      502,
    );
  }
}
