import fs from "node:fs/promises";
import path from "node:path";
import { loadRuntimeConfig } from "./config.mjs";
import { exportProfilesToGoogleDrive } from "./google-drive.mjs";
import { buildProfile, renderProfileDocument } from "./profile.mjs";
import { evaluateFreelancer } from "./qualify.mjs";
import { buildRunReport, renderSummaryCsv } from "./report.mjs";
import { loadFreelancers } from "./upwork-source.mjs";

function parseArgs(argv) {
  const overrides = {};

  for (const arg of argv) {
    if (!arg.startsWith("--")) {
      continue;
    }

    const [key, value] = arg.slice(2).split("=");
    if (key === "source" && value) {
      overrides.sourceMode = value;
    }
    if (key === "input" && value) {
      overrides.inputPath = path.resolve(value);
    }
  }

  return overrides;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function writeLocalOutput(outputDir, profiles, report) {
  await ensureDir(outputDir);

  for (const profile of profiles) {
    const baseName = `${slugify(profile.name)}-${profile.id}`;
    await fs.writeFile(
      path.join(outputDir, `${baseName}.md`),
      profile.documentText,
      "utf8",
    );
    await fs.writeFile(
      path.join(outputDir, `${baseName}.json`),
      JSON.stringify(profile.json, null, 2),
      "utf8",
    );
  }

  await fs.writeFile(
    path.join(outputDir, "run-report.json"),
    JSON.stringify(report, null, 2),
    "utf8",
  );

  await fs.writeFile(
    path.join(outputDir, "qualified-summary.csv"),
    renderSummaryCsv(profiles),
    "utf8",
  );
}

async function main() {
  const runtimeConfig = await loadRuntimeConfig();
  Object.assign(runtimeConfig, parseArgs(process.argv.slice(2)));

  const freelancers = await loadFreelancers(runtimeConfig);
  const evaluated = freelancers.map((freelancer) => {
    const evaluation = evaluateFreelancer(freelancer, runtimeConfig.searchConfig);
    const profile = buildProfile(freelancer, evaluation);

    return {
      ...profile,
      json: profile,
      documentText: renderProfileDocument(profile),
    };
  });

  const qualifiedProfiles = evaluated.filter((profile) => profile.qualified);
  const rejectedProfiles = evaluated
    .filter((profile) => !profile.qualified)
    .map((profile) => ({
      id: profile.id,
      name: profile.name,
      score: profile.fitScore,
      blockers: profile.blockers,
    }));

  const driveExports = runtimeConfig.googleDrive.enabled
    ? await exportProfilesToGoogleDrive(qualifiedProfiles, runtimeConfig.googleDrive)
    : [];

  const report = buildRunReport(
    runtimeConfig,
    evaluated,
    qualifiedProfiles,
    rejectedProfiles,
    driveExports,
  );

  await writeLocalOutput(runtimeConfig.outputDir, qualifiedProfiles, report);

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
