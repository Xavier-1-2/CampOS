import { format, startOfDay, addMinutes } from "date-fns";

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

export function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

export function formatTime(time) {
  const minutes = timeToMinutes(time);

  const date = addMinutes(
    startOfDay(new Date()),
    minutes
  );

  return format(date, "h:mm a");
}

export function formatTimeRange(startTime, endTime) {
  return `${formatTime(startTime)} – ${formatTime(endTime)}`;
}

export function calculateClassDuration(
  startTime,
  endTime
) {
  return (
    timeToMinutes(endTime) -
    timeToMinutes(startTime)
  );
}

export function classesOverlap(firstClass, secondClass) {
  if (firstClass.day !== secondClass.day) {
    return false;
  }

  const firstStart = timeToMinutes(
    firstClass.startTime
  );

  const firstEnd = timeToMinutes(
    firstClass.endTime
  );

  const secondStart = timeToMinutes(
    secondClass.startTime
  );

  const secondEnd = timeToMinutes(
    secondClass.endTime
  );

  return (
    firstStart < secondEnd &&
    secondStart < firstEnd
  );
}

export function getOnlineClassLink(venue) {
  try {
    const url = new URL(venue);

    if (
      url.protocol === "https:" ||
      url.protocol === "http:"
    ) {
      return url.href;
    }

    return null;
  } catch {
    return null;
  }
}

export function generateTimetable(
  classes,
  modules
) {
  const moduleMap = new Map(
    modules.map((module) => [
      module.id,
      module
    ])
  );

  return classes
    .filter((classItem) =>
      moduleMap.has(classItem.moduleId)
    )
    .map((classItem) => {
      const module = moduleMap.get(
        classItem.moduleId
      );

      return {
        ...classItem,

        moduleCode: module.code,
        moduleName: module.name,
        tutor: module.tutor,
        credits: module.credits,

        duration: calculateClassDuration(
          classItem.startTime,
          classItem.endTime
        ),

        onlineLink: getOnlineClassLink(
          classItem.venue
        )
      };
    })
    .sort((a, b) => {
      const dayDifference =
        DAYS_OF_WEEK.indexOf(a.day) -
        DAYS_OF_WEEK.indexOf(b.day);

      if (dayDifference !== 0) {
        return dayDifference;
      }

      return a.startTime.localeCompare(
        b.startTime
      );
    });
}

export function groupClassesByDay(classes) {
  return DAYS_OF_WEEK.map((day) => ({
    day,

    classes: classes.filter(
      (classItem) => classItem.day === day
    )
  }));
}

export function getTodaysClasses(
  classes,
  currentDate = new Date()
) {
  const today = format(currentDate, "EEEE");

  return classes.filter(
    (classItem) => classItem.day === today
  );
}

export function calculateTimetableStats(
  classes,
  currentDate = new Date()
) {
  const todaysClasses = getTodaysClasses(
    classes,
    currentDate
  );

  const totalMinutes = classes.reduce(
    (total, classItem) =>
      total + classItem.duration,
    0
  );

  return {
    weeklyClasses: classes.length,
    classesToday: todaysClasses.length,
    weeklyHours: totalMinutes / 60,

    activeDays: new Set(
      classes.map((classItem) => classItem.day)
    ).size
  };
}