import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

import ClassCard from "./ClassCard";

function WeeklyTimetable({
  timetable,
  currentDate,
  onEdit,
  onDelete
}) {
  const today = format(currentDate, "EEEE");

  return (
    <section className="workspace-panel">
      <div className="calculator-heading">
        <CalendarDays size={26} />

        <div>
          <h2>Weekly Timetable</h2>

          <p>
            Your recurring weekly class schedule.
          </p>
        </div>
      </div>

      <div className="timetable-scroll">
        <div className="weekly-timetable">
          {timetable.map((day) => (
            <div
              key={day.day}
              className={
                `timetable-day ${
                  day.day === today
                    ? "timetable-current-day"
                    : ""
                }`
              }
            >
              <div className="timetable-day-header">
                <h3>{day.day}</h3>

                <span>
                  {day.classes.length} class
                  {day.classes.length !== 1
                    ? "es"
                    : ""}
                </span>

                {day.day === today && (
                  <span className="today-badge">
                    Today
                  </span>
                )}
              </div>

              <div className="timetable-day-classes">
                {day.classes.length > 0 ? (
                  day.classes.map((classItem) => (
                    <ClassCard
                      key={classItem.id}
                      classItem={classItem}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))
                ) : (
                  <div className="no-classes">
                    No classes
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WeeklyTimetable;