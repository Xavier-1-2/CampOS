import {
  Pencil,
  Trash2,
  ClipboardList
} from "lucide-react";

import {
  format,
  parseISO,
  differenceInCalendarDays
} from "date-fns";

function AssessmentTable({
  assessments,
  onEdit,
  onDelete
}) {
  if (assessments.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList size={42} />

        <h2>No assessments yet</h2>

        <p>
          Add your module outline to start tracking
          deadlines and academic performance.
        </p>
      </div>
    );
  }

  const sortedAssessments = [...assessments].sort(
    (a, b) => a.dueDate.localeCompare(b.dueDate)
  );

  function getDeadlineLabel(assessment) {
    if (assessment.status !== "Pending") {
      return null;
    }

    const daysLeft = differenceInCalendarDays(
      parseISO(assessment.dueDate),
      new Date()
    );

    if (daysLeft < 0) {
      return (
        <span className="deadline-overdue">
          Overdue
        </span>
      );
    }

    if (daysLeft === 0) {
      return (
        <span className="deadline-urgent">
          Due today
        </span>
      );
    }

    if (daysLeft <= 3) {
      return (
        <span className="deadline-urgent">
          Due in {daysLeft}d
        </span>
      );
    }

    return null;
  }

  return (
    <div className="table-container">
      <table className="assessment-table">
        <thead>
          <tr>
            <th>Assessment</th>
            <th>Type</th>
            <th>Due Date</th>
            <th>Weight</th>
            <th>Grade</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {sortedAssessments.map((assessment) => (
            <tr key={assessment.id}>
              <td>
                <strong>{assessment.name}</strong>

                {getDeadlineLabel(assessment)}
              </td>

              <td>{assessment.type}</td>

              <td>
                {format(
                  parseISO(assessment.dueDate),
                  "MMM d, yyyy"
                )}
              </td>

              <td>{assessment.weight}%</td>

              <td>
                {assessment.grade !== null
                  ? `${assessment.grade}%`
                  : "—"}
              </td>

              <td>
                <span
                  className={
                    `status-badge status-` +
                    assessment.status.toLowerCase()
                  }
                >
                  {assessment.status}
                </span>
              </td>

              <td>
                <div className="table-actions">
                  <button
                    className="icon-button"
                    onClick={() => onEdit(assessment)}
                    aria-label={`Edit ${assessment.name}`}
                    title="Edit assessment"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    className="icon-button delete-button"
                    onClick={() => onDelete(assessment)}
                    aria-label={`Delete ${assessment.name}`}
                    title="Delete assessment"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssessmentTable;