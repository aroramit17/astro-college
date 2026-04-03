import fs from "node:fs/promises";
import { loadFreelancersFromCsv } from "./csv-source.mjs";

export async function loadFreelancers(runtimeConfig) {
  if (runtimeConfig.sourceMode === "json") {
    const raw = await fs.readFile(runtimeConfig.inputPath, "utf8");
    return JSON.parse(raw);
  }

  if (runtimeConfig.sourceMode === "csv") {
    return loadFreelancersFromCsv(runtimeConfig.inputPath);
  }

  if (runtimeConfig.sourceMode === "upwork-api") {
    throw new Error(
      [
        "SOURCE_MODE=upwork-api is reserved for the official Upwork API path.",
        "Wire in the approved endpoint and auth flow after your Upwork API access is enabled.",
      ].join(" "),
    );
  }

  throw new Error(`Unsupported SOURCE_MODE: ${runtimeConfig.sourceMode}`);
}
