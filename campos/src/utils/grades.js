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

export function calculateTargetGrade(
  assessments,
  target
) {
  const stats = calculateModuleStats(assessments);

  const outlineComplete =
    Math.abs(stats.totalWeight - 100) < 0.000001;

  if (!outlineComplete) {
    return {
      status: "incomplete-outline"
    };
  }

  if (
    !Number.isFinite(target) ||
    target < 0 ||
    target > 100
  ) {
    return {
      status: "invalid-target"
    };
  }

  const maximumPossible =
    stats.earnedPoints + stats.remainingWeight;

  if (target <= stats.earnedPoints + 0.000001) {
    return {
      status: "achieved",
      requiredAverage: 0,
      maximumPossible
    };
  }

  if (target > maximumPossible + 0.000001) {
    return {
      status: "unattainable",
      maximumPossible
    };
  }

  if (stats.remainingWeight < 0.000001) {
    return {
      status: "unattainable",
      maximumPossible
    };
  }

  const requiredAverage =
    ((target - stats.earnedPoints) /
      stats.remainingWeight) * 100;

  return {
    status: "achievable",
    requiredAverage: Math.min(100, requiredAverage),
    maximumPossible
  };
}

export function calculateProjectedGrade(
  assessments,
  hypotheticalGrades
) {
  const stats = calculateModuleStats(assessments);

  if (Math.abs(stats.totalWeight - 100) >= 0.000001) {
    return null;
  }

  let projectedGrade = stats.earnedPoints;

  const ungradedAssessments = assessments.filter(
    (assessment) =>
      assessment.status !== "Graded"
  );

  for (const assessment of ungradedAssessments) {
    const value = hypotheticalGrades[assessment.id];

    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return null;
    }

    const grade = Number(value);

    if (
      !Number.isFinite(grade) ||
      grade < 0 ||
      grade > 100
    ) {
      return null;
    }

    projectedGrade +=
      (grade * assessment.weight) / 100;
  }

  return projectedGrade;
}