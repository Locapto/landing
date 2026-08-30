export function normalizeText(value: string, maxLength: number) {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function escapeSpreadsheetFormula(value: string) {
  return /^\s*[=+@-]/.test(value) ? `'${value}` : value;
}

export function sanitizeForSheet(value: string, maxLength: number) {
  return escapeSpreadsheetFormula(normalizeText(value, maxLength));
}
