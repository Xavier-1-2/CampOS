import {
  BookOpen,
  Pencil,
  Trash2,
  ArrowRight,
  UserRound,
  GraduationCap
} from "lucide-react";

import { Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../database/db";

function ModuleCard({ module, onEdit, onDelete }) {
  const assessmentCount = useLiveQuery(
    () =>
      db.assessments
        .where("moduleId")
        .equals(module.id)
        .count(),
    [module.id],
    0
  );

  return (
    <div className="module-card">
      <div className="module-card-header">
        <div className="module-icon">
          <BookOpen size={24} />
        </div>

        <div className="module-actions">
          <button
            className="icon-button"
            onClick={() => onEdit(module)}
            title="Edit module"
            aria-label={`Edit ${module.name}`}
          >
            <Pencil size={18} />
          </button>

          <button
            className="icon-button delete-button"
            onClick={() => onDelete(module)}
            title="Delete module"
            aria-label={`Delete ${module.name}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <span className="module-code">
        {module.code}
      </span>

      <h2>{module.name}</h2>

      <div className="module-information">
        <p>
          <UserRound size={16} />
          {module.tutor}
        </p>

        <p>
          <GraduationCap size={16} />
          {module.credits} Credits
        </p>
      </div>

      <div className="module-statistics">
        <span>Assessments</span>
        <strong>{assessmentCount}</strong>
      </div>

      <Link
        to={`/modules/${module.id}`}
        className="module-link"
      >
        View Module
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}

export default ModuleCard;