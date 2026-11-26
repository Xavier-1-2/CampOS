import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../database/db";
import {
  BookOpen,
  ClipboardList,
  Wallet,
  Siren
} from "lucide-react";
import { Link } from "react-router-dom";

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