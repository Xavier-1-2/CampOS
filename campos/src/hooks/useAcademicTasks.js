import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "../database/db";

import {
  generateAcademicTasks,
  calculateTaskStats
} from "../utils/priority";

export function useAcademicTasks() {
  const [currentDate, setCurrentDate] =
    useState(() => new Date());

  const data = useLiveQuery(
    async () => {
      const [assessments, modules] =
        await Promise.all([
          db.assessments.toArray(),
          db.modules.toArray()
        ]);

      return {
        assessments,
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

  const assessments = data?.assessments ?? [];
  const modules = data?.modules ?? [];

  const tasks = generateAcademicTasks(
    assessments,
    modules,
    currentDate
  );

  const stats = calculateTaskStats(tasks);

  return {
    tasks,
    stats,
    modules,
    loading: data === undefined
  };
}