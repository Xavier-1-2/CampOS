import { useState } from "react";
import { Link } from "react-router-dom";

import {
  CalendarDays,
  BookOpen,
  Percent,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

import {
  markAssessmentSubmitted
} from "../database/assessmentService";

function TaskCard({ task, rank }) {
  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const priorityClass =
    task.priorityLevel.toLowerCase();

  async function handleSubmit() {
    const confirmed = window.confirm(
      `Mark "${task.name}" as submitted?`
    );

    if (!confirmed) return;

    setSubmitting(true);
    setError("");

    try {
      await markAssessmentSubmitted(task.id);
    } catch (err) {
      setError(
        err.message || "Unable to update assessment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article
      className={`task-card task-${priorityClass}`}
    >
      <div className="task-card-header">
        <div className="task-ranking">
          <span className="task-rank">
            #{rank}
          </span>

          <span
            className={
              `priority-badge priority-${priorityClass}`
            }
          >
            {task.priorityLevel}
          </span>
        </div>

        <span className="task-score">
          Priority:{" "}
          <strong>
            {task.priorityScore.toFixed(1)}/100
          </strong>
        </span>
      </div>

      <h2>{task.name}</h2>

      <div className="task-module">
        <BookOpen size={16} />

        <span>
          {task.moduleCode} · {task.moduleName}
        </span>
      </div>

      <div className="task-metadata">
        <span
          className={
            task.isOverdue
              ? "task-overdue-text"
              : ""
          }
        >
          <CalendarDays size={17} />
          {task.deadlineLabel}
        </span>

        <span>
          <Percent size={17} />
          Weight: {task.weight}%
        </span>

        <span>{task.type}</span>
      </div>

      <div
        className="task-priority-track"
        role="progressbar"
        aria-label="Task priority score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={task.priorityScore}
      >
        <div
          className="task-priority-fill"
          style={{
            width: `${task.priorityScore}%`
          }}
        />
      </div>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      <div className="task-card-actions">
        <Link
          to={`/modules/${task.moduleId}`}
          className="secondary-button"
        >
          View Module
          <ArrowRight size={16} />
        </Link>

        <button
          className="primary-button"
          onClick={handleSubmit}
          disabled={submitting}
        >
          <CheckCircle2 size={17} />

          {submitting
            ? "Updating..."
            : "Mark as Submitted"}
        </button>
      </div>
    </article>
  );
}

export default TaskCard;