import { Link } from "react-router-dom";

import {
  CalendarDays,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

function RecoveryTask({ task }) {
  return (
    <Link
      to={`/modules/${task.moduleId}`}
      className="recovery-task"
    >
      <div className="recovery-task-info">
        <span className="recovery-task-action">
          {task.action}
        </span>

        <strong>{task.name}</strong>

        <span className="recovery-task-meta">
          {task.moduleCode} · {task.weight}% Weight
          {" · "}
          {task.deadlineLabel}
        </span>
      </div>

      <span
        className={
          `priority-badge priority-` +
          task.priorityLevel.toLowerCase()
        }
      >
        {task.priorityLevel}
      </span>

      <ArrowRight size={17} />
    </Link>
  );
}

function RecoveryPlan({ plan }) {
  return (
    <section className="workspace-panel">
      <div className="calculator-heading">
        <CalendarDays size={26} />

        <div>
          <h2>Seven-Day Recovery Plan</h2>

          <p>
            Organize your academic responsibilities
            over the next seven days.
          </p>
        </div>
      </div>

      <div className="recovery-timeline">
        {plan.days.map((day) => (
          <div
            key={day.date}
            className={
              `recovery-day ${
                day.day === 0
                  ? "recovery-today"
                  : ""
              }`
            }
          >
            <div className="recovery-day-heading">
              <div className="recovery-day-number">
                {day.day + 1}
              </div>

              <div>
                <h3>{day.label}</h3>
                <span>{day.formattedDate}</span>
              </div>
            </div>

            <div className="recovery-day-content">
              {day.tasks.length > 0 ? (
                day.tasks.map((task) => (
                  <RecoveryTask
                    key={`${task.id}-${task.action}`}
                    task={task}
                  />
                ))
              ) : (
                <div className="recovery-free-day">
                  <CheckCircle2 size={18} />

                  <span>
                    No recorded deadlines.
                    Use available time for preparation
                    or rest.
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {plan.laterTasks.length > 0 && (
        <div className="later-tasks">
          <h3>Beyond the Next Seven Days</h3>

          <p>
            Begin preparing for these assessments
            before their deadlines approach.
          </p>

          {plan.laterTasks.map((task) => (
            <RecoveryTask
              key={task.id}
              task={task}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default RecoveryPlan;