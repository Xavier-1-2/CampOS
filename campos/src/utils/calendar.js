import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addDays
} from "date-fns";

export const WEEKDAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun"
];

export const EVENT_CATEGORIES = {
  assignment: "Assignment",
  exam: "Examination",
  quiz: "Quiz",
  project: "Project",
  assessment: "Other Assessment",
  class: "Class",
  custom: "Custom Event"
};

export const CUSTOM_EVENT_TYPES = [
  "Academic Event",
  "Study Session",
  "Meeting",
  "University Deadline",
  "Personal Reminder",
  "Other"
];

export function getDateKey(date) {
  return format(date, "yyyy-MM-dd");
}

export function getCalendarDays(month) {
  const start = startOfWeek(
    startOfMonth(month),
    { weekStartsOn: 1 }
  );

  const end = endOfWeek(
    endOfMonth(month),
    { weekStartsOn: 1 }
  );

  return eachDayOfInterval({ start, end });
}

export function getAssessmentCategory(type) {
  switch (type?.toLowerCase()) {
    case "assignment":
      return "assignment";

    case "exam":
    case "examination":
      return "exam";

    case "quiz":
      return "quiz";

    case "project":
      return "project";

    default:
      return "assessment";
  }
}

export function buildCalendarEvents(
  {
    modules = [],
    assessments = [],
    classes = [],
    events = []
  },
  startDate,
  endDate
) {
  const calendarEvents = [];

  const moduleMap = new Map(
    modules.map((module) => [module.id, module])
  );

  const startKey = getDateKey(startDate);
  const endKey = getDateKey(endDate);

  function isInRange(date) {
    return date >= startKey && date <= endKey;
  }

  // Assessment deadlines
  for (const assessment of assessments) {
    if (!isInRange(assessment.dueDate)) {
      continue;
    }

    const module = moduleMap.get(
      assessment.moduleId
    );

    calendarEvents.push({
      id: `assessment-${assessment.id}`,
      sourceId: assessment.id,
      source: "assessment",
      title: assessment.name,
      date: assessment.dueDate,
      time: "",
      category: getAssessmentCategory(
        assessment.type
      ),
      moduleId: assessment.moduleId,
      moduleCode: module?.code ?? "",
      status: assessment.status,
      description:
        `${assessment.weight}% of final grade`
    });
  }

  // Recurring timetable classes
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  for (const day of days) {
    const weekday = format(day, "EEEE");
    const date = getDateKey(day);

    for (const classItem of classes) {
      const classDay = String(classItem.day)
        .trim()
        .toLowerCase();

      const matchesDay =
        classDay === weekday.toLowerCase() ||
        classDay === weekday
          .slice(0, 3)
          .toLowerCase();

      if (!matchesDay) continue;

      const module = moduleMap.get(
        classItem.moduleId
      );

      calendarEvents.push({
        id: `class-${classItem.id}-${date}`,
        sourceId: classItem.id,
        source: "class",
        title: module?.name ?? "University Class",
        date,
        time: classItem.startTime ?? "",
        endTime: classItem.endTime ?? "",
        category: "class",
        moduleId: classItem.moduleId,
        moduleCode: module?.code ?? "",
        description: classItem.venue ?? ""
      });
    }
  }

  // Manually created events
  for (const event of events) {
    if (!isInRange(event.date)) continue;

    calendarEvents.push({
      id: `custom-${event.id}`,
      sourceId: event.id,
      source: "custom",
      title: event.title,
      date: event.date,
      time: event.time ?? "",
      category: "custom",
      eventType: event.type,
      description: event.description ?? "",
      originalEvent: event
    });
  }

  return calendarEvents.sort((a, b) =>
    a.date.localeCompare(b.date) ||
    a.time.localeCompare(b.time) ||
    a.title.localeCompare(b.title)
  );
}

export function groupEventsByDate(events) {
  const grouped = {};

  for (const event of events) {
    if (!grouped[event.date]) {
      grouped[event.date] = [];
    }

    grouped[event.date].push(event);
  }

  return grouped;
}

export function getUpcomingEvents(data) {
  const today = new Date();
  const endDate = addDays(today, 6);

  return buildCalendarEvents(
    data,
    today,
    endDate
  ).filter(
    (event) =>
      event.source !== "assessment" ||
      event.status === "Pending"
  );
}

export function formatEventTime(time) {
  if (!time) return "All day";

  return format(
    parseISO(`2000-01-01T${time}`),
    "h:mm a"
  );
}