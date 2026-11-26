import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

import {
  Plus,
  CalendarDays,
  Clock,
  BookOpen,
  CalendarCheck
} from "lucide-react";

import {
  useTimetable
} from "../hooks/useTimetable";

import {
  deleteClass
} from "../database/classService";

import ClassForm from "../components/ClassForm";
import ClassCard from "../components/ClassCard";
import WeeklyTimetable from "../components/WeeklyTimetable";

function Timetable() {
  const {
    classes,
    modules,
    weeklyTimetable,
    todaysClasses,
    stats,
    currentDate,
    loading
  } = useTimetable();

  const [showForm, setShowForm] =
    useState(false);

  const [selectedClass, setSelectedClass] =
    useState(null);

  const [error, setError] = useState("");

  function handleAdd() {
    setSelectedClass(null);
    setShowForm(true);
  }

  function handleEdit(classItem) {
    setSelectedClass(classItem);
    setShowForm(true);
  }

  function handleClose() {
    setShowForm(false);
    setSelectedClass(null);
  }

  async function handleDelete(classItem) {
    const confirmed = window.confirm(
      `Delete the ${classItem.moduleCode} ` +
      `class scheduled for ${classItem.day}?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteClass(classItem.id);
    } catch (err) {
      setError(
        err.message || "Unable to delete class."
      );
    }
  }

  if (loading) {
    return <p>Loading timetable...</p>;
  }

  return (
    <div>
      <div className="page-toolbar">
        <div className="page-heading">
          <h1>Timetable</h1>

          <p>
            Manage your weekly university
            class schedule.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleAdd}
          disabled={modules.length === 0}
        >
          <Plus size={20} />
          Add Class
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <CalendarDays size={24} />

          <p>Weekly Classes</p>
          <h2>{stats.weeklyClasses}</h2>
        </div>

        <div className="stat-card">
          <CalendarCheck size={24} />

          <p>Classes Today</p>
          <h2>{stats.classesToday}</h2>
        </div>

        <div className="stat-card">
          <Clock size={24} />

          <p>Weekly Class Hours</p>

          <h2>
            {Number(stats.weeklyHours.toFixed(2))} hrs
          </h2>
        </div>
      </div>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      {modules.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} />

          <h2>Create your modules first</h2>

          <p>
            You need at least one registered module
            before creating your timetable.
          </p>

          <Link
            to="/modules"
            className="primary-button"
          >
            Go to Modules
          </Link>
        </div>
      ) : classes.length === 0 ? (
        <div className="empty-state">
          <CalendarDays size={48} />

          <h2>Your timetable is empty</h2>

          <p>
            Add your first class to begin organizing
            your weekly university schedule.
          </p>

          <button
            className="primary-button"
            onClick={handleAdd}
          >
            <Plus size={18} />
            Add Your First Class
          </button>
        </div>
      ) : (
        <>
          <section className="workspace-panel">
            <div className="calculator-heading">
              <CalendarCheck size={26} />

              <div>
                <h2>Today's Classes</h2>

                <p>
                  {format(
                    currentDate,
                    "EEEE, MMMM d, yyyy"
                  )}
                </p>
              </div>
            </div>

            {todaysClasses.length > 0 ? (
              <div className="todays-classes-grid">
                {todaysClasses.map((classItem) => (
                  <ClassCard
                    key={classItem.id}
                    classItem={classItem}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <CalendarCheck size={40} />

                <h2>No classes today</h2>

                <p>
                  You have no scheduled classes
                  for today.
                </p>
              </div>
            )}
          </section>

          <WeeklyTimetable
            timetable={weeklyTimetable}
            currentDate={currentDate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}

      {showForm && (
        <ClassForm
          modules={modules}
          classItem={selectedClass}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default Timetable;