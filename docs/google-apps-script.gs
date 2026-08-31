const SHEET_NAME = "Beta Leads";
const HEADERS = [
  "lead_id", "created_at", "updated_at", "status", "email", "persona",
  "persona_other", "name", "company", "monthly_cases", "locations", "interests",
  "selected_plan", "price_seen", "pricing_experiment", "lead_score",
  "qualified", "utm_source", "utm_medium", "utm_campaign", "utm_content",
  "utm_term", "landing_variant", "page_path", "referrer", "email_provider_id",
  "email_status", "email_sent_at", "email_delivered_at", "email_confirmed_at",
  "email_failed_at"
];

function setup() {
  const spreadsheetId = requireProperty_("SPREADSHEET_ID");
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  const current = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (current.join("|") !== HEADERS.join("|")) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#10152f").setFontColor("#ffffff");
  sheet.autoResizeColumns(1, HEADERS.length);
  return { spreadsheetId: spreadsheetId, sheetName: SHEET_NAME, headers: HEADERS.length };
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return json_({ ok: false, error: "invalid_request" });
    const body = JSON.parse(e.postData.contents);
    const expectedSecret = requireProperty_("WEBHOOK_SECRET");
    if (!body.webhook_secret || body.webhook_secret !== expectedSecret) return json_({ ok: false, error: "unauthorized" });
    delete body.webhook_secret;
    if (body.action === "email_event") validateEmailEvent_(body);
    else validatePayload_(body);

    const lock = LockService.getScriptLock();
    if (!lock.tryLock(5000)) return json_({ ok: false, error: "busy" });
    try {
      const spreadsheet = SpreadsheetApp.openById(requireProperty_("SPREADSHEET_ID"));
      const sheet = spreadsheet.getSheetByName(SHEET_NAME);
      if (!sheet) throw new Error("Missing sheet. Run setup() first.");
      const rowNumber = findLeadRow_(sheet, body.lead_id);
      if (body.action === "email_event") {
        if (!rowNumber) return json_({ ok: false, error: "lead_not_found" });
        updateEmailEvent_(sheet, rowNumber, body);
        return json_({ ok: true, lead_id: body.lead_id, event: body.event });
      }
      if (!rowNumber && body.status !== "partial") return json_({ ok: false, error: "lead_not_found" });
      if (rowNumber) updateRow_(sheet, rowNumber, body);
      else appendRow_(sheet, body);
      return json_({ ok: true, lead_id: body.lead_id, status: body.status, created: !rowNumber });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error("Locapto beta webhook failed", error && error.message ? error.message : String(error));
    return json_({ ok: false, error: "request_failed" });
  }
}

function validateEmailEvent_(body) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(body.lead_id || ""))) throw new Error("Invalid lead_id");
  if (["sent", "delivered", "bounced", "complained", "failed", "suppressed", "confirmed"].indexOf(body.event) === -1) throw new Error("Invalid email event");
  if (String(body.email_id || "").length > 200) throw new Error("Invalid email id");
  if (String(body.occurred_at || "").length > 80) throw new Error("Invalid event time");
}

function validatePayload_(body) {
  if (!body || body.action !== "upsert") throw new Error("Invalid action");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(body.lead_id || ""))) throw new Error("Invalid lead_id");
  if (["partial", "complete"].indexOf(body.status) === -1) throw new Error("Invalid status");
  if (body.status === "partial" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email || ""))) throw new Error("Invalid email");
  if (String(body.persona || "").length > 80) throw new Error("Invalid persona");
  if (String(body.persona_other || "").length > 120) throw new Error("Invalid other persona");
  Object.keys(body).forEach(function (key) {
    if (typeof body[key] === "string" && body[key].length > 1000) throw new Error("Value too long");
  });
}

function findLeadRow_(sheet, leadId) {
  if (sheet.getLastRow() < 2) return 0;
  const found = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).createTextFinder(String(leadId)).matchEntireCell(true).findNext();
  return found ? found.getRow() : 0;
}

function appendRow_(sheet, body) {
  const row = HEADERS.map(function (header) {
    if (header === "created_at") return sanitizeCell_(body.created_at || new Date().toISOString());
    return sanitizeCell_(body[header]);
  });
  sheet.appendRow(row);
}

function updateRow_(sheet, rowNumber, body) {
  const current = sheet.getRange(rowNumber, 1, 1, HEADERS.length).getValues()[0];
  const next = HEADERS.map(function (header, index) {
    if (header === "created_at") return current[index];
    if (Object.prototype.hasOwnProperty.call(body, header)) return sanitizeCell_(body[header]);
    return current[index];
  });
  sheet.getRange(rowNumber, 1, 1, HEADERS.length).setValues([next]);
}

function updateEmailEvent_(sheet, rowNumber, body) {
  const occurredAt = body.occurred_at || new Date().toISOString();
  const priority = { sent: 1, delivered: 2, confirmed: 3, bounced: 4, complained: 4, failed: 4, suppressed: 4 };
  const statusColumn = HEADERS.indexOf("email_status") + 1;
  const currentStatus = String(sheet.getRange(rowNumber, statusColumn).getValue() || "");
  const changes = {};
  if (!priority[currentStatus] || priority[body.event] >= priority[currentStatus]) changes.email_status = body.event;
  if (body.email_id) changes.email_provider_id = body.email_id;
  if (body.event === "sent") changes.email_sent_at = occurredAt;
  if (body.event === "delivered") changes.email_delivered_at = occurredAt;
  if (body.event === "confirmed") changes.email_confirmed_at = occurredAt;
  if (["bounced", "complained", "failed", "suppressed"].indexOf(body.event) !== -1) changes.email_failed_at = occurredAt;
  updateRow_(sheet, rowNumber, changes);
}

function sanitizeCell_(value) {
  if (value === null || typeof value === "undefined") return "";
  if (typeof value === "boolean" || typeof value === "number") return value;
  let text = String(value).replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, 1000);
  if (/^\s*[=+@-]/.test(text)) text = "'" + text;
  return text;
}

function requireProperty_(name) {
  const value = PropertiesService.getScriptProperties().getProperty(name);
  if (!value) throw new Error("Missing Script Property: " + name);
  return value;
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
