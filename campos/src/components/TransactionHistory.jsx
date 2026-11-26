import { useState } from "react";

import {
  Pencil,
  Trash2,
  Receipt
} from "lucide-react";

import {
  format,
  parseISO
} from "date-fns";

import {
  formatCurrency
} from "../utils/budget";

function TransactionHistory({
  transactions,
  monthlyTransactions,
  onEdit,
  onDelete
}) {
  const [scope, setScope] = useState("month");
  const [typeFilter, setTypeFilter] = useState("all");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const source =
    scope === "month"
      ? monthlyTransactions
      : transactions;

  const typeFiltered = source.filter(
    (transaction) =>
      typeFilter === "all" ||
      transaction.type === typeFilter
  );

  const categories = [
    ...new Set(
      typeFiltered.map(
        (transaction) => transaction.category
      )
    )
  ].sort();

  const activeCategory =
    categories.includes(categoryFilter)
      ? categoryFilter
      : "all";

  const filteredTransactions = typeFiltered.filter(
    (transaction) =>
      activeCategory === "all" ||
      transaction.category === activeCategory
  );

  return (
    <section className="workspace-panel">
      <div className="calculator-heading">
        <Receipt size={26} />

        <div>
          <h2>Transaction History</h2>

          <p>
            Review and manage your recorded finances.
          </p>
        </div>
      </div>

      <div className="transaction-filters">
        <div className="form-group">
          <label htmlFor="transaction-scope">
            Period
          </label>

          <select
            id="transaction-scope"
            value={scope}
            onChange={(event) => {
              setScope(event.target.value);
              setCategoryFilter("all");
            }}
          >
            <option value="month">
              Selected Month
            </option>

            <option value="all">
              All Transactions
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="transaction-type-filter">
            Type
          </label>

          <select
            id="transaction-type-filter"
            value={typeFilter}
            onChange={(event) => {
              setTypeFilter(event.target.value);
              setCategoryFilter("all");
            }}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="transaction-category-filter">
            Category
          </label>

          <select
            id="transaction-category-filter"
            value={activeCategory}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
          >
            <option value="all">
              All Categories
            </option>

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
      </div>

      <p className="results-count">
        Showing {filteredTransactions.length} of{" "}
        {source.length} transactions
      </p>

      {filteredTransactions.length > 0 ? (
        <div className="transaction-table-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map(
                (transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <strong>{transaction.name}</strong>
                    </td>

                    <td>
                      <span className="transaction-category">
                        {transaction.category}
                      </span>
                    </td>

                    <td>
                      {format(
                        parseISO(transaction.date),
                        "MMM d, yyyy"
                      )}
                    </td>

                    <td
                      className={
                        transaction.type === "income"
                          ? "income-text"
                          : "expense-text"
                      }
                    >
                      {transaction.type === "income"
                        ? "+"
                        : "−"}

                      {formatCurrency(transaction.amount)}
                    </td>

                    <td>
                      <div className="transaction-actions">
                        <button
                          className="icon-button"
                          onClick={() => onEdit(transaction)}
                          aria-label={`Edit ${transaction.name}`}
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          className="icon-button delete-button"
                          onClick={() => onDelete(transaction)}
                          aria-label={`Delete ${transaction.name}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <Receipt size={40} />

          <h2>No matching transactions</h2>

          <p>
            Add a transaction or change your filters.
          </p>
        </div>
      )}
    </section>
  );
}

export default TransactionHistory;