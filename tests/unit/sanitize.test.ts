import { describe, expect, it } from "vitest";
import {
  escapeSpreadsheetFormula,
  sanitizeForSheet,
} from "@/lib/leads/sanitize";
describe("spreadsheet sanitization", () => {
  it.each(["=SUM(A1:A2)", "+cmd", "-1+2", "@IMPORTXML()"])(
    "escapes formula-like value %s",
    (value) => expect(escapeSpreadsheetFormula(value)).toBe(`'${value}`),
  );
  it("escapes after leading whitespace and removes controls", () =>
    expect(sanitizeForSheet(" \n =cmd\u0000", 30)).toBe("'=cmd"));
  it("leaves ordinary text unchanged", () =>
    expect(sanitizeForSheet("Madrid centro", 30)).toBe("Madrid centro"));
});
