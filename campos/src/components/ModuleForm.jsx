import { useState } from "react";
import { X } from "lucide-react";
import {
  createModule,
  updateModule
} from "../database/moduleService";

function ModuleForm({ module, onClose }) {
  const [formData, setFormData] = useState({
    code: module?.code ?? "",
    name: module?.name ?? "",
    tutor: module?.tutor ?? "",
    credits: module?.credits ?? ""
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const data = {
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      tutor: formData.tutor.trim(),
      credits: Number(formData.credits)
    };

    if (!data.code || !data.name || !data.tutor) {
      setError("Please complete all fields.");
      return;
    }

    if (
      !Number.isInteger(data.credits) ||
      data.credits <= 0
    ) {
      setError("Credits must be a positive whole number.");
      return;
    }

    setSaving(true);

    try {
      if (module) {
        await updateModule(module.id, data);
      } else {
        await createModule(data);
      }

      onClose();
    } catch (err) {
      setError(err.message || "Unable to save module.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="module-form-title"
      >
        <div className="modal-header">
          <h2 id="module-form-title">
            {module ? "Edit Module" : "Add Module"}
          </h2>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close form"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="code">Module Code</label>

            <input
              id="code"
              name="code"
              placeholder="e.g. CIT2001"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Module Name</label>

            <input
              id="name"
              name="name"
              placeholder="e.g. Database Management"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tutor">Tutor / Lecturer</label>

            <input
              id="tutor"
              name="tutor"
              placeholder="Enter lecturer's name"
              value={formData.tutor}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="credits">Credits</label>

            <input
              id="credits"
              name="credits"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 3"
              value={formData.credits}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : module
                  ? "Save Changes"
                  : "Add Module"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModuleForm;