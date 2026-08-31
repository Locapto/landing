// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createConfirmationToken,
  verifyConfirmationToken,
} from "@/lib/email/confirmation-token";

const leadId = "123e4567-e89b-42d3-a456-426614174000";

describe("email confirmation token", () => {
  beforeEach(() => {
    process.env.EMAIL_CONFIRMATION_SECRET = "test-secret-with-enough-entropy";
  });

  afterEach(() => {
    delete process.env.EMAIL_CONFIRMATION_SECRET;
  });

  it("round-trips a signed lead ID", () => {
    const token = createConfirmationToken(leadId);
    expect(verifyConfirmationToken(token)).toMatchObject({ leadId });
    expect(token).not.toContain(leadId);
  });

  it("rejects tampered and expired tokens", () => {
    const token = createConfirmationToken(leadId);
    expect(verifyConfirmationToken(`${token}x`)).toBeNull();

    const expired = createConfirmationToken(
      leadId,
      Math.floor(Date.now() / 1000) - 31 * 24 * 60 * 60,
    );
    expect(verifyConfirmationToken(expired)).toBeNull();
  });
});
