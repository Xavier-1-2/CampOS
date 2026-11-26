import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";

import {
  ArrowLeft,
  ClipboardList,
  GraduationCap,
  UserRound,
  Calculator,
  FolderOpen,
  Plus
} from "lucide-react";

import { db } from "../database/db";

import {
  deleteAssessment
} from "../database/assessmentService";

import {
  calculateModuleStats
} from "../utils/grades";

import AssessmentForm from "../components/AssessmentForm";
import AssessmentTable from "../components/AssessmentTable";

function ModuleDetails() {
  const { id } = useParams();
  const moduleId = Number(id);

  const [showForm, setShowForm] = useState(false);

  const [selectedAssessment, setSelectedAssessment] =
    useState(null);

  const [error, setError] = useState("");

  const result = useLiveQuery(
    async () => {
      const module = Number.isInteger(moduleId)
        ? await db.modules.get(moduleId)
        : null;

      return { module };
    },
    [moduleId]
  );

  const assessments = useLiveQuery(
    () =>
      Number.isInteger(moduleId)
        ? db.assessments
            .where("moduleId")
            .equals(moduleId)
            .toArray()
        : Promise.resolve([]),
    [moduleId],
    []
  );

  const stats = calculateModuleStats(assessments);

  function handleAdd() {
    setSelectedAssessment(null);
    setShowForm(true);
  }

  function handleEdit(assessment) {
    setSelectedAssessment(assessment);
    setShowForm(true);
  }

  function handleClose() {
    setShowForm(false);
    setSelectedAssessment(null);
  }

  async function handleDelete(assessment) {
    const confirmed = window.confirm(
      `Delete "${assessment.name}"?\n\n` +
      "Its recorded grade will also be deleted."
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteAssessment(assessment.id);
    } catch (err) {
      setError(
        err.message || "Unable to delete assessment."
      );
    }
  }

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

  const outlineComplete =
    Math.abs(stats.totalWeight - 100) < 0.000001;

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
          <h2>{stats.totalAssessments}</h2>
        </div>

        <div className="stat-card">
          <ClipboardList size={24} />
          <p>Pending Assessments</p>
          <h2>{stats.pendingCount}</h2>
        </div>

        <div className="stat-card">
          <GraduationCap size={24} />
          <p>Current Weighted Average</p>

          <h2>
            {stats.currentAverage !== null
              ? `${stats.currentAverage.toFixed(1)}%`
              : "—"}
          </h2>
        </div>
      </div>

      <div className="workspace-panel">
        <div className="outline-header">
          <div>
            <h2>Module Outline</h2>

            <p>
              Track the total assessment weighting
              entered for this module.
            </p>
          </div>

          <strong>
            {Number(stats.totalWeight.toFixed(2))}% / 100%
          </strong>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-label="Module outline completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.min(stats.totalWeight, 100)}
        >
          <div
            className={
              `progress-fill ${
                outlineComplete ? "complete" : ""
              }`
            }
            style={{
              width: `${Math.min(stats.totalWeight, 100)}%`
            }}
          />
        </div>

        <p className="outline-message">
          {outlineComplete
            ? "Your module outline is complete."
            : `${Math.max(
                0,
                100 - stats.totalWeight
              ).toFixed(2)}% of the module outline is missing.`}
        </p>
      </div>

      <div className="workspace-panel">
        <div className="section-toolbar">
          <div>
            <h2>Assessments</h2>

            <p>
              Manage assignments, projects, quizzes
              and examinations.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={handleAdd}
          >
            <Plus size={18} />
            Add Assessment
          </button>
        </div>

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        <AssessmentTable
          assessments={assessments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <div className="workspace-panel">
        <Calculator size={24} />

        <h2>What-If Grade Calculator</h2>

        <p>
          Calculate the grades needed to achieve
          your desired final result.
        </p>

        <span className="coming-soon">
          Next Development Phase
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

      {showForm && (
        <AssessmentForm
          moduleId={moduleId}
          assessment={selectedAssessment}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default ModuleDetails;