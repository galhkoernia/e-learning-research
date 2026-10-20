export function csvCell(value: string | number | null) {
  let text = value === null ? "" : String(value);
  // Quoting CSV alone does not prevent spreadsheet formula execution.
  if (/^\s*[=+\-@]|^[\t\r\n]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function csvDocument(headers: string[], rows: (string | number | null)[][]) {
  return "\uFEFF" + [headers, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
}
