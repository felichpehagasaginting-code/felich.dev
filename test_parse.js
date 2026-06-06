const fs = require('fs');
const html = fs.readFileSync('contribs.html', 'utf8');
const matches = html.match(/<(td|rect)[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g) || [];
const days = [];
for (const match of matches) {
  const dateMatch = match.match(/data-date="([^"]+)"/);
  const levelMatch = match.match(/data-level="([^"]+)"/);
  if (dateMatch && levelMatch) {
    days.push({ date: dateMatch[1], level: parseInt(levelMatch[1], 10) });
  }
}
days.sort((a, b) => a.date.localeCompare(b.date));
console.log('Total sorted days:', days.length);
console.log('Last 14 days:', days.slice(days.length - 14, days.length));
