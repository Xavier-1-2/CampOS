import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus, Search, BookOpen } from "lucide-react";

import { db } from "../database/db";
import { deleteModule } from "../database/moduleService";

import ModuleCard from "../components/ModuleCard";
import ModuleForm from "../components/ModuleForm";

function Modules() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [error, setError] = useState("");

  const modules = useLiveQuery(
    () => db.modules.toArray(),
    [],
    []
  );

  const filteredModules = modules.filter((module) => {
    const query = search.trim().toLowerCase();

    return (
      module.name.toLowerCase().includes(query) ||
      module.code.toLowerCase().includes(query) ||
      module.tutor.toLowerCase().includes(query)
    );
  });

  function handleAdd() {
    setSelectedModule(null);
    setShowForm(true);
  }

  function handleEdit(module) {
    setSelectedModule(module);
    setShowForm(true);
  }

  function handleClose() {
    setShowForm(false);
    setSelectedModule(null);
  }

  async function handleDelete(module) {
    const confirmed = window.confirm(
      `Delete ${module.name}?\n\n` +
      "All associated assessments and classes will also be deleted."
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteModule(module.id);
    } catch (err) {
      setError(err.message || "Unable to delete module.");
    }
  }

  return (
    <div>
      <div className="page-toolbar">
        <div className="page-heading">
          <h1>Module Management</h1>

          <p>
            Manage your university modules and
            academic progress.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleAdd}
        >
          <Plus size={20} />
          Add Module
        </button>
      </div>

      <div className="search-box">
        <Search size={20} />

        <input
          type="search"
          placeholder="Search modules..."
          aria-label="Search modules"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      <p className="results-count">
        {filteredModules.length} module(s)
      </p>

      {filteredModules.length > 0 ? (
        <div className="modules-grid">
          {filteredModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <BookOpen size={48} />

          <h2>
            {modules.length === 0
              ? "No modules yet"
              : "No matching modules"}
          </h2>

          <p>
            {modules.length === 0
              ? "Add your first university module to get started."
              : "Try searching with a different keyword."}
          </p>

          {modules.length === 0 && (
            <button
              className="primary-button"
              onClick={handleAdd}
            >
              <Plus size={18} />
              Add Your First Module
            </button>
          )}
        </div>
      )}

      {showForm && (
        <ModuleForm
          module={selectedModule}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default Modules;