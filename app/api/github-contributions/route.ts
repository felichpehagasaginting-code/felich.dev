import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const username = process.env.GITHUB_USERNAME || 'felichpehagasaginting-code';
    const token = process.env.GITHUB_TOKEN;
    const requiredWeeks = 20;

    if (token) {
      const query = `
        query {
          user(login: "${username}") {
            contributionsCollection {
              contributionCalendar {
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `;

      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        throw new Error(`GitHub GraphQL responded with status: ${response.status}`);
      }

      const json = await response.json();
      if (json.errors) {
        throw new Error(`GraphQL Error: ${json.errors[0].message}`);
      }

      const calendarWeeks = json.data.user.contributionsCollection.contributionCalendar.weeks;
      const targetWeeks = calendarWeeks.slice(-requiredWeeks);
      
      const weeks = targetWeeks.map((week: any) => {
        const days = week.contributionDays.map((day: any) => {
          const count = day.contributionCount;
          let level = 0;
          if (count > 0 && count <= 3) level = 1;
          else if (count > 3 && count <= 6) level = 2;
          else if (count > 6 && count <= 10) level = 3;
          else if (count > 10) level = 4;
          return { count, level, date: day.date };
        });
        
        while (days.length < 7) {
          days.push({ count: 0, level: 0, date: '' });
        }
        return days;
      });

      while (weeks.length < requiredWeeks) {
        weeks.unshift(Array(7).fill({ count: 0, level: 0, date: '' }));
      }

      return NextResponse.json({ weeks });
    }

    // Fallback: Fetch user public contributions HTML page
    const response = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`GitHub HTML responded with status: ${response.status}`);
    }

    const html = await response.text();
    const matches = html.match(/<(td|rect)[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g) || [];
    const days: { date: string; level: number; count: number }[] = [];

    for (const match of matches) {
      const dateMatch = match.match(/data-date="([^"]+)"/);
      const levelMatch = match.match(/data-level="([^"]+)"/);
      if (dateMatch && levelMatch) {
        const level = parseInt(levelMatch[1], 10);
        // Estimate count from level for the fallback (it won't be exact, but roughly accurate for colors)
        let count = 0;
        if (level === 1) count = 1;
        if (level === 2) count = 4;
        if (level === 3) count = 7;
        if (level === 4) count = 11;
        
        days.push({
          date: dateMatch[1],
          level,
          count,
        });
      }
    }

    if (days.length === 0) {
      throw new Error('No contribution days parsed from GitHub HTML');
    }

    days.sort((a, b) => a.date.localeCompare(b.date));

    let startIndex = 0;
    while (startIndex < days.length) {
      const [year, month, day] = days[startIndex].date.split('-').map(Number);
      const dayOfWeek = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
      if (dayOfWeek === 0) break;
      startIndex++;
    }
    const alignedDays = days.slice(startIndex);
    const numWeeks = Math.floor(alignedDays.length / 7);

    let targetDays = alignedDays;
    if (numWeeks >= requiredWeeks) {
      const startIndexForWeeks = (numWeeks - requiredWeeks) * 7;
      targetDays = alignedDays.slice(startIndexForWeeks, startIndexForWeeks + (requiredWeeks * 7));
    }

    const weeks = [];
    for (let i = 0; i < targetDays.length; i += 7) {
      const weekDays = targetDays.slice(i, i + 7);
      
      while (weekDays.length < 7) {
        weekDays.push({ count: 0, level: 0, date: '' });
      }
      weeks.push(weekDays);
    }

    while (weeks.length < requiredWeeks) {
      weeks.unshift(Array(7).fill({ count: 0, level: 0, date: '' }));
    }

    return NextResponse.json({ weeks });
  } catch (error: any) {
    console.error('Failed to fetch GitHub contributions:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
