import { useState } from "react";

import {
  Calculator,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RotateCcw
} from "lucide-react";

import {
  calculateModuleStats,
  calculateTargetGrade,
  calculateProjectedGrade
} from "../utils/grades";

function GradeCalculator({ assessments }) {
  const [target, setTarget] = useState("75");

  const [hypotheticalGrades, setHypotheticalGrades] =
    useState({});

  const stats = calculateModuleStats(assessments);

  const outlineComplete =
    Math.abs(stats.totalWeight - 100) < 0.000001;

  const ungradedAssessments = assessments.filter(
    (assessment) =>
      assessment.status !== "Graded"
  );

  const maximumPossible =
    stats.earnedPoints + stats.remainingWeight;

  const targetResult = calculateTargetGrade(
    assessments,
    target === "" ? NaN : Number(target)
  );

  const projectedGrade = calculateProjectedGrade(
    assessments,
    hypotheticalGrades
  );

  function handleHypotheticalChange(id, value) {
    setHypotheticalGrades((previous) => ({
      ...previous,
      [id]: value
    }));
  }

  function resetSimulation() {
    setHypotheticalGrades({});
  }

  function renderTargetResult() {
    switch (targetResult.status) {
      case "achieved":
        return (
          <div className="calculator-result result-success">
            <CheckCircle2 size={24} />

            <h3>Target already secured</h3>

            <p>
              You have already earned enough percentage
              points to achieve this target.
            </p>
          </div>
        );

      case "unattainable":
        return (
          <div className="calculator-result result-danger">
            <AlertTriangle size={24} />

            <h3>Target unattainable</h3>

            <p>
              Your maximum possible final grade is{" "}
              <strong>
                {targetResult.maximumPossible.toFixed(2)}%
              </strong>.
            </p>
          </div>
        );

      case "achievable":
        return (
          <div className="calculator-result result-success">
            <Target size={24} />

            <p>Required weighted average</p>

            <h3 className="result-value">
              {targetResult.requiredAverage.toFixed(2)}%
            </h3>

            <p>
              You need approximately this average across
              your remaining ungraded assessments.
            </p>

            <span className="result-caption">
              Your target is mathematically achievable.
            </span>
          </div>
        );

      case "invalid-target":
        return (
          <div className="calculator-result result-warning">
            <AlertTriangle size={24} />

            <p>
              Enter a target grade between 0 and 100.
            </p>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <section className="workspace-panel grade-calculator">
      <div className="calculator-heading">
        <Calculator size={26} />

        <div>
          <h2>What-If Grade Calculator</h2>

          <p>
            Plan your academic performance and explore
            possible final grades.
          </p>
        </div>
      </div>

      {!outlineComplete ? (
        <div className="calculator-result result-warning">
          <AlertTriangle size={26} />

          <h3>Complete your module outline</h3>

          <p>
            Your assessments must total 100% before
            the grade calculator can produce accurate
            predictions.
          </p>

          <strong>
            Current weighting:{" "}
            {Number(stats.totalWeight.toFixed(2))}%
          </strong>
        </div>
      ) : (
        <>
          <div className="grade-summary-grid">
            <div className="grade-summary-card">
              <span>Points Earned</span>

              <strong>
                {stats.earnedPoints.toFixed(2)}
              </strong>

              <small>Out of 100</small>
            </div>

            <div className="grade-summary-card">
              <span>Ungraded Weight</span>

              <strong>
                {stats.remainingWeight.toFixed(2)}%
              </strong>

              <small>Awaiting grades</small>
            </div>

            <div className="grade-summary-card">
              <span>Maximum Possible</span>

              <strong>
                {maximumPossible.toFixed(2)}%
              </strong>

              <small>Best-case final grade</small>
            </div>
          </div>

          <div className="calculator-section">
            <div className="calculator-section-title">
              <Target size={20} />

              <h3>Target Grade Calculator</h3>
            </div>

            <p>
              Enter your desired final module grade.
            </p>

            <div className="form-group target-input">
              <label htmlFor="target-grade">
                Desired Final Grade (%)
              </label>

              <input
                id="target-grade"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={target}
                onChange={(event) =>
                  setTarget(event.target.value)
                }
              />
            </div>

            {renderTargetResult()}
          </div>

          <div className="calculator-section">
            <div className="section-toolbar">
              <div>
                <div className="calculator-section-title">
                  <TrendingUp size={20} />

                  <h3>What-If Simulator</h3>
                </div>

                <p>
                  Experiment with hypothetical grades
                  without changing your actual results.
                </p>
              </div>

              <button
                className="secondary-button"
                onClick={resetSimulation}
                disabled={ungradedAssessments.length === 0}
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>

            {ungradedAssessments.length > 0 ? (
              <div className="simulation-list">
                {ungradedAssessments.map((assessment) => (
                  <div
                    className="simulation-row"
                    key={assessment.id}
                  >
                    <div className="simulation-information">
                      <strong>{assessment.name}</strong>

                      <span>
                        {assessment.type} ·{" "}
                        {assessment.weight}% of module ·{" "}
                        {assessment.status}
                      </span>
                    </div>

                    <div className="simulation-input">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Grade"
                        aria-label={
                          `Hypothetical grade for ${assessment.name}`
                        }
                        value={
                          hypotheticalGrades[assessment.id] ?? ""
                        }
                        onChange={(event) =>
                          handleHypotheticalChange(
                            assessment.id,
                            event.target.value
                          )
                        }
                      />

                      <span>%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                All assessments have been graded.
                Your final module grade is available.
              </p>
            )}

            <div className="projection-result">
              <TrendingUp size={28} />

              <p>
                {ungradedAssessments.length === 0
                  ? "Final Module Grade"
                  : "Projected Final Grade"}
              </p>

              <h2>
                {projectedGrade !== null
                  ? `${projectedGrade.toFixed(2)}%`
                  : "—"}
              </h2>

              <span>
                {projectedGrade === null
                  ? "Enter a valid grade for every ungraded assessment."
                  : ungradedAssessments.length === 0
                    ? "Calculated from your recorded grades."
                    : "Based on your actual and hypothetical grades."}
              </span>
            </div>

            <p className="simulation-disclaimer">
              Hypothetical grades are temporary and
              will not modify your academic records.
            </p>
          </div>
        </>
      )}
    </section>
  );
}

export default GradeCalculator;