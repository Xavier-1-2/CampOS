import { Link } from "react-router-dom";

import {
  Clock,
  MapPin,
  Video,
  UserRound,
  Pencil,
  Trash2,
  ExternalLink
} from "lucide-react";

import {
  formatTimeRange
} from "../utils/timetable";

function ClassCard({
  classItem,
  onEdit,
  onDelete
}) {
  const colourIndex =
    (classItem.moduleId - 1) % 6;

  return (
    <article
      className={`class-card class-colour-${colourIndex}`}
    >
      <div className="class-card-header">
        <span className="class-code">
          {classItem.moduleCode}
        </span>

        <div className="class-actions">
          <button
            className="icon-button"
            onClick={() => onEdit(classItem)}
            aria-label={`Edit ${classItem.moduleName} class`}
            title="Edit class"
          >
            <Pencil size={15} />
          </button>

          <button
            className="icon-button delete-button"
            onClick={() => onDelete(classItem)}
            aria-label={`Delete ${classItem.moduleName} class`}
            title="Delete class"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <Link
        to={`/modules/${classItem.moduleId}`}
        className="class-module-name"
      >
        {classItem.moduleName}
      </Link>

      <div className="class-details">
        <span>
          <Clock size={15} />

          {formatTimeRange(
            classItem.startTime,
            classItem.endTime
          )}
        </span>

        <span>
          <UserRound size={15} />
          {classItem.tutor}
        </span>

        <span>
          {classItem.onlineLink
            ? <Video size={15} />
            : <MapPin size={15} />}

          {classItem.onlineLink
            ? "Online Class"
            : classItem.venue}
        </span>
      </div>

      {classItem.onlineLink && (
        <a
          href={classItem.onlineLink}
          target="_blank"
          rel="noopener noreferrer"
          className="join-class-button"
        >
          Join Class
          <ExternalLink size={14} />
        </a>
      )}
    </article>
  );
}

export default ClassCard;