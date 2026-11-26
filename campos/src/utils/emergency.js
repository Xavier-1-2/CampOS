import { addDays, format } from "date-fns";

export function assessWorkload(tasks) {
  const pending = tasks.length;

  const overdue = tasks.filter(
    (task) => task.isOverdue
  ).length;

  const critical = tasks.filter(
    (task) => task.priorityLevel === "Critical"
  ).length;

  const dueSoon = tasks.filter(
    (task) => task.isDueSoon
  ).length;

  let level = "Manageable";
  let message =
    "Your recorded workload is manageable. Continue working through your responsibilities.";

  if (pending === 0) {
    level = "Clear";

    message =
      "You have no pending assessments recorded in CampOS.";
  } else if (
    overdue >= 2 ||
    critical >= 3 ||
    dueSoon >= 5
  ) {
    level = "High";

    message =
      "Several academic responsibilities require attention. Use your recovery plan to organize your next steps.";
  } else if (
    overdue >= 1 ||
    critical >= 1 ||
    dueSoon >= 2
  ) {
    level = "Elevated";

    message =
      "Some academic responsibilities require immediate attention. Prioritize approaching deadlines.";
  }

  return {
    level,
    message,
    pending,
    overdue,
    critical,
    dueSoon
  };
}

export function getRecommendedAction(task) {
  if (task.isOverdue) {
    return (
      "Confirm whether late submission is accepted. " +
      "Contact your lecturer if necessary and complete " +
      "the assessment if submission is still possible."
    );
  }

  if (task.daysLeft === 0) {
    return (
      "Prioritize completing this assessment and " +
      "verify its submission deadline and requirements."
    );
  }

  if (task.daysLeft === 1) {
    return (
      "Allocate focused study time today. " +
      "Complete the remaining work before tomorrow's deadline."
    );
  }

  if (task.type === "Exam") {
    return (
      "Begin structured revision. Review the module outline, " +
      "identify weak topics and practise relevant questions."
    );
  }

  if (task.weight >= 25) {
    return (
      "This assessment contributes significantly to your " +
      "final module grade. Break it into smaller milestones " +
      "and begin preparation early."
    );
  }

  if (task.daysLeft <= 3) {
    return (
      "Begin or continue working on this assessment. " +
      "Aim to finish before the deadline."
    );
  }

  return (
    "Schedule preparation time in advance and " +
    "monitor the approaching deadline."
  );
}

export function generateRecommendations(tasks) {
  const recommendations = [];

  if (tasks.length === 0) {
    return [
      {
        title: "Maintain your progress",
        description:
          "Keep your module outlines updated and review upcoming academic responsibilities."
      }
    ];
  }

  const overdueTasks = tasks.filter(
    (task) => task.isOverdue
  );

  const dueToday = tasks.filter(
    (task) => task.daysLeft === 0
  );

  const dueSoon = tasks.filter(
    (task) =>
      task.daysLeft > 0 &&
      task.daysLeft <= 3
  );

  const highWeight = tasks.filter(
    (task) => task.weight >= 25
  );

  const exams = tasks.filter(
    (task) => task.type === "Exam"
  );

  if (overdueTasks.length > 0) {
    recommendations.push({
      title: "Address overdue assessments",
      description:
        `Review your ${overdueTasks.length} overdue assessment(s). ` +
        "Confirm late submission eligibility and contact the relevant lecturers."
    });
  }

  if (dueToday.length > 0) {
    recommendations.push({
      title: "Protect today's deadlines",
      description:
        `You have ${dueToday.length} assessment(s) due today. ` +
        "Verify submission times and prioritize work that can still be completed."
    });
  }

  if (dueSoon.length > 0) {
    recommendations.push({
      title: "Prepare for approaching deadlines",
      description:
        `${dueSoon.length} assessment(s) are due within the next three days. ` +
        "Allocate focused work sessions to complete them."
    });
  }

  if (highWeight.length > 0) {
    recommendations.push({
      title: "Protect your academic performance",
      description:
        `${highWeight.length} pending assessment(s) contribute at least 25% ` +
        "to their respective module grades. Avoid leaving preparation until the last minute."
    });
  }

  if (exams.length > 0) {
    recommendations.push({
      title: "Begin examination preparation",
      description:
        `You have ${exams.length} upcoming or outstanding examination(s). ` +
        "Check their dates and organize revision for upcoming exams."
    });
  }

  recommendations.push({
    title: "Work through one priority at a time",
    description:
      "Break large assessments into smaller tasks, take reasonable breaks " +
      "and reassess your workload after each completed responsibility."
  });

  return recommendations;
}

export function generateRecoveryPlan(
  tasks,
  currentDate = new Date()
) {
  const days = Array.from(
    { length: 7 },
    (_, index) => {
      const date = addDays(currentDate, index);

      return {
        day: index,
        date: format(date, "yyyy-MM-dd"),

        label:
          index === 0
            ? "Today"
            : index === 1
              ? "Tomorrow"
              : format(date, "EEEE"),

        formattedDate: format(date, "MMM d"),

        tasks: []
      };
    }
  );

  const laterTasks = [];

  for (const task of tasks) {
    if (task.daysLeft < 0) {
      days[0].tasks.push({
        ...task,
        action: "Review overdue assessment"
      });
    } else if (task.daysLeft <= 6) {
      days[task.daysLeft].tasks.push({
        ...task,
        action:
          task.daysLeft === 0
            ? "Complete / submit today"
            : "Assessment deadline"
      });
    } else {
      laterTasks.push({
        ...task,
        action: "Plan ahead"
      });
    }
  }

  // Select one future assessment for preparation today.
  const preparationTask = tasks.find(
    (task) => task.daysLeft > 0
  );

  if (preparationTask) {
    days[0].tasks.push({
      ...preparationTask,
      action: "Begin or continue preparation"
    });
  }

  return {
    days,
    laterTasks
  };
}

export function generateEmergencyPlan(
  tasks,
  currentDate = new Date()
) {
  const workload = assessWorkload(tasks);

  const immediateFocus =
    tasks.length > 0
      ? {
          ...tasks[0],
          recommendedAction:
            getRecommendedAction(tasks[0])
        }
      : null;

  return {
    workload,
    immediateFocus,

    recommendations:
      generateRecommendations(tasks),

    recoveryPlan:
      generateRecoveryPlan(tasks, currentDate)
  };
}