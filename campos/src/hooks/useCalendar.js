import { useLiveQuery } from "dexie-react-hooks";

import { db } from "../database/db";

import {
  getCalendarDays,
  buildCalendarEvents,
  groupEventsByDate,
  getUpcomingEvents
} from "../utils/calendar";

export function useCalendar(
  currentMonth,
  selectedDate
) {
  const data = useLiveQuery(
    async () => {
      const [
        modules,
        assessments,
        classes,
        events
      ] = await Promise.all([
        db.modules.toArray(),
        db.assessments.toArray(),
        db.classes.toArray(),
        db.events.toArray()
      ]);

      return {
        modules,
        assessments,
        classes,
        events
      };
    },
    []
  );

  const source = data ?? {
    modules: [],
    assessments: [],
    classes: [],
    events: []
  };

  const calendarDays = getCalendarDays(
    currentMonth
  );

  const calendarEvents = buildCalendarEvents(
    source,
    calendarDays[0],
    calendarDays[calendarDays.length - 1]
  );

  const eventsByDate = groupEventsByDate(
    calendarEvents
  );

  const selectedDayEvents =
    eventsByDate[selectedDate] ?? [];

  const upcomingEvents = getUpcomingEvents(
    source
  );

  return {
    calendarDays,
    calendarEvents,
    eventsByDate,
    selectedDayEvents,
    upcomingEvents,
    loading: data === undefined
  };
}