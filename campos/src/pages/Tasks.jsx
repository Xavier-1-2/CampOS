import { useState } from "react";

import {
  ClipboardList,
  AlertTriangle,
  Clock,
  CheckCircle2
} from "lucide-react";

import {
  useAcademicTasks
} from "../hooks/useAcademicTasks";

import TaskCard from "../components/TaskCard";

function Tasks() {
  const { tasks, stats, modules, loading } =
    useAcademicTasks();

  const [moduleFilter, setModuleFilter] =
    useState("all");

  const [priorityFilter, setPriorityFilter] =
    useState("all");

  const filteredTasks = tasks
    .map((task, index) => ({
      ...task,
      rank: index + 1
    }))
    .filter((task) => {
      const matchesModule =
        moduleFilter === "all" ||
        task.moduleId === Number(moduleFilter);

      const matchesPriority =
        priorityFilter === "all" ||
        task.priorityLevel === priorityFilter;

      return matchesModule && matchesPriority;
    });

  return (
    <div>
      <div className="page-heading">
        <h1>Academic Tasks</h1>

        <p>
          Your academic responsibilities, automatically
          prioritized by deadlines and grade weights.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <ClipboardList size={24} />

          <p>Pending Assessments</p>
          <h2>{stats.total}</h2>
        </div>

        <div className="stat-card overdue-stat">
          <AlertTriangle size={24} />

          <p>Overdue Assessments</p>
          <h2>{stats.overdue}</h2>
        </div>

        <div className="stat-card due-soon-stat">
          <Clock size={24} />

          <p>Due Within 3 Days</p>
          <h2>{stats.dueSoon}</h2>
        </div>
      </div>

      <div className="workspace-panel">
        <div className="section-toolbar">
          <div>
            <h2>Prioritized To-Do List</h2>

            <p>
              Focus on your most important
              academic responsibilities first.
            </p>
          </div>
        </div>

        <div className="task-filters">
          <div className="form-group">
            <label htmlFor="module-filter">
              Module
            </label>

            <select
              id="module-filter"
              value={moduleFilter}
              onChange={(event) =>
                setModuleFilter(event.target.value)
              }
            >
              <option value="all">
                All Modules
              </option>

              {modules.map((module) => (
                <option
                  key={module.id}
                  value={module.id}
                >
                  {module.code} — {module.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority-filter">
              Priority
            </label>

            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
            >
              <option value="all">
                All Priorities
              </option>

              <option value="Critical">
                Critical
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>
            </select>
          </div>
        </div>

        <div className="priority-explanation">
          <strong>How priorities are calculated</strong>

          <p>
            Deadline urgency contributes 60% and
            assessment weight contributes 40% to
            your priority score. Overdue assessments
            are placed first.
          </p>
        </div>

        <p className="results-count">
          Showing {filteredTasks.length} of{" "}
          {tasks.length} tasks
        </p>

        {loading ? (
          <p>Loading academic tasks...</p>
        ) : filteredTasks.length > 0 ? (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                rank={task.rank}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <CheckCircle2 size={48} />

            <h2>
              {tasks.length === 0
                ? "You're all caught up!"
                : "No matching tasks"}
            </h2>

            <p>
              {tasks.length === 0
                ? "You currently have no pending assessments recorded in CampOS."
                : "Try changing your module or priority filters."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tasks;