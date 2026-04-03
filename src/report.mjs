export function buildRunReport(runtimeConfig, evaluated, qualifiedProfiles, rejectedProfiles, driveExports) {
  return {
    sourceMode: runtimeConfig.sourceMode,
    evaluatedCount: evaluated.length,
    qualifiedCount: qualifiedProfiles.length,
    rejectedCount: rejectedProfiles.length,
    qualifiedProfiles: qualifiedProfiles.map((profile) => ({
      id: profile.id,
      name: profile.name,
      fitScore: profile.fitScore,
      nextAction: profile.nextAction,
      profileUrl: profile.profileUrl,
    })),
    rejectedProfiles,
    driveExports,
  };
}

export function renderSummaryCsv(qualifiedProfiles) {
  const headers = [
    "id",
    "name",
    "fitScore",
    "hourlyRate",
    "jobSuccess",
    "country",
    "nextAction",
    "profileUrl",
  ];

  const rows = qualifiedProfiles.map((profile) => [
    profile.id,
    profile.name,
    String(profile.fitScore),
    String(profile.hourlyRate),
    String(profile.jobSuccess),
    profile.country,
    profile.nextAction,
    profile.profileUrl,
  ]);

  return [headers, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
}
