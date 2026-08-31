// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const recordEmailEvent = vi.hoisted(() => vi.fn());
vi.mock("@/lib/email/beta-confirmation", () => ({ recordEmailEvent }));

import { POST } from "@/app/api/email/confirm/route";
import { createConfirmationToken } from "@/lib/email/confirmation-token";

const leadId = "123e4567-e89b-42d3-a456-426614174000";

function request(token: string) {
  return new Request("https://locapto.com/api/email/confirm", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ token }),
  });
}

describe("POST /api/email/confirm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.EMAIL_CONFIRMATION_SECRET = "test-secret-with-enough-entropy";
    recordEmailEvent.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    delete process.env.EMAIL_CONFIRMATION_SECRET;
  });

  it("records an explicit confirmation and redirects locally", async () => {
    const response = await POST(request(createConfirmationToken(leadId)));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://locapto.com/confirmar-email?estado=confirmado",
    );
    expect(recordEmailEvent).toHaveBeenCalledWith({
      leadId,
      event: "confirmed",
    });
  });

  it("does not write an invalid token", async () => {
    const response = await POST(request("invalid"));
    expect(response.headers.get("location")).toContain("estado=invalido");
    expect(recordEmailEvent).not.toHaveBeenCalled();
  });
});
