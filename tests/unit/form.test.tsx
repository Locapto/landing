import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BetaLeadForm } from "@/components/BetaLeadForm";

const consent = { analytics: true, marketing: false, decided: true };

describe("availability lead form", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("locapto_consent_v1", JSON.stringify(consent));
    window.dataLayer = [];
    window.gtag = (_command, event, properties) => {
      window.dataLayer?.push({
        event: String(event),
        ...((properties as Record<string, unknown>) ?? {}),
      });
    };
    window.history.replaceState({}, "", "/");
    vi.restoreAllMocks();
  });
  afterEach(cleanup);

  it("does not convert when validation fails", async () => {
    const fetchMock = vi.spyOn(window, "fetch");
    render(<BetaLeadForm />);
    await userEvent.click(
      screen.getByRole("button", { name: "Avísame cuando esté disponible" }),
    );
    expect(fetchMock).not.toHaveBeenCalled();
    expect(
      window.dataLayer?.some((item) => item.event === "generate_lead"),
    ).toBe(false);
  });

  it("does not convert when storage rejects the request", async () => {
    vi.spyOn(window, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: false }), {
        status: 502,
        headers: { "content-type": "application/json" },
      }),
    );
    render(<BetaLeadForm />);
    await userEvent.type(screen.getByLabelText(/^Email/), "qa@example.com");
    await userEvent.selectOptions(
      screen.getByLabelText("¿Cuál es tu perfil? *"),
      "emprendedor",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Avísame cuando esté disponible" }),
    );
    await screen.findByRole("alert");
    expect(
      window.dataLayer?.some((item) => item.event === "generate_lead"),
    ).toBe(false);
  });

  it("blocks rapid duplicate submits and converts after storage succeeds", async () => {
    let resolveRequest!: (response: Response) => void;
    const pending = new Promise<Response>((resolve) => {
      resolveRequest = resolve;
    });
    const fetchMock = vi.spyOn(window, "fetch").mockReturnValue(pending);
    render(<BetaLeadForm />);
    await userEvent.type(screen.getByLabelText(/^Email/), "qa@example.com");
    await userEvent.selectOptions(
      screen.getByLabelText("¿Cuál es tu perfil? *"),
      "emprendedor",
    );
    const button = screen.getByRole("button", {
      name: "Avísame cuando esté disponible",
    });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    resolveRequest(
      new Response(
        JSON.stringify({
          ok: true,
          leadId: "123e4567-e89b-42d3-a456-426614174000",
          status: "partial",
          qualified: false,
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    await screen.findByRole("heading", {
      name: "Gracias. Te avisaremos cuando Locapto esté disponible.",
    });
    await waitFor(() =>
      expect(
        window.dataLayer?.filter((item) => item.event === "generate_lead"),
      ).toHaveLength(1),
    );
  });

  it("replaces an incompatible lead ID saved by an older session", async () => {
    sessionStorage.setItem("locapto_beta_lead_id", "legacy-id");
    const fetchMock = vi.spyOn(window, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          leadId: "123e4567-e89b-42d3-a456-426614174000",
          status: "partial",
          qualified: false,
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    render(<BetaLeadForm />);
    await userEvent.type(screen.getByLabelText(/^Email/), "qa@example.com");
    await userEvent.selectOptions(
      screen.getByLabelText("¿Cuál es tu perfil? *"),
      "emprendedor",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Avísame cuando esté disponible" }),
    );

    const payload = JSON.parse(
      String((fetchMock.mock.calls[0]?.[1] as RequestInit | undefined)?.body),
    ) as { leadId: string };
    expect(payload.leadId).not.toBe("legacy-id");
    expect(payload.leadId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });
});
