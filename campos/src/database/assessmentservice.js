import { db } from "./db";

async function validateAssessment(data, excludedId = null) {
  const module = await db.modules.get(data.moduleId);

  if (!module) {
    throw new Error("The associated module does not exist.");
  }

  if (!data.name?.trim()) {
    throw new Error("Assessment name is required.");
  }

  if (!data.dueDate) {
    throw new Error("A due date is required.");
  }

  if (
    !Number.isFinite(data.weight) ||
    data.weight <= 0 ||
    data.weight > 100
  ) {
    throw new Error("Weight must be between 0 and 100.");
  }

  if (!["Pending", "Submitted", "Graded"].includes(data.status)) {
    throw new Error("Invalid assessment status.");
  }

  if (data.status === "Graded") {
    if (
      !Number.isFinite(data.grade) ||
      data.grade < 0 ||
      data.grade > 100
    ) {
      throw new Error("Grade must be between 0 and 100.");
    }
  } else if (data.grade !== null) {
    throw new Error("Only graded assessments can have a grade.");
  }

  const assessments = await db.assessments
    .where("moduleId")
    .equals(data.moduleId)
    .toArray();

  const existingWeight = assessments
    .filter((assessment) => assessment.id !== excludedId)
    .reduce(
      (total, assessment) => total + assessment.weight,
      0
    );

  if (existingWeight + data.weight > 100.000001) {
    throw new Error(
      "The total assessment weight cannot exceed 100%."
    );
  }
}

export async function createAssessment(data) {
  return db.transaction(
    "rw",
    db.modules,
    db.assessments,
    async () => {
      await validateAssessment(data);

      return db.assessments.add(data);
    }
  );
}

export async function updateAssessment(id, data) {
  return db.transaction(
    "rw",
    db.modules,
    db.assessments,
    async () => {
      const existing = await db.assessments.get(id);

      if (!existing) {
        throw new Error("Assessment not found.");
      }

      if (existing.moduleId !== data.moduleId) {
        throw new Error("An assessment cannot change modules.");
      }

      await validateAssessment(data, id);

      return db.assessments.update(id, data);
    }
  );
}

export async function deleteAssessment(id) {
  return db.assessments.delete(id);
}