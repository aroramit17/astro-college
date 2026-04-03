function normalize(values) {
  return values.map((value) => value.toLowerCase());
}

function includesAny(text, keywords) {
  const normalizedText = text.toLowerCase();
  return keywords.some((keyword) => normalizedText.includes(keyword.toLowerCase()));
}

export function evaluateFreelancer(freelancer, criteria) {
  const skills = freelancer.skills || [];
  const normalizedSkills = normalize(skills);
  const requiredSkills = normalize(criteria.requiredSkills || []);
  const preferredSkills = normalize(criteria.preferredSkills || []);
  const keywords = criteria.keywords || [];
  const overview = [freelancer.title || "", freelancer.overview || ""].join(" ");

  const missingRequiredSkills = requiredSkills.filter(
    (skill) => !normalizedSkills.includes(skill),
  );
  const preferredMatches = preferredSkills.filter((skill) =>
    normalizedSkills.includes(skill),
  );
  const keywordMatched = keywords.length === 0 || includesAny(overview, keywords);

  const blockers = [];
  if (missingRequiredSkills.length > 0) {
    blockers.push(`Missing required skills: ${missingRequiredSkills.join(", ")}`);
  }
  if ((criteria.excludedCountries || []).includes(freelancer.country)) {
    blockers.push(`Country excluded: ${freelancer.country}`);
  }
  if (freelancer.hourlyRate > criteria.maxHourlyRate) {
    blockers.push(`Hourly rate too high: $${freelancer.hourlyRate}`);
  }
  if (freelancer.jobSuccess < criteria.minJobSuccess) {
    blockers.push(`Job success below threshold: ${freelancer.jobSuccess}%`);
  }
  if (freelancer.totalEarnings < criteria.minTotalEarnings) {
    blockers.push(`Total earnings below threshold: $${freelancer.totalEarnings}`);
  }
  if (freelancer.hoursBilled < criteria.minHoursBilled) {
    blockers.push(`Hours billed below threshold: ${freelancer.hoursBilled}`);
  }
  if (!keywordMatched) {
    blockers.push("Profile text does not include target keywords");
  }

  let score = 0;
  score += (requiredSkills.length - missingRequiredSkills.length) * 20;
  score += preferredMatches.length * 8;
  score += Math.min(Math.round(freelancer.jobSuccess / 5), 20);
  score += freelancer.hourlyRate <= criteria.maxHourlyRate ? 10 : 0;
  score += freelancer.totalEarnings >= criteria.minTotalEarnings ? 10 : 0;
  score += freelancer.hoursBilled >= criteria.minHoursBilled ? 10 : 0;
  score += keywordMatched ? 10 : 0;
  score = Math.min(score, 100);

  const qualified = blockers.length === 0 && score >= criteria.fitScoreThreshold;

  const reasons = [];
  if (missingRequiredSkills.length === 0) {
    reasons.push("Has all required skills");
  }
  if (preferredMatches.length > 0) {
    reasons.push(`Preferred skills matched: ${preferredMatches.join(", ")}`);
  }
  if (freelancer.jobSuccess >= criteria.minJobSuccess) {
    reasons.push(`Strong job success: ${freelancer.jobSuccess}%`);
  }
  if (freelancer.totalEarnings >= criteria.minTotalEarnings) {
    reasons.push(`Meaningful earnings history: $${freelancer.totalEarnings}`);
  }
  if (keywordMatched) {
    reasons.push("Profile language matches the target search intent");
  }

  return {
    qualified,
    score,
    blockers,
    reasons,
  };
}
