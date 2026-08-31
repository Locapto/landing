// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMail = vi.hoisted(() => vi.fn());
const postToLeadWebhook = vi.hoisted(() => vi.fn());

vi.mock("nodemailer", () => ({
  default: {
    createTransport: () => ({ sendMail }),
  },
}));
vi.mock("@/lib/leads/webhook", () => ({ postToLeadWebhook }));

import { sendBetaConfirmationEmail } from "@/lib/email/beta-confirmation";

const leadId = "123e4567-e89b-42d3-a456-426614174000";

describe("beta confirmation email", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ZOHO_SMTP_HOST = "smtp.zoho.eu";
    process.env.ZOHO_SMTP_USER = "victor@locapto.com";
    process.env.ZOHO_SMTP_PASSWORD = "test-password";
    process.env.EMAIL_CONFIRMATION_SECRET = "test-secret-with-enough-entropy";
    sendMail.mockResolvedValue({
      messageId: "email_123",
      accepted: ["qa@example.com"],
      rejected: [],
    });
    postToLeadWebhook.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    delete process.env.ZOHO_SMTP_HOST;
    delete process.env.ZOHO_SMTP_USER;
    delete process.env.ZOHO_SMTP_PASSWORD;
    delete process.env.EMAIL_CONFIRMATION_SECRET;
  });

  it("sends once with a signed local link and stores the provider ID", async () => {
    await sendBetaConfirmationEmail({ leadId, email: "qa@example.com" });

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Locapto <victor@locapto.com>",
        to: "qa@example.com",
        headers: { "X-Locapto-Lead-Id": leadId },
        html: expect.stringContaining(
          "https://locapto.com/confirmar-email?token=",
        ),
      }),
    );
    expect(postToLeadWebhook).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "email_event",
        lead_id: leadId,
        event: "sent",
        email_id: "email_123",
      }),
    );
  });

  it("records an immediate SMTP failure", async () => {
    sendMail.mockRejectedValue(new Error("Authentication failed"));

    await expect(
      sendBetaConfirmationEmail({ leadId, email: "qa@example.com" }),
    ).rejects.toThrow("Authentication failed");

    expect(postToLeadWebhook).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "email_event",
        lead_id: leadId,
        event: "failed",
      }),
    );
  });
});
