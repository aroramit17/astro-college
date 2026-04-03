import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

export async function loadRuntimeConfig() {
  const searchConfigPath = path.resolve(
    process.env.SEARCH_CONFIG_PATH || "./config/search-config.json",
  );
  const rawConfig = await fs.readFile(searchConfigPath, "utf8");
  const searchConfig = JSON.parse(rawConfig);

  return {
    sourceMode: process.env.SOURCE_MODE || "json",
    inputPath: path.resolve(process.env.INPUT_PATH || "./data/sample-freelancers.json"),
    outputDir: path.resolve(process.env.OUTPUT_DIR || "./output"),
    searchConfigPath,
    searchConfig,
    googleDrive: {
      enabled: process.env.ENABLE_GOOGLE_DRIVE === "true",
      folderId: process.env.GOOGLE_DRIVE_FOLDER_ID || "",
      clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
      privateKey: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    },
    upwork: {
      apiBaseUrl: process.env.UPWORK_API_BASE_URL || "https://www.upwork.com/api",
      accessToken: process.env.UPWORK_ACCESS_TOKEN || "",
      savedQuery: process.env.UPWORK_SEARCH_SAVED_QUERY || "",
    },
  };
}
