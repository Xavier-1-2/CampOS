import {
  CalendarDays,
  Clock,
  Pencil,
  Trash2,
  ArrowRight
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  format,
  parseISO
} from "date-fns";

import {
  EVENT_CATEGORIES,
  formatEventTime
} from "../utils/calendar";

function CalendarEventList({
  events,
  onEdit,
  onDelete,
  showDate = false
}) {
  if (events.length === 0) {
    return (
      <div className="empty-state">
        <CalendarDays size={40} />

        <h2>No scheduled events</h2>

        <p>
          There are no academic activities
          scheduled for this period.
        </p>
      </div>
    );
  }

  return (
    <div className="calendar-event-list">
      {events.map((event) => (
        <article
          key={event.id}
          className={
            `calendar-event-card ` +
            `calendar-category-${event.category}`
          }
        >
          <div className="calendar-event-content">

            <div className="calendar-event-title">
              <h3>{event.title}</h3>

              <span className="calendar-event-badge">
                {event.eventType ??
                  EVENT_CATEGORIES[event.category]}
              </span>
            </div>

            {event.moduleCode && (
              <span className="calendar-module-code">
                {event.moduleCode}
              </span>
            )}

            <div className="calendar-event-meta">
              {showDate && (
                <span>
                  <CalendarDays size={15} />

                  {format(
                    parseISO(event.date),
                    "EEE, MMM d"
                  )}
                </span>
              )}

              <span>
                <Clock size={15} />

                {formatEventTime(event.time)}

                {event.endTime &&
                  ` – ${formatEventTime(event.endTime)}`}
              </span>

              {event.status && (
                <span
                  className={
                    `status-badge ` +
                    `status-${event.status.toLowerCase()}`
                  }
                >
                  {event.status}
                </span>
              )}
            </div>

            {event.description && (
              <p>{event.description}</p>
            )}
          </div>

          <div className="calendar-event-actions">
            {event.source === "custom" ? (
              <>
                <button
                  className="icon-button"
                  onClick={() =>
                    onEdit(event.originalEvent)
                  }
                  aria-label={`Edit ${event.title}`}
                >
                  <Pencil size={17} />
                </button>

                <button
                  className="icon-button delete-button"
                  onClick={() =>
                    onDelete(event.originalEvent)
                  }
                  aria-label={`Delete ${event.title}`}
                >
                  <Trash2 size={17} />
                </button>
              </>
            ) : (
              <Link
                className="calendar-source-link"
                to={
                  event.source === "class"
                    ? "/timetable"
                    : `/modules/${event.moduleId}`
                }
              >
                {event.source === "class"
                  ? "Timetable"
                  : "View Module"}

                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export default CalendarEventList;