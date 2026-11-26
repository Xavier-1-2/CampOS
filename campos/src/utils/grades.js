export function calculateModuleStats(assessments) {
  const gradedAssessments = assessments.filter(
    (assessment) =>
      assessment.status === "Graded" &&
      assessment.grade !== null
  );

  const totalWeight = assessments.reduce(
    (total, assessment) =>
      total + assessment.weight,
    0
  );

  const gradedWeight = gradedAssessments.reduce(
    (total, assessment) =>
      total + assessment.weight,
    0
  );

  const earnedPoints = gradedAssessments.reduce(
    (total, assessment) =>
      total +
      (assessment.grade * assessment.weight) / 100,
    0
  );

  const currentAverage =
    gradedWeight > 0
      ? (earnedPoints / gradedWeight) * 100
      : null;

  const pendingCount = assessments.filter(
    (assessment) =>
      assessment.status === "Pending"
  ).length;

  const submittedCount = assessments.filter(
    (assessment) =>
      assessment.status === "Submitted"
  ).length;

  return {
    totalAssessments: assessments.length,
    pendingCount,
    submittedCount,
    gradedCount: gradedAssessments.length,
    totalWeight,
    gradedWeight,
    earnedPoints,
    currentAverage,
    remainingWeight: Math.max(0, 100 - gradedWeight)
  };
}