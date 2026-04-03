import fs from "node:fs/promises";

function splitCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function coerceNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function loadFreelancersFromCsv(inputPath) {
  const raw = await fs.readFile(inputPath, "utf8");
  const lines = raw.split(/\r?\n/).filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers = splitCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));

    return {
      id: row.id,
      name: row.name,
      title: row.title,
      overview: row.overview,
      skills: row.skills ? row.skills.split("|").map((skill) => skill.trim()).filter(Boolean) : [],
      hourlyRate: coerceNumber(row.hourlyRate),
      jobSuccess: coerceNumber(row.jobSuccess),
      totalEarnings: coerceNumber(row.totalEarnings),
      hoursBilled: coerceNumber(row.hoursBilled),
      country: row.country,
      profileUrl: row.profileUrl,
    };
  });
}
