// Generic inbound payload NetSuite (or a SuiteScript restlet/workflow action) sends
export interface NetSuiteAlertPayload {
  source: 'netsuite'; // constant, useful once payloads are merged upstream
  recordType: string; // e.g. "salesorder", "customer", "inventoryitem"
  recordId: string | number;
  eventType: string; // "create" | "update" | "delete" | a custom action name
  title: string; // short human-readable summary, e.g. "Sales Order #1042 approved"
  message?: string; // longer body text, optional
  severity?: 'info' | 'success' | 'warning' | 'error'; // defaults to "info"
  url?: string; // deep link back to the NetSuite record
  fields?: { label: string; value: string }[]; // arbitrary key/value context (amount, customer, etc.)
  space: string; // which Google Chat space/webhook to post to
  timestamp?: string; // ISO 8601, defaults to receipt time if omitted
}
