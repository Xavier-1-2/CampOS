export function calculateRequiredGrade(
  assessments,
  target
) {
  const completed = assessments.filter(
    a => a.grade != null
  );

  const earned = completed.reduce(
    (total, a) =>
      total + (a.grade * a.weight) / 100,
    0
  );

  const completedWeight = completed.reduce(
    (total, a) => total + a.weight,
    0
  );

  const remainingWeight = 100 - completedWeight;

  if (remainingWeight <= 0) return null;

  return Math.max(
    0,
    ((target - earned) / remainingWeight) * 100
  );
}