import { useState } from "react";

import {
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown
} from "lucide-react";

import {
  useBudget
} from "../hooks/useBudget";

import {
  formatCurrency,
  getCurrentMonth,
  formatMonth
} from "../utils/budget";

import {
  deleteTransaction
} from "../database/budgetService";

import TransactionForm from "../components/TransactionForm";
import TransactionHistory from "../components/TransactionHistory";
import BudgetOverview from "../components/BudgetOverview";
import SpendingBreakdown from "../components/SpendingBreakdown";

function Budget() {
  const [selectedMonth, setSelectedMonth] =
    useState(getCurrentMonth);

  const [showForm, setShowForm] =
    useState(false);

  const [selectedTransaction, setSelectedTransaction] =
    useState(null);

  const [error, setError] = useState("");

  const {
    transactions,
    monthlyTransactions,
    overallSummary,
    monthlySummary,
    spendingBreakdown,
    budgetStatus,
    loading
  } = useBudget(selectedMonth);

  function handleAdd() {
    setSelectedTransaction(null);
    setShowForm(true);
  }

  function handleEdit(transaction) {
    setSelectedTransaction(transaction);
    setShowForm(true);
  }

  function handleClose() {
    setShowForm(false);
    setSelectedTransaction(null);
  }

  async function handleDelete(transaction) {
    const confirmed = window.confirm(
      `Delete "${transaction.name}"?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteTransaction(transaction.id);
    } catch (err) {
      setError(
        err.message || "Unable to delete transaction."
      );
    }
  }

  if (loading) {
    return <p>Loading financial information...</p>;
  }

  return (
    <div>
      <div className="page-toolbar">
        <div className="page-heading">
          <h1>Budget Tracker</h1>

          <p>
            Manage your income, expenses
            and university finances.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleAdd}
        >
          <Plus size={20} />
          Add Transaction
        </button>
      </div>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      <div className="financial-section-heading">
        <h2>Overall Financial Summary</h2>

        <span>All recorded transactions</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card financial-income">
          <TrendingUp size={24} />

          <p>Total Income</p>

          <h2>
            {formatCurrency(overallSummary.income)}
          </h2>
        </div>

        <div className="stat-card financial-expense">
          <TrendingDown size={24} />

          <p>Total Expenses</p>

          <h2>
            {formatCurrency(overallSummary.expenses)}
          </h2>
        </div>

        <div className="stat-card">
          <Wallet size={24} />

          <p>Available Balance</p>

          <h2
            className={
              overallSummary.balance < 0
                ? "expense-text"
                : "income-text"
            }
          >
            {formatCurrency(overallSummary.balance)}
          </h2>
        </div>
      </div>

      <div className="budget-month-toolbar">
        <div>
          <h2>{formatMonth(selectedMonth)}</h2>

          <p>
            Review your financial activity
            for a specific month.
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="budget-month">
            Select Month
          </label>

          <input
            id="budget-month"
            type="month"
            value={selectedMonth}
            onChange={(event) => {
              if (
                /^\d{4}-(0[1-9]|1[0-2])$/.test(
                  event.target.value
                )
              ) {
                setSelectedMonth(event.target.value);
              }
            }}
          />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card financial-income">
          <p>Monthly Income</p>

          <h2>
            {formatCurrency(monthlySummary.income)}
          </h2>
        </div>

        <div className="stat-card financial-expense">
          <p>Monthly Expenses</p>

          <h2>
            {formatCurrency(monthlySummary.expenses)}
          </h2>
        </div>

        <div className="stat-card">
          <p>Monthly Net Cash Flow</p>

          <h2
            className={
              monthlySummary.balance < 0
                ? "expense-text"
                : "income-text"
            }
          >
            {formatCurrency(monthlySummary.balance)}
          </h2>
        </div>
      </div>

          <BudgetOverview
      key={`budget-overview-${selectedMonth}`}
      month={selectedMonth}
      budgetStatus={budgetStatus}
    />

    <SpendingBreakdown
      categories={spendingBreakdown}
    />

    <TransactionHistory
      key={`transaction-history-${selectedMonth}`}
      transactions={transactions}
      monthlyTransactions={monthlyTransactions}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />

    {showForm && (
      <TransactionForm
        transaction={selectedTransaction}
        onClose={handleClose}
      />
    )}
    </div>
  );
}

export default Budget;