import { NextResponse } from 'next/server';

const OPENFOOTBALL_PL_2025_26_URL = 'https://openfootball.github.io/england/2025-26/1-premierleague.json';

type OpenFootballMatch = {
  round?: string;
  date?: string;
  time?: string;
  team1?: string;
  team2?: string;
};

type OpenFootballPayload = {
  name?: string;
  matches?: OpenFootballMatch[];
};

const teamNameToClubId: Record<string, string> = {
  'Arsenal FC': 'ars',
  'Aston Villa': 'avl',
  'AFC Bournemouth': 'bou',
  'Brentford FC': 'bre',
  'Chelsea FC': 'che',
  'Crystal Palace': 'cry',
  'Everton FC': 'eve',
  'Fulham FC': 'ful',
  'Leeds United': 'lee',
  'Liverpool FC': 'liv',
  'Manchester City': 'mc',
  'Manchester United': 'mu',
  'Newcastle United': 'new',
  'Nottingham Forest': 'nfo',
  'Sunderland AFC': 'sun',
  'Tottenham Hotspur': 'tot',
  'West Ham United': 'whu',
  'Wolverhampton Wanderers': 'wol',
  'Burnley FC': 'bur',
  'Brighton & Hove Albion': 'bha',
};

function toManualRoundLabel(round?: string) {
  if (!round) return undefined;
  const m = round.match(/Matchday\s+(\d+)/i);
  if (!m) return round;
  return `第${m[1]}節`;
}

function timeZonePartsToUtcMs(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
) {
  const assumedUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts = fmt.formatToParts(assumedUtc);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? '0');

  const tzYear = get('year');
  const tzMonth = get('month');
  const tzDay = get('day');
  const tzHour = get('hour');
  const tzMinute = get('minute');
  const tzSecond = get('second');

  const asIfUtcMs = Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMinute, tzSecond);
  const offsetMs = asIfUtcMs - assumedUtc.getTime();
  return assumedUtc.getTime() - offsetMs;
}

function toKickoffAt(date?: string, time?: string) {
  if (!date) return { kickoffAt: null, kickoffTbd: false };

  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const t = time?.match(/^(\d{2}):(\d{2})$/);
  if (!m) return { kickoffAt: null, kickoffTbd: false };

  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);

  const hour = t ? Number(t[1]) : 0;
  const minute = t ? Number(t[2]) : 0;

  const utcMs = timeZonePartsToUtcMs(year, month, day, hour, minute, 'Europe/London');
  return { kickoffAt: new Date(utcMs).toISOString(), kickoffTbd: !t };
}

export async function GET() {
  try {
    const res = await fetch(OPENFOOTBALL_PL_2025_26_URL, { next: { revalidate: 60 * 60 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch fixtures', status: res.status }, { status: 502 });
    }

    const json = (await res.json()) as OpenFootballPayload;
    const matches = json?.matches ?? [];

    const items = matches
      .map((m) => {
        const homeClubId = m.team1 ? teamNameToClubId[m.team1] : undefined;
        const awayClubId = m.team2 ? teamNameToClubId[m.team2] : undefined;
        if (!homeClubId || !awayClubId) return null;

        const { kickoffAt, kickoffTbd } = toKickoffAt(m.date, m.time);
        const roundLabel = toManualRoundLabel(m.round);

        return {
          id: `pl-2526-${m.round ?? 'unknown'}-${homeClubId}-${awayClubId}-${kickoffAt ?? 'tbd'}`,
          competitionId: 'PL' as const,
          roundLabel,
          kickoffAt,
          kickoffTbd: kickoffTbd || undefined,
          homeClubId,
          awayClubId,
          sourceUrl: OPENFOOTBALL_PL_2025_26_URL,
        };
      })
      .filter(Boolean);

    return NextResponse.json(
      { items },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=3600',
        },
      }
    );
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
