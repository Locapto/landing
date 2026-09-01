import { NextResponse } from "next/server";
import { verifyConfirmationToken } from "@/lib/email/confirmation-token";
import { recordEmailEvent } from "@/lib/email/beta-confirmation";

export const runtime = "nodejs";

function confirmationPage(request: Request, state: string) {
  return NextResponse.redirect(
    new URL(`/confirmar-email?estado=${state}`, request.url),
    { status: 303, headers: { "cache-control": "no-store" } },
  );
}

async function confirm(request: Request, token: FormDataEntryValue | null) {
  if (typeof token !== "string") return confirmationPage(request, "invalido");

  let confirmation;
  try {
    confirmation = verifyConfirmationToken(token);
  } catch {
    return confirmationPage(request, "error");
  }
  if (!confirmation) return confirmationPage(request, "invalido");

  try {
    await recordEmailEvent({
      leadId: confirmation.leadId,
      event: "confirmed",
    });
    return confirmationPage(request, "confirmado");
  } catch (error) {
    console.error("Beta email confirmation failed", {
      leadId: confirmation.leadId,
      error: error instanceof Error ? error.message : "unknown",
    });
    return confirmationPage(request, "error");
  }
}

export async function GET(request: Request) {
  return confirm(request, new URL(request.url).searchParams.get("token"));
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  return confirm(request, form?.get("token") ?? null);
}
