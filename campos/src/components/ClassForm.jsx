import { useState } from "react";
import { X } from "lucide-react";

import {
  createClass,
  updateClass
} from "../database/classService";

import {
  DAYS_OF_WEEK
} from "../utils/timetable";

function ClassForm({
  modules,
  classItem,
  onClose
}) {
  const [formData, setFormData] = useState({
    moduleId: classItem?.moduleId ?? "",
    day: classItem?.day ?? "Monday",
    startTime: classItem?.startTime ?? "09:00",
    endTime: classItem?.endTime ?? "11:00",
    venue: classItem?.venue ?? ""
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

    const data = {
      moduleId: Number(formData.moduleId),
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime,
      venue: formData.venue.trim()
    };

    if (!data.moduleId) {
      setError("Please select a module.");
      return;
    }

    setSaving(true);

    try {
      if (classItem) {
        await updateClass(classItem.id, data);
      } else {
        await createClass(data);
      }

      onClose();
    } catch (err) {
      setError(
        err.message || "Unable to save class."
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
        aria-labelledby="class-form-title"
      >
        <div className="modal-header">
          <h2 id="class-form-title">
            {classItem
              ? "Edit Class"
              : "Add Class"}
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
            <label htmlFor="class-module">
              Module
            </label>

            <select
              id="class-module"
              name="moduleId"
              value={formData.moduleId}
              onChange={handleChange}
              required
            >
              <option value="">
                Select a module
              </option>

              {modules.map((module) => (
                <option
                  key={module.id}
                  value={module.id}
                >
                  {module.code} — {module.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="class-day">
              Day of the Week
            </label>

            <select
              id="class-day"
              name="day"
              value={formData.day}
              onChange={handleChange}
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="class-start">
                Start Time
              </label>

              <input
                id="class-start"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="class-end">
                End Time
              </label>

              <input
                id="class-end"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="class-venue">
              Venue / Online Meeting Link
            </label>

            <input
              id="class-venue"
              name="venue"
              placeholder="e.g. Room 204 or meeting URL"
              value={formData.venue}
              onChange={handleChange}
              required
            />

            <small className="form-hint">
              Enter a classroom, laboratory or full
              online meeting link.
            </small>
          </div>

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
                : classItem
                  ? "Save Changes"
                  : "Add Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClassForm;