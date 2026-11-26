import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";

const statusConfig = {
  High: {
    icon: AlertTriangle,
    title: "High Workload Pressure",
    className: "emergency-high"
  },

  Elevated: {
    icon: AlertCircle,
    title: "Elevated Workload Pressure",
    className: "emergency-elevated"
  },

  Manageable: {
    icon: ShieldCheck,
    title: "Manageable Workload",
    className: "emergency-manageable"
  },

  Clear: {
    icon: CheckCircle2,
    title: "No Outstanding Assessments",
    className: "emergency-clear"
  }
};

function EmergencyStatus({ workload }) {
  const config = statusConfig[workload.level];

  const Icon = config.icon;

  return (
    <section
      className={
        `emergency-status ${config.className}`
      }
    >
      <div className="emergency-status-icon">
        <Icon size={32} />
      </div>

      <div className="emergency-status-content">
        <span className="emergency-status-label">
          Academic Workload Assessment
        </span>

        <h2>{config.title}</h2>

        <p>{workload.message}</p>
      </div>
    </section>
  );
}

export default EmergencyStatus;