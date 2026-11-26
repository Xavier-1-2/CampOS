import { differenceInCalendarDays } from "date-fns";

export function getPriority(assessment) {
  const daysLeft = differenceInCalendarDays(
    new Date(`${assessment.dueDate}T00:00:00`),
    new Date()
  );

  const urgency = Math.max(
    0,
    Math.min(100, 100 - daysLeft * 10)
  );

  const impact = assessment.weight;

  return (urgency * 0.6) + (impact * 0.4);
}

const prioritizedTasks = assessments
  .filter(a => a.status === "Pending")
  .map(a => ({
    ...a,
    priority: getPriority(a)
  }))
  .sort((a, b) => b.priority - a.priority);