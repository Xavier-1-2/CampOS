import { useState } from "react";

import {
  Plus,
  ChevronLeft,
  ChevronRight,
  CalendarDays
} from "lucide-react";

import {
  format,
  parseISO,
  startOfMonth,
  addMonths,
  subMonths
} from "date-fns";

import { useCalendar } from "../hooks/useCalendar";

import {
  getDateKey,
  EVENT_CATEGORIES
} from "../utils/calendar";

import {
  deleteEvent
} from "../database/eventService";

import CalendarGrid from "../components/CalendarGrid";
import CalendarEventList from "../components/CalendarEventList";
import CalendarEventForm from "../components/CalendarEventForm";

function Calendar() {
  const [currentMonth, setCurrentMonth] =
    useState(() => startOfMonth(new Date()));

  const [selectedDate, setSelectedDate] =
    useState(() => getDateKey(new Date()));

  const [showForm, setShowForm] = useState(false);

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const [error, setError] = useState("");

  const {
    calendarDays,
    eventsByDate,
    selectedDayEvents,
    upcomingEvents,
    loading
  } = useCalendar(
    currentMonth,
    selectedDate
  );

  function handleSelectDate(date) {
    setSelectedDate(getDateKey(date));
    setCurrentMonth(startOfMonth(date));
  }

  function handlePreviousMonth() {
    const month = subMonths(currentMonth, 1);

    setCurrentMonth(month);
    setSelectedDate(getDateKey(month));
  }

  function handleNextMonth() {
    const month = addMonths(currentMonth, 1);

    setCurrentMonth(month);
    setSelectedDate(getDateKey(month));
  }

  function handleToday() {
    handleSelectDate(new Date());
  }

  function handleAdd() {
    setSelectedEvent(null);
    setShowForm(true);
  }

  function handleEdit(event) {
    setSelectedEvent(event);
    setShowForm(true);
  }

  function handleClose(savedDate) {
    setShowForm(false);
    setSelectedEvent(null);

    if (savedDate) {
      handleSelectDate(parseISO(savedDate));
    }
  }

  async function handleDelete(event) {
    const confirmed = window.confirm(
      `Delete "${event.title}"?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteEvent(event.id);
    } catch (err) {
      setError(
        err.message || "Unable to delete event."
      );
    }
  }

  if (loading) {
    return <p>Loading academic calendar...</p>;
  }

  return (
    <div>
      <div className="page-toolbar">
        <div className="page-heading">
          <h1>Academic Calendar</h1>

          <p>
            Manage your classes, assessments
            and important academic dates.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleAdd}
        >
          <Plus size={20} />
          Add Event
        </button>
      </div>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      <section className="workspace-panel">
        <div className="calendar-toolbar">
          <div className="calendar-navigation">
            <button
              className="secondary-button"
              onClick={handlePreviousMonth}
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>

            <h2>
              {format(currentMonth, "MMMM yyyy")}
            </h2>

            <button
              className="secondary-button"
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <button
            className="secondary-button"
            onClick={handleToday}
          >
            <CalendarDays size={18} />
            Today
          </button>
        </div>

        <div className="calendar-legend">
          {Object.entries(EVENT_CATEGORIES).map(
            ([category, label]) => (
              <span
                key={category}
                className={
                  `calendar-legend-item ` +
                  `calendar-category-${category}`
                }
              >
                <span className="calendar-legend-dot" />

                {label}
              </span>
            )
          )}
        </div>

        <CalendarGrid
          currentMonth={currentMonth}
          calendarDays={calendarDays}
          eventsByDate={eventsByDate}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
        />
      </section>

      <section className="workspace-panel">
        <div className="section-toolbar">
          <div>
            <h2>
              {format(
                parseISO(selectedDate),
                "EEEE, MMMM d, yyyy"
              )}
            </h2>

            <p>
              {selectedDayEvents.length}
              {" scheduled activities"}
            </p>
          </div>

          <button
            className="secondary-button"
            onClick={handleAdd}
          >
            <Plus size={17} />
            Add Event
          </button>
        </div>

        <CalendarEventList
          events={selectedDayEvents}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>

      <section className="workspace-panel">
        <div className="section-toolbar">
          <div>
            <h2>Upcoming Events</h2>

            <p>
              Your academic schedule for
              the next seven days, including today.
            </p>
          </div>
        </div>

        <CalendarEventList
          events={upcomingEvents}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showDate
        />
      </section>

      {showForm && (
        <CalendarEventForm
          event={selectedEvent}
          selectedDate={selectedDate}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default Calendar;