import { useState } from "react";
import { X } from "lucide-react";

import {
  createAssessment,
  updateAssessment
} from "../database/assessmentService";

const assessmentTypes = [
  "Assignment",
  "Project",
  "Essay",
  "Quiz",
  "Exam",
  "Presentation",
  "Lab",
  "Other"
];

function AssessmentForm({
  moduleId,
  assessment,
  onClose
}) {
  const [formData, setFormData] = useState({
    name: assessment?.name ?? "",
    type: assessment?.type ?? "Assignment",
    dueDate: assessment?.dueDate ?? "",
    weight: assessment?.weight ?? "",
    grade: assessment?.grade ?? "",
    status: assessment?.status ?? "Pending"
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      formData.status === "Graded" &&
      formData.grade === ""
    ) {
      setError("Please enter the assessment grade.");
      return;
    }

    const data = {
      moduleId,
      name: formData.name.trim(),
      type: formData.type,
      dueDate: formData.dueDate,
      weight: Number(formData.weight),
      grade:
        formData.status === "Graded"
          ? Number(formData.grade)
          : null,
      status: formData.status
    };

    setSaving(true);

    try {
      if (assessment) {
        await updateAssessment(assessment.id, data);
      } else {
        await createAssessment(data);
      }

      onClose();
    } catch (err) {
      setError(
        err.message || "Unable to save assessment."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assessment-form-title"
      >
        <div className="modal-header">
          <h2 id="assessment-form-title">
            {assessment
              ? "Edit Assessment"
              : "Add Assessment"}
          </h2>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close form"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="assessment-name">
              Assessment Name
            </label>

            <input
              id="assessment-name"
              name="name"
              placeholder="e.g. Database Design Project"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="assessment-type">
              Assessment Type
            </label>

            <select
              id="assessment-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              {assessmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assessment-date">
                Due Date
              </label>

              <input
                id="assessment-date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="assessment-weight">
                Grade Weight (%)
              </label>

              <input
                id="assessment-weight"
                name="weight"
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                placeholder="e.g. 20"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="assessment-status">
              Status
            </label>

            <select
              id="assessment-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">
                Pending
              </option>

              <option value="Submitted">
                Submitted
              </option>

              <option value="Graded">
                Graded
              </option>
            </select>
          </div>

          {formData.status === "Graded" && (
            <div className="form-group">
              <label htmlFor="assessment-grade">
                Grade Received (%)
              </label>

              <input
                id="assessment-grade"
                name="grade"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g. 85"
                value={formData.grade}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : assessment
                  ? "Save Changes"
                  : "Add Assessment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssessmentForm;