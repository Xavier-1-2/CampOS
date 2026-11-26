import {
  differenceInCalendarDays,
  parseISO
} from "date-fns";

export function calculateUrgency(daysLeft) {
  return Math.max(
    0,
    Math.min(100, 100 - daysLeft * 10)
  );
}

export function calculatePriorityScore(daysLeft, weight) {
  const urgency = calculateUrgency(daysLeft);

  return urgency * 0.6 + weight * 0.4;
}

export function getPriorityLevel(score, daysLeft) {
  if (daysLeft < 0 || score >= 70) {
    return "Critical";
  }

  if (score >= 50) {
    return "High";
  }

  if (score >= 30) {
    return "Medium";
  }

  return "Low";
}

export function getDeadlineLabel(daysLeft) {
  if (daysLeft < 0) {
    const overdueDays = Math.abs(daysLeft);

    return `${overdueDays} day${
      overdueDays === 1 ? "" : "s"
    } overdue`;
  }

  if (daysLeft === 0) {
    return "Due today";
  }

  if (daysLeft === 1) {
    return "Due tomorrow";
  }

  return `Due in ${daysLeft} days`;
}

export function generateAcademicTasks(
  assessments,
  modules,
  currentDate = new Date()
) {
  const moduleMap = new Map(
    modules.map((module) => [module.id, module])
  );

  const tasks = assessments
    .filter(
      (assessment) =>
        assessment.status === "Pending" &&
        moduleMap.has(assessment.moduleId)
    )
    .map((assessment) => {
      const module = moduleMap.get(
        assessment.moduleId
      );

      const daysLeft = differenceInCalendarDays(
        parseISO(assessment.dueDate),
        currentDate
      );

      const urgency = calculateUrgency(daysLeft);

      const priorityScore = calculatePriorityScore(
        daysLeft,
        assessment.weight
      );

      return {
        ...assessment,

        moduleCode: module.code,
        moduleName: module.name,

        daysLeft,
        urgency,
        priorityScore,

        priorityLevel: getPriorityLevel(
          priorityScore,
          daysLeft
        ),

        deadlineLabel: getDeadlineLabel(daysLeft),

        isOverdue: daysLeft < 0,

        isDueSoon:
          daysLeft >= 0 && daysLeft <= 3
      };
    });

  return tasks.sort((a, b) => {
    // Overdue assessments come first.
    if (a.isOverdue !== b.isOverdue) {
      return a.isOverdue ? -1 : 1;
    }

    // Higher priority scores come first.
    if (a.priorityScore !== b.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }

    // Earlier deadlines break ties.
    if (a.daysLeft !== b.daysLeft) {
      return a.daysLeft - b.daysLeft;
    }

    // Higher assessment weights break further ties.
    if (a.weight !== b.weight) {
      return b.weight - a.weight;
    }

    return a.id - b.id;
  });
}

export function calculateTaskStats(tasks) {
  return {
    total: tasks.length,

    overdue: tasks.filter(
      (task) => task.isOverdue
    ).length,

    dueSoon: tasks.filter(
      (task) => task.isDueSoon
    ).length,

    critical: tasks.filter(
      (task) => task.priorityLevel === "Critical"
    ).length,

    high: tasks.filter(
      (task) => task.priorityLevel === "High"
    ).length
  };
}