// Generate an .ics (iCalendar) file from set budget limits so deadlines and
// payment reminders can be imported into Google Calendar. No connector needed.

function lastDayOfMonth(ym) {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m, 0); // day 0 of next month == last day of this month
}

function fmtDate(d) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

function fmtStamp(d) {
  return `${fmtDate(d)}T${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}${String(d.getSeconds()).padStart(2, '0')}Z`;
}

function escapeICS(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function generateBudgetICS(budgets) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FinTrack//Budget Sync//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  for (const b of budgets) {
    const end = lastDayOfMonth(b.month);
    const remind = new Date(end);
    remind.setDate(end.getDate() - 2);

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:fintrack-${b.id || b.category}-${b.month}@fintrack.app`);
    lines.push(`DTSTAMP:${fmtStamp(new Date())}`);
    lines.push(`DTSTART;VALUE=DATE:${fmtDate(end)}`);
    lines.push(`SUMMARY:${escapeICS(`${b.category} budget deadline (₹${b.monthly_limit})`)}`);
    lines.push(`DESCRIPTION:${escapeICS(`FinTrack monthly budget limit for ${b.category} is ₹${b.monthly_limit} for ${b.month}. Review your spending on FinTrack.`)}`);
    lines.push('STATUS:CONFIRMED');
    lines.push('TRANSP:BUSY');
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:-P2D');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:${escapeICS(`Payment reminder: ${b.category} budget of ₹${b.monthly_limit} is due in 2 days`)}`);
    lines.push('END:VALARM');
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadICS(content, filename) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}