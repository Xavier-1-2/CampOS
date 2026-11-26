import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "../database/db";

import {
  generateTimetable,
  groupClassesByDay,
  getTodaysClasses,
  calculateTimetableStats
} from "../utils/timetable";

export function useTimetable() {
  const [currentDate, setCurrentDate] =
    useState(() => new Date());

  const data = useLiveQuery(
    async () => {
      const [classes, modules] =
        await Promise.all([
          db.classes.toArray(),
          db.modules.toArray()
        ]);

      return {
        classes,
        modules
      };
    },
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const modules = data?.modules ?? [];

  const classes = generateTimetable(
    data?.classes ?? [],
    modules
  );

  const weeklyTimetable =
    groupClassesByDay(classes);

  const todaysClasses = getTodaysClasses(
    classes,
    currentDate
  );

  const stats = calculateTimetableStats(
    classes,
    currentDate
  );

  return {
    classes,
    modules,
    weeklyTimetable,
    todaysClasses,
    stats,
    currentDate,
    loading: data === undefined
  };
}