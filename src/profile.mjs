export function buildProfile(freelancer, evaluation) {
  return {
    id: freelancer.id,
    name: freelancer.name,
    title: freelancer.title,
    fitScore: evaluation.score,
    qualified: evaluation.qualified,
    profileUrl: freelancer.profileUrl,
    country: freelancer.country,
    hourlyRate: freelancer.hourlyRate,
    jobSuccess: freelancer.jobSuccess,
    totalEarnings: freelancer.totalEarnings,
    hoursBilled: freelancer.hoursBilled,
    skills: freelancer.skills || [],
    summary: freelancer.overview || "",
    reasons: evaluation.reasons,
    blockers: evaluation.blockers,
    nextAction: evaluation.qualified ? "shortlist" : "skip",
  };
}

export function renderProfileDocument(profile) {
  const lines = [
    `${profile.name}`,
    `${profile.title}`,
    "",
    `Fit score: ${profile.fitScore}/100`,
    `Qualified: ${profile.qualified ? "Yes" : "No"}`,
    `Next action: ${profile.nextAction}`,
    "",
    `Location: ${profile.country}`,
    `Rate: $${profile.hourlyRate}/hr`,
    `Job success: ${profile.jobSuccess}%`,
    `Total earnings: $${profile.totalEarnings}`,
    `Hours billed: ${profile.hoursBilled}`,
    `Profile URL: ${profile.profileUrl}`,
    "",
    "Skills",
    profile.skills.join(", "),
    "",
    "Why matched",
    ...(profile.reasons.length > 0 ? profile.reasons.map((reason) => `- ${reason}`) : ["- None"]),
    "",
    "Risks or gaps",
    ...(profile.blockers.length > 0 ? profile.blockers.map((reason) => `- ${reason}`) : ["- None"]),
    "",
    "Summary",
    profile.summary,
  ];

  return lines.join("\n");
}
