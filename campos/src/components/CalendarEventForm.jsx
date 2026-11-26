import { useState } from "react";
import { X } from "lucide-react";

import {
  CUSTOM_EVENT_TYPES
} from "../utils/calendar";

import {
  createEvent,
  updateEvent
} from "../database/eventService";

function CalendarEventForm({
  event,
  selectedDate,
  onClose
}) {
  const [formData, setFormData] = useState({
    title: event?.title ?? "",
    date: event?.date ?? selectedDate,
    time: event?.time ?? "",
    type: event?.type ?? "Academic Event",
    description: event?.description ?? ""
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      if (event) {
        await updateEvent(event.id, formData);
      } else {
        await createEvent(formData);
      }

      onClose(formData.date);
    } catch (err) {
      setError(
        err.message || "Unable to save event."
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
        aria-labelledby="calendar-form-title"
      >
        <div className="modal-header">
          <h2 id="calendar-form-title">
            {event ? "Edit Event" : "Add Event"}
          </h2>

          <button
            type="button"
            className="icon-button"
            onClick={() => onClose()}
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
            <label htmlFor="event-title">
              Event Title
            </label>

            <input
              id="event-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Group Study Session"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="event-type">
              Event Type
            </label>

            <select
              id="event-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              {CUSTOM_EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="event-date">
                Event Date
              </label>

              <input
                id="event-date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-time">
                Time (Optional)
              </label>

              <input
                id="event-time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="event-description">
              Description (Optional)
            </label>

            <textarea
              id="event-description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional event information..."
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => onClose()}
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
                : event
                  ? "Save Changes"
                  : "Add Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CalendarEventForm;