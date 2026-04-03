# Upwork Freelancer Qualification Pipeline

This project is a compliant starting point for sourcing freelancers and saving qualified profiles into Google Drive.

It does **not** scrape Upwork profile pages directly. Instead, it gives you:

- a configurable qualification pipeline
- sample JSON and CSV input modes so you can demo the workflow now
- a source adapter you can extend for the official Upwork API once your API access is approved
- a Google Drive exporter that creates a Google Doc summary and a JSON record for each qualified freelancer

## What it does

1. Loads freelancer records from a source adapter
2. Applies your qualification criteria
3. Scores each freelancer
4. Generates a profile summary for qualified candidates
5. Writes local output files
6. Optionally uploads the profile package into a Google Drive folder

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy the env template:

```bash
cp .env.example .env
```

3. Run the demo against sample freelancers:

```bash
npm run demo
```

4. Check the generated files in `./output`

## Supported source modes

- `json`: load freelancer records from a JSON file
- `csv`: load freelancer records from a CSV file
- `upwork-api`: reserved for the official Upwork API path once access is approved

Example CSV run:

```bash
node src/index.mjs --source=csv --input=./data/sample-freelancers.csv
```

Expected CSV headers:

```text
id,name,title,overview,skills,hourlyRate,jobSuccess,totalEarnings,hoursBilled,country,profileUrl
```

Use `skills` as a `|`-separated field, for example:

```text
React|Node.js|TypeScript
```

## Configuration

Edit [`config/search-config.json`](/Users/Amit/Documents/upworks-scraper/config/search-config.json) to define your criteria:

- required skills
- preferred skills
- excluded countries
- hourly rate ceiling
- minimum job success
- minimum total earnings
- text keywords
- fit score threshold

## Google Drive setup

This project expects a Google service account with access to your target Drive folder.

Required env vars:

- `ENABLE_GOOGLE_DRIVE=true`
- `GOOGLE_DRIVE_FOLDER_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`

Then share the target Google Drive folder with the service account email.

## Upwork source adapter

Today, the `upwork-api` mode is a guarded placeholder. It intentionally throws until you wire in the exact official endpoint and auth flow you’re approved to use.

That keeps the codebase ready for the compliant path without pretending a public scraper is okay.

## Typical workflow

1. Collect candidate freelancer rows through an allowed source.
2. Save them as CSV or JSON in `./data`.
3. Tune your requirements in [`config/search-config.json`](/Users/Amit/Documents/upworks-scraper/config/search-config.json).
4. Run the pipeline.
5. Review local output in `./output`.
6. Enable Google Drive export when you are ready to store qualified profiles remotely.

## Commands

```bash
npm start
npm run demo
```
