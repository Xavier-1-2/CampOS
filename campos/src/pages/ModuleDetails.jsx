import { useParams, Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";

import {
  ArrowLeft,
  ClipboardList,
  GraduationCap,
  UserRound,
  Calculator,
  FolderOpen
} from "lucide-react";

import { db } from "../database/db";

function ModuleDetails() {
  const { id } = useParams();
  const moduleId = Number(id);

  const result = useLiveQuery(
    async () => {
      const module = await db.modules.get(moduleId);
      return { module };
    },
    [moduleId]
  );

  const assessments = useLiveQuery(
    () =>
      db.assessments
        .where("moduleId")
        .equals(moduleId)
        .toArray(),
    [moduleId],
    []
  );

  if (result === undefined) {
    return <p>Loading module...</p>;
  }

  const module = result.module;

  if (!module) {
    return (
      <div className="empty-state">
        <h2>Module not found</h2>

        <Link
          to="/modules"
          className="primary-button"
        >
          Return to Modules
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/modules" className="back-link">
        <ArrowLeft size={18} />
        Back to Modules
      </Link>

      <div className="module-detail-header">
        <span className="module-code">
          {module.code}
        </span>

        <h1>{module.name}</h1>

        <div className="detail-information">
          <span>
            <UserRound size={18} />
            {module.tutor}
          </span>

          <span>
            <GraduationCap size={18} />
            {module.credits} Credits
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <ClipboardList size={24} />
          <p>Total Assessments</p>
          <h2>{assessments.length}</h2>
        </div>

        <div className="stat-card">
          <ClipboardList size={24} />
          <p>Pending Assessments</p>
          <h2>
            {
              assessments.filter(
                (assessment) =>
                  assessment.status === "Pending"
              ).length
            }
          </h2>
        </div>

        <div className="stat-card">
          <GraduationCap size={24} />
          <p>Current Grade</p>
          <h2>—</h2>
        </div>
      </div>

      <div className="workspace-panel">
        <ClipboardList size={24} />

        <h2>Assessments</h2>

        <p>
          Manage assignments, quizzes, projects
          and examinations.
        </p>

        <span className="coming-soon">
          Next Development Phase
        </span>
      </div>

      <div className="workspace-panel">
        <Calculator size={24} />

        <h2>What-If Grade Calculator</h2>

        <p>
          Calculate the grades needed to achieve
          your desired final result.
        </p>

        <span className="coming-soon">
          Coming Soon
        </span>
      </div>

      <div className="workspace-panel">
        <FolderOpen size={24} />

        <h2>Study Documents</h2>

        <p>
          Organize module-related study materials.
        </p>

        <span className="coming-soon">
          Future Feature
        </span>
      </div>
    </div>
  );
}

export default ModuleDetails;