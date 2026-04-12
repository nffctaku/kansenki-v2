import fs from 'node:fs';
import path from 'node:path';

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        const next = line[i + 1];
        if (next === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ',') {
      out.push(cur);
      cur = '';
      continue;
    }

    cur += ch;
  }

  out.push(cur);
  return out;
}

function toNumOrUndef(v) {
  const s = String(v ?? '').trim();
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

function escStr(s) {
  return JSON.stringify(String(s ?? ''));
}

function main() {
  const repoRoot = process.cwd();
  const inputPath = path.join(repoRoot, 'data', 'wc2026-candidates.csv');
  const outputPath = path.join(repoRoot, 'lib', 'worldcup', 'wc2026Candidates.ts');

  if (!fs.existsSync(inputPath)) {
    console.error(`Input CSV not found: ${inputPath}`);
    console.error('Create it by exporting Google Sheets as CSV, or copy data/wc2026-candidates.template.csv');
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, 'utf8');
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    console.error('CSV has no rows');
    process.exit(1);
  }

  const header = parseCsvLine(lines[0]).map((h) => h.trim());
  const idx = (name) => header.indexOf(name);

  const required = ['country', 'id', 'name', 'position'];
  for (const r of required) {
    if (idx(r) === -1) {
      console.error(`Missing required column: ${r}`);
      process.exit(1);
    }
  }

  const byCountry = {
    jpn: [],
    eng: [],
    bra: [],
    ger: [],
    fra: [],
    esp: [],
  };

  for (let li = 1; li < lines.length; li++) {
    const cols = parseCsvLine(lines[li]);
    const country = (cols[idx('country')] ?? '').trim();
    if (!country) continue;
    if (!(country in byCountry)) continue;

    const id = (cols[idx('id')] ?? '').trim();
    const name = (cols[idx('name')] ?? '').trim();
    const position = (cols[idx('position')] ?? '').trim();

    if (!id || !name || !position) continue;

    const age = idx('age') !== -1 ? toNumOrUndef(cols[idx('age')]) : undefined;
    const club = idx('club') !== -1 ? (cols[idx('club')] ?? '').trim() : '';

    const apps = idx('apps') !== -1 ? toNumOrUndef(cols[idx('apps')]) : undefined;
    const goals = idx('goals') !== -1 ? toNumOrUndef(cols[idx('goals')]) : undefined;
    const assists = idx('assists') !== -1 ? toNumOrUndef(cols[idx('assists')]) : undefined;
    const minutes = idx('minutes') !== -1 ? toNumOrUndef(cols[idx('minutes')]) : undefined;

    const stats = { apps, goals, assists, minutes };
    const hasStats = Object.values(stats).some((v) => typeof v === 'number');

    const row = {
      id,
      name,
      position,
      age,
      club: club || undefined,
      stats: hasStats ? stats : undefined,
    };

    byCountry[country].push(row);
  }

  const ts = `import type { SquadPosition } from '@/types/worldcup';\nimport type { Wc2026CountryCode } from '@/lib/worldcup/wc2026Countries';\n\nexport type Wc2026Candidate = {\n  id: string;\n  name: string;\n  position: SquadPosition;\n  age?: number;\n  club?: string;\n  stats?: {\n    appearances?: number;\n    goals?: number;\n    assists?: number;\n    minutes?: number;\n  };\n};\n\nexport const WC2026_CANDIDATES_BY_COUNTRY: Record<Wc2026CountryCode, Wc2026Candidate[]> = {\n  jpn: [\n${byCountry.jpn
    .map((r) => {
      const statsLines = [];
      if (typeof r.stats?.apps === 'number') statsLines.push(`      appearances: ${r.stats.apps},`);
      if (typeof r.stats?.goals === 'number') statsLines.push(`      goals: ${r.stats.goals},`);
      if (typeof r.stats?.assists === 'number') statsLines.push(`      assists: ${r.stats.assists},`);
      if (typeof r.stats?.minutes === 'number') statsLines.push(`      minutes: ${r.stats.minutes},`);

      const statsBlock =
        statsLines.length > 0
          ? `,\n    stats: {\n${statsLines.join('\n')}\n    }`
          : '';

      const ageLine = typeof r.age === 'number' ? `,\n    age: ${r.age}` : '';
      const clubLine = r.club ? `,\n    club: ${escStr(r.club)}` : '';

      return `    {\n      id: ${escStr(r.id)},\n      name: ${escStr(r.name)},\n      position: ${escStr(r.position)} as SquadPosition${ageLine}${clubLine}${statsBlock},\n    },`;
    })
    .join('\n')}\n  ],\n  eng: [\n${byCountry.eng
    .map((r) => {
      const statsLines = [];
      if (typeof r.stats?.apps === 'number') statsLines.push(`      appearances: ${r.stats.apps},`);
      if (typeof r.stats?.goals === 'number') statsLines.push(`      goals: ${r.stats.goals},`);
      if (typeof r.stats?.assists === 'number') statsLines.push(`      assists: ${r.stats.assists},`);
      if (typeof r.stats?.minutes === 'number') statsLines.push(`      minutes: ${r.stats.minutes},`);

      const statsBlock =
        statsLines.length > 0
          ? `,\n    stats: {\n${statsLines.join('\n')}\n    }`
          : '';

      const ageLine = typeof r.age === 'number' ? `,\n    age: ${r.age}` : '';
      const clubLine = r.club ? `,\n    club: ${escStr(r.club)}` : '';

      return `    {\n      id: ${escStr(r.id)},\n      name: ${escStr(r.name)},\n      position: ${escStr(r.position)} as SquadPosition${ageLine}${clubLine}${statsBlock},\n    },`;
    })
    .join('\n')}\n  ],\n  bra: [\n${byCountry.bra
    .map((r) => {
      const statsLines = [];
      if (typeof r.stats?.apps === 'number') statsLines.push(`      appearances: ${r.stats.apps},`);
      if (typeof r.stats?.goals === 'number') statsLines.push(`      goals: ${r.stats.goals},`);
      if (typeof r.stats?.assists === 'number') statsLines.push(`      assists: ${r.stats.assists},`);
      if (typeof r.stats?.minutes === 'number') statsLines.push(`      minutes: ${r.stats.minutes},`);

      const statsBlock =
        statsLines.length > 0
          ? `,\n    stats: {\n${statsLines.join('\n')}\n    }`
          : '';

      const ageLine = typeof r.age === 'number' ? `,\n    age: ${r.age}` : '';
      const clubLine = r.club ? `,\n    club: ${escStr(r.club)}` : '';

      return `    {\n      id: ${escStr(r.id)},\n      name: ${escStr(r.name)},\n      position: ${escStr(r.position)} as SquadPosition${ageLine}${clubLine}${statsBlock},\n    },`;
    })
    .join('\n')}\n  ],\n  ger: [\n${byCountry.ger
    .map((r) => {
      const statsLines = [];
      if (typeof r.stats?.apps === 'number') statsLines.push(`      appearances: ${r.stats.apps},`);
      if (typeof r.stats?.goals === 'number') statsLines.push(`      goals: ${r.stats.goals},`);
      if (typeof r.stats?.assists === 'number') statsLines.push(`      assists: ${r.stats.assists},`);
      if (typeof r.stats?.minutes === 'number') statsLines.push(`      minutes: ${r.stats.minutes},`);

      const statsBlock =
        statsLines.length > 0
          ? `,\n    stats: {\n${statsLines.join('\n')}\n    }`
          : '';

      const ageLine = typeof r.age === 'number' ? `,\n    age: ${r.age}` : '';
      const clubLine = r.club ? `,\n    club: ${escStr(r.club)}` : '';

      return `    {\n      id: ${escStr(r.id)},\n      name: ${escStr(r.name)},\n      position: ${escStr(r.position)} as SquadPosition${ageLine}${clubLine}${statsBlock},\n    },`;
    })
    .join('\n')}\n  ],\n  fra: [\n${byCountry.fra
    .map((r) => {
      const statsLines = [];
      if (typeof r.stats?.apps === 'number') statsLines.push(`      appearances: ${r.stats.apps},`);
      if (typeof r.stats?.goals === 'number') statsLines.push(`      goals: ${r.stats.goals},`);
      if (typeof r.stats?.assists === 'number') statsLines.push(`      assists: ${r.stats.assists},`);
      if (typeof r.stats?.minutes === 'number') statsLines.push(`      minutes: ${r.stats.minutes},`);

      const statsBlock =
        statsLines.length > 0
          ? `,\n    stats: {\n${statsLines.join('\n')}\n    }`
          : '';

      const ageLine = typeof r.age === 'number' ? `,\n    age: ${r.age}` : '';
      const clubLine = r.club ? `,\n    club: ${escStr(r.club)}` : '';

      return `    {\n      id: ${escStr(r.id)},\n      name: ${escStr(r.name)},\n      position: ${escStr(r.position)} as SquadPosition${ageLine}${clubLine}${statsBlock},\n    },`;
    })
    .join('\n')}\n  ],\n  esp: [\n${byCountry.esp
    .map((r) => {
      const statsLines = [];
      if (typeof r.stats?.apps === 'number') statsLines.push(`      appearances: ${r.stats.apps},`);
      if (typeof r.stats?.goals === 'number') statsLines.push(`      goals: ${r.stats.goals},`);
      if (typeof r.stats?.assists === 'number') statsLines.push(`      assists: ${r.stats.assists},`);
      if (typeof r.stats?.minutes === 'number') statsLines.push(`      minutes: ${r.stats.minutes},`);

      const statsBlock =
        statsLines.length > 0
          ? `,\n    stats: {\n${statsLines.join('\n')}\n    }`
          : '';

      const clubLine = r.club ? `,\n    club: ${escStr(r.club)}` : '';

      return `    {\n      id: ${escStr(r.id)},\n      name: ${escStr(r.name)},\n      position: ${escStr(r.position)} as SquadPosition${clubLine}${statsBlock},\n    },`;
    })
    .join('\n')}\n  ],\n};\n`;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, ts, 'utf8');
  console.log(`Generated: ${outputPath}`);
}

main();
