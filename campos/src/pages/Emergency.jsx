import { Link } from "react-router-dom";

import {
  Siren,
  ClipboardList,
  AlertTriangle,
  Clock,
  Flame,
  Target,
  ListChecks,
  CheckCircle2,
  Lightbulb
} from "lucide-react";

import {
  useAcademicTasks
} from "../hooks/useAcademicTasks";

import {
  generateEmergencyPlan
} from "../utils/emergency";

import EmergencyStatus from "../components/EmergencyStatus";
import RecoveryPlan from "../components/RecoveryPlan";
import TaskCard from "../components/TaskCard";

function Emergency() {
  const {
    tasks,
    currentDate,
    loading
  } = useAcademicTasks();

  if (loading) {
    return <p>Analyzing academic workload...</p>;
  }

  const emergencyPlan = generateEmergencyPlan(
    tasks,
    currentDate
  );

  const {
    workload,
    immediateFocus,
    recommendations,
    recoveryPlan
  } = emergencyPlan;

  return (
    <div>
      <div className="emergency-page-heading">
        <div className="emergency-heading-icon">
          <Siren size={30} />
        </div>

        <div>
          <h1>Academic Emergency Mode</h1>

          <p>
            Regain control of your academic workload
            with a personalized recovery plan.
          </p>
        </div>
      </div>

      <EmergencyStatus workload={workload} />

      <div className="emergency-stats-grid">
        <div className="stat-card">
          <ClipboardList size={24} />
          <p>Pending</p>
          <h2>{workload.pending}</h2>
        </div>

        <div className="stat-card overdue-stat">
          <AlertTriangle size={24} />
          <p>Overdue</p>
          <h2>{workload.overdue}</h2>
        </div>

        <div className="stat-card due-soon-stat">
          <Clock size={24} />
          <p>Due Within 3 Days</p>
          <h2>{workload.dueSoon}</h2>
        </div>

        <div className="stat-card overdue-stat">
          <Flame size={24} />
          <p>Critical</p>
          <h2>{workload.critical}</h2>
        </div>
      </div>

      {immediateFocus ? (
        <>
          <section className="workspace-panel">
            <div className="calculator-heading">
              <Target size={26} />

              <div>
                <h2>Immediate Focus</h2>

                <p>
                  Your highest-ranked academic
                  responsibility.
                </p>
              </div>
            </div>

            <div className="focus-recommendation">
              <Lightbulb size={24} />

              <div>
                <strong>Recommended Action</strong>

                <p>
                  {immediateFocus.recommendedAction}
                </p>
              </div>
            </div>

            <TaskCard
              key={immediateFocus.id}
              task={immediateFocus}
              rank={1}
            />

            <div className="focus-footer">
              <Link
                to="/tasks"
                className="secondary-button"
              >
                View Full Academic Workload
              </Link>
            </div>
          </section>

          <section className="workspace-panel">
            <div className="calculator-heading">
              <ListChecks size={26} />

              <div>
                <h2>Personalized Action Plan</h2>

                <p>
                  Recommended steps based on your
                  current academic responsibilities.
                </p>
              </div>
            </div>

            <div className="recommendation-list">
              {recommendations.map(
                (recommendation, index) => (
                  <div
                    className="recommendation-card"
                    key={recommendation.title}
                  >
                    <div className="recommendation-number">
                      {index + 1}
                    </div>

                    <div>
                      <h3>{recommendation.title}</h3>

                      <p>
                        {recommendation.description}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          <RecoveryPlan plan={recoveryPlan} />
        </>
      ) : (
        <section className="workspace-panel">
          <div className="empty-state emergency-empty">
            <CheckCircle2 size={56} />

            <h2>You're all caught up!</h2>

            <p>
              There are currently no pending
              assessments recorded in CampOS.
              Keep your module outlines updated
              to maintain your academic progress.
            </p>

            <Link
              to="/modules"
              className="primary-button"
            >
              View Your Modules
            </Link>
          </div>
        </section>
      )}

      <div className="emergency-disclaimer">
        <Lightbulb size={20} />

        <p>
          This recovery plan is automatically generated
          using your recorded assessment deadlines and
          grade weights. Adjust the recommendations
          according to your available time, assessment
          requirements and university policies.
        </p>
      </div>
    </div>
  );
}

export default Emergency;