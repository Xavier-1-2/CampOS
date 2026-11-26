import { db } from "./db";

import {
  CUSTOM_EVENT_TYPES
} from "../utils/calendar";

import {
  isValid,
  parseISO,
  format
} from "date-fns";

function validateEvent(data) {
  const title = data.title?.trim();

  if (!title) {
    throw new Error("Event title is required.");
  }

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
    !isValid(parseISO(data.date)) ||
    format(parseISO(data.date), "yyyy-MM-dd")
      !== data.date
  ) {
    throw new Error("Enter a valid event date.");
  }

  if (!CUSTOM_EVENT_TYPES.includes(data.type)) {
    throw new Error("Invalid event type.");
  }

  const time = data.time || "";

  if (
    time &&
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
  ) {
    throw new Error("Enter a valid event time.");
  }

  return {
    title,
    date: data.date,
    time,
    type: data.type,
    description: data.description?.trim() ?? ""
  };
}

export async function createEvent(data) {
  return db.events.add(
    validateEvent(data)
  );
}

export async function updateEvent(id, data) {
  const updated = await db.events.update(
    id,
    validateEvent(data)
  );

  if (!updated) {
    throw new Error("Event not found.");
  }

  return updated;
}

export async function deleteEvent(id) {
  return db.events.delete(id);
}