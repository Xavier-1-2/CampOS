import {
  format,
  isSameMonth,
  isToday
} from "date-fns";

import {
  WEEKDAYS,
  getDateKey
} from "../utils/calendar";

function CalendarGrid({
  currentMonth,
  calendarDays,
  eventsByDate,
  selectedDate,
  onSelectDate
}) {
  return (
    <div className="calendar-grid-wrapper">
      <div className="calendar-grid">

        {WEEKDAYS.map((day) => (
          <div
            className="calendar-weekday"
            key={day}
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day) => {
          const date = getDateKey(day);

          const events = eventsByDate[date] ?? [];

          const visibleEvents = events.slice(0, 3);

          const remainingEvents =
            events.length - visibleEvents.length;

          const classes = [
            "calendar-day",

            !isSameMonth(day, currentMonth)
              ? "calendar-outside-month"
              : "",

            isToday(day)
              ? "calendar-today"
              : "",

            date === selectedDate
              ? "calendar-selected"
              : ""
          ].filter(Boolean).join(" ");

          return (
            <button
              type="button"
              key={date}
              className={classes}
              onClick={() => onSelectDate(day)}
              aria-pressed={date === selectedDate}
              aria-label={
                `${format(day, "MMMM d, yyyy")}, ` +
                `${events.length} events`
              }
            >
              <span className="calendar-day-number">
                {format(day, "d")}
              </span>

              <span className="calendar-day-events">
                {visibleEvents.map((event) => (
                  <span
                    key={event.id}
                    className={
                      `calendar-event-chip ` +
                      `calendar-category-${event.category}`
                    }
                    title={event.title}
                  >
                    {event.moduleCode
                      ? `${event.moduleCode} — `
                      : ""}

                    {event.title}
                  </span>
                ))}

                {remainingEvents > 0 && (
                  <span className="calendar-more-events">
                    +{remainingEvents} more
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarGrid;