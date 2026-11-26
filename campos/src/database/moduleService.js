import { db } from "./db";

export async function createModule(data) {
  return db.transaction("rw", db.modules, async () => {
    const existing = await db.modules
      .where("code")
      .equals(data.code)
      .first();

    if (existing) {
      throw new Error("A module with this code already exists.");
    }

    return db.modules.add(data);
  });
}

export async function updateModule(id, data) {
  return db.transaction("rw", db.modules, async () => {
    const existing = await db.modules
      .where("code")
      .equals(data.code)
      .first();

    if (existing && existing.id !== id) {
      throw new Error("A module with this code already exists.");
    }

    return db.modules.update(id, data);
  });
}

export async function deleteModule(id) {
  return db.transaction(
    "rw",
    db.modules,
    db.assessments,
    db.classes,
    async () => {
      await db.assessments
        .where("moduleId")
        .equals(id)
        .delete();

      await db.classes
        .where("moduleId")
        .equals(id)
        .delete();

      await db.modules.delete(id);
    }
  );
}