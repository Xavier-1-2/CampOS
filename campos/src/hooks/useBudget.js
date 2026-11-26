import { useLiveQuery } from "dexie-react-hooks";

import { db } from "../database/db";

import {
  filterTransactionsByMonth,
  calculateFinancialSummary,
  calculateSpendingBreakdown,
  calculateBudgetStatus
} from "../utils/budget";

export function useBudget(selectedMonth) {
  const data = useLiveQuery(
    async () => {
      const [transactions, budget] =
        await Promise.all([
          db.transactions.toArray(),
          db.budgets.get(selectedMonth)
        ]);

      return {
        transactions,
        budget
      };
    },
    [selectedMonth]
  );

  const transactions = [
    ...(data?.transactions ?? [])
  ].sort(
    (a, b) =>
      b.date.localeCompare(a.date) ||
      b.id - a.id
  );

  const monthlyTransactions =
    filterTransactionsByMonth(
      transactions,
      selectedMonth
    );

  const overallSummary =
    calculateFinancialSummary(transactions);

  const monthlySummary =
    calculateFinancialSummary(monthlyTransactions);

  const spendingBreakdown =
    calculateSpendingBreakdown(monthlyTransactions);

  const budgetAmount = data?.budget?.amount ?? null;

  const budgetStatus = calculateBudgetStatus(
    budgetAmount,
    monthlySummary.expenses
  );

  return {
    transactions,
    monthlyTransactions,
    overallSummary,
    monthlySummary,
    spendingBreakdown,
    budgetAmount,
    budgetStatus,
    loading: data === undefined
  };
}