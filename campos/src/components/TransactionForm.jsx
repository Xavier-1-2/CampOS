import { useState } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";

import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES
} from "../utils/budget";

import {
  createTransaction,
  updateTransaction
} from "../database/budgetService";

function TransactionForm({
  transaction,
  onClose
}) {
  const [formData, setFormData] = useState({
    name: transaction?.name ?? "",
    type: transaction?.type ?? "expense",
    category: transaction?.category ?? "Food",
    amount: transaction?.amount ?? "",
    date:
      transaction?.date ??
      format(new Date(), "yyyy-MM-dd")
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const categories =
    formData.type === "income"
      ? INCOME_CATEGORIES
      : EXPENSE_CATEGORIES;

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => {
      if (name === "type") {
        return {
          ...previous,
          type: value,
          category:
            value === "income"
              ? INCOME_CATEGORIES[0]
              : EXPENSE_CATEGORIES[0]
        };
      }

      return {
        ...previous,
        [name]: value
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      if (transaction) {
        await updateTransaction(
          transaction.id,
          formData
        );
      } else {
        await createTransaction(formData);
      }

      onClose();
    } catch (err) {
      setError(
        err.message || "Unable to save transaction."
      );
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
        aria-labelledby="transaction-form-title"
      >
        <div className="modal-header">
          <h2 id="transaction-form-title">
            {transaction
              ? "Edit Transaction"
              : "Add Transaction"}
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
            <label htmlFor="transaction-type">
              Transaction Type
            </label>

            <select
              id="transaction-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="expense">
                Expense
              </option>

              <option value="income">
                Income
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="transaction-name">
              Description
            </label>

            <input
              id="transaction-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Lunch or Monthly Allowance"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="transaction-category">
              Category
            </label>

            <select
              id="transaction-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="transaction-amount">
              Amount (JMD)
            </label>

            <input
              id="transaction-amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              max="1000000000"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="transaction-date">
              Transaction Date
            </label>

            <input
              id="transaction-date"
              name="date"
              type="date"
              value={formData.date}
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
                : transaction
                  ? "Save Changes"
                  : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionForm;