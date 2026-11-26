import Dexie from "dexie";

export const db = new Dexie("CampOS");

db.version(1).stores({
  modules: "++id, code, name",
  assessments: "++id, moduleId, dueDate, status",
  classes: "++id, moduleId, day",
  transactions: "++id, type, category, date",
  events: "++id, date, type"
});

db.version(2).stores({
  budgets: "month"
});