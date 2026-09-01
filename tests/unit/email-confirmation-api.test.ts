// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const recordEmailEvent = vi.hoisted(() => vi.fn());
vi.mock("@/lib/email/beta-confirmation", () => ({ recordEmailEvent }));

import { GET, POST } from "@/app/api/email/confirm/route";
import { createConfirmationToken } from "@/lib/email/confirmation-token";

const leadId = "123e4567-e89b-42d3-a456-426614174000";

function postRequest(token: string) {
  return new Request("https://locapto.com/api/email/confirm", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ token }),
  });
}

function getRequest(token: string) {
  const url = new URL("https://locapto.com/api/email/confirm");
  url.searchParams.set("token", token);
  return new Request(url);
}

describe("/api/email/confirm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.EMAIL_CONFIRMATION_SECRET = "test-secret-with-enough-entropy";
    recordEmailEvent.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    delete process.env.EMAIL_CONFIRMATION_SECRET;
  });

  it("confirms directly from the email link and redirects locally", async () => {
    const response = await GET(getRequest(createConfirmationToken(leadId)));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://locapto.com/confirmar-email?estado=confirmado",
    );
    expect(recordEmailEvent).toHaveBeenCalledWith({
      leadId,
      event: "confirmed",
    });
  });

  it("keeps POST support for confirmation pages already open", async () => {
    const response = await POST(postRequest(createConfirmationToken(leadId)));
    expect(response.headers.get("location")).toContain("estado=confirmado");
  });

  it("does not write an invalid token", async () => {
    const response = await GET(getRequest("invalid"));
    expect(response.headers.get("location")).toContain("estado=invalido");
    expect(recordEmailEvent).not.toHaveBeenCalled();
  });
});
