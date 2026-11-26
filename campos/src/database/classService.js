import { db } from "./db";

import {
  DAYS_OF_WEEK,
  timeToMinutes,
  classesOverlap,
  formatTimeRange
} from "../utils/timetable";

async function validateClass(
  data,
  excludedId = null
) {
  const module = await db.modules.get(
    data.moduleId
  );

  if (!module) {
    throw new Error(
      "Please select a valid module."
    );
  }

  if (!DAYS_OF_WEEK.includes(data.day)) {
    throw new Error(
      "Please select a valid day."
    );
  }

  const timePattern =
    /^([01]\d|2[0-3]):[0-5]\d$/;

  if (
    !timePattern.test(data.startTime) ||
    !timePattern.test(data.endTime)
  ) {
    throw new Error(
      "Please enter valid start and end times."
    );
  }

  if (
    timeToMinutes(data.endTime) <=
    timeToMinutes(data.startTime)
  ) {
    throw new Error(
      "End time must be later than start time."
    );
  }

  if (!data.venue?.trim()) {
    throw new Error(
      "Please enter a venue or online meeting link."
    );
  }

  const existingClasses = await db.classes
    .where("day")
    .equals(data.day)
    .toArray();

  const conflict = existingClasses.find(
    (classItem) =>
      classItem.id !== excludedId &&
      classesOverlap(data, classItem)
  );

  if (conflict) {
    const conflictingModule =
      await db.modules.get(conflict.moduleId);

    throw new Error(
      `Schedule conflict with ${
        conflictingModule?.code || "another class"
      } on ${conflict.day}, ` +
      `${formatTimeRange(
        conflict.startTime,
        conflict.endTime
      )}.`
    );
  }
}

export async function createClass(data) {
  return db.transaction(
    "rw",
    db.modules,
    db.classes,
    async () => {
      await validateClass(data);

      return db.classes.add(data);
    }
  );
}

export async function updateClass(id, data) {
  return db.transaction(
    "rw",
    db.modules,
    db.classes,
    async () => {
      const existing = await db.classes.get(id);

      if (!existing) {
        throw new Error("Class not found.");
      }

      await validateClass(data, id);

      return db.classes.update(id, data);
    }
  );
}

export async function deleteClass(id) {
  return db.classes.delete(id);
}