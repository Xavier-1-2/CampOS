import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../database/db";
import {
  BookOpen,
  ClipboardList,
  Wallet,
  Siren
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useAcademicTasks
} from "../hooks/useAcademicTasks";

function Dashboard() {
  const modules = useLiveQuery(
    () => db.modules.count(),
    [],
    0
  );

  const pendingTasks = useLiveQuery(
    () =>
      db.assessments
        .where("status")
        .equals("Pending")
        .count(),
    [],
    0
  );

  const transactions = useLiveQuery(
    () => db.transactions.toArray(),
    [],
    []
  );

  const balance = transactions.reduce(
    (total, transaction) =>
      transaction.type === "income"
        ? total + transaction.amount
        : total - transaction.amount,
    0
  );

  const { tasks, loading: tasksLoading } =
  useAcademicTasks();

  const topTasks = tasks.slice(0, 3);

  return (
    <div>
      <div className="page-heading">
        <h1>Welcome to CampOS</h1>
        <p>
          Manage your academic and financial life
          in one place.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <BookOpen size={24} />
          <p>Active Modules</p>
          <h2>{modules}</h2>
        </div>

        <div className="stat-card">
          <ClipboardList size={24} />
          <p>Pending Assessments</p>
          <h2>{pendingTasks}</h2>
        </div>

        <div className="stat-card">
          <Wallet size={24} />
          <p>Available Balance</p>
          <h2>
            J${balance.toLocaleString("en-JM")}
          </h2>
        </div>
      </div>

      <div className="workspace-panel">
  <div className="section-toolbar">
    <div>
      <h2>Priority Tasks</h2>

      <p>
        Your most important upcoming
        academic responsibilities.
      </p>
    </div>

    <Link
      to="/tasks"
      className="secondary-button"
    >
      View All Tasks
    </Link>
  </div>

  {tasksLoading ? (
    <p>Loading tasks...</p>
  ) : topTasks.length > 0 ? (
    <div className="dashboard-task-list">
      {topTasks.map((task, index) => (
        <Link
          to={`/modules/${task.moduleId}`}
          className="dashboard-task"
          key={task.id}
        >
          <div className="dashboard-task-rank">
            {index + 1}
          </div>

          <div className="dashboard-task-info">
            <strong>{task.name}</strong>

            <span>
              {task.moduleCode} ·{" "}
              {task.deadlineLabel} ·{" "}
              {task.weight}% Weight
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
        </Link>
      ))}
    </div>
  ) : (
    <div className="empty-state">
      <ClipboardList size={36} />

      <h2>No pending tasks</h2>

      <p>
        Add assessments to your modules
        to generate your academic task list.
      </p>
    </div>
  )}
</div>

      <div className="emergency-banner">
        <div>
          <h2>Feeling overwhelmed?</h2>
          <p>
            Identify your most urgent academic
            responsibilities and create an action plan.
          </p>
        </div>

        <Link
          to="/emergency"
          className="emergency-button"
        >
          <Siren size={18} />
          Activate Emergency Mode
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;