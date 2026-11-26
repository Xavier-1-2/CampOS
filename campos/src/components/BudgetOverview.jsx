import { useState } from "react";

import {
  Wallet,
  Pencil,
  Trash2
} from "lucide-react";

import {
  formatCurrency,
  formatMonth
} from "../utils/budget";

import {
  setMonthlyBudget,
  removeMonthlyBudget
} from "../database/budgetService";

function BudgetOverview({
  month,
  budgetStatus
}) {
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleEdit() {
    setAmount(
      budgetStatus.budgetAmount ?? ""
    );

    setError("");
    setEditing(true);
  }


  async function handleSave(event) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      await setMonthlyBudget(month, amount);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    const confirmed = window.confirm(
      `Remove the spending limit for ${formatMonth(month)}?`
    );

    if (!confirmed) return;

    setSaving(true);
    setError("");

    try {
      await removeMonthlyBudget(month);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const statusClass =
    budgetStatus.utilization >= 100
      ? "budget-danger"
      : budgetStatus.utilization >= 75
        ? "budget-warning"
        : "budget-healthy";

  return (
    <section className="workspace-panel">
      <div className="section-toolbar">
        <div className="calculator-heading">
          <Wallet size={26} />

          <div>
            <h2>Monthly Budget</h2>

            <p>{formatMonth(month)}</p>
          </div>
        </div>

        {!editing && (
          <button
            className="secondary-button"
            onClick={handleEdit}
            disabled={saving}
          >
            <Pencil size={16} />

            {budgetStatus.hasBudget
              ? "Edit Budget"
              : "Set Budget"}
          </button>
        )}
      </div>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      {editing && (
        <form
          className="budget-limit-form"
          onSubmit={handleSave}
        >
          <div className="form-group">
            <label htmlFor="budget-limit">
              Monthly Spending Limit (JMD)
            </label>

            <input
              id="budget-limit"
              type="number"
              min="0.01"
              step="0.01"
              max="1000000000"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setEditing(false)}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              className="primary-button"
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Budget"}
            </button>
          </div>
        </form>
      )}

      {budgetStatus.hasBudget ? (
        <div className={`budget-status ${statusClass}`}>
          <div className="budget-progress-header">
            <strong>
              {formatCurrency(budgetStatus.expenses)}
              {" of "}
              {formatCurrency(budgetStatus.budgetAmount)}
            </strong>

            <span className="budget-status-badge">
              {budgetStatus.status}
            </span>
          </div>

          <div
            className="budget-progress-track"
            role="progressbar"
            aria-label="Monthly budget utilization"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.min(
              100,
              budgetStatus.utilization
            )}
            aria-valuetext={
              `${budgetStatus.utilization.toFixed(1)}% spent`
            }
          >
            <div
              className="budget-progress-fill"
              style={{
                width: `${Math.min(
                  100,
                  budgetStatus.utilization
                )}%`
              }}
            />
          </div>

          <div className="budget-progress-footer">
            <span>
              {budgetStatus.utilization.toFixed(1)}%
              {" utilized"}
            </span>

            <strong>
              {budgetStatus.remaining >= 0
                ? "Remaining: "
                : "Over budget by: "}

              {formatCurrency(
                Math.abs(budgetStatus.remaining)
              )}
            </strong>
          </div>

          <button
            className="budget-remove-button"
            onClick={handleRemove}
            disabled={saving}
          >
            <Trash2 size={15} />
            Remove Budget
          </button>
        </div>
      ) : !editing && (
        <div className="empty-state">
          <Wallet size={40} />

          <h2>No spending limit established</h2>

          <p>
            Set a monthly budget to monitor
            your spending and remaining allowance.
          </p>
        </div>
      )}
    </section>
  );
}

export default BudgetOverview;