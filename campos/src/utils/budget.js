import { format, parseISO } from "date-fns";

export const INCOME_CATEGORIES = [
  "Allowance",
  "Salary",
  "Scholarship",
  "Financial Aid",
  "Freelance",
  "Gifts",
  "Other"
];

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transportation",
  "Tuition",
  "Academic Supplies",
  "Accommodation",
  "Utilities",
  "Entertainment",
  "Personal Care",
  "Health",
  "Savings",
  "Other"
];

const currencyFormatter = new Intl.NumberFormat(
  "en-JM",
  {
    style: "currency",
    currency: "JMD",
    currencyDisplay: "code",
    minimumFractionDigits: 2
  }
);

export function formatCurrency(amount) {
  return currencyFormatter
    .format(amount)
    .replace("JMD", "J$");
}

export function getCurrentMonth() {
  return format(new Date(), "yyyy-MM");
}

export function formatMonth(month) {
  return format(
    parseISO(`${month}-01`),
    "MMMM yyyy"
  );
}

export function toCents(amount) {
  return Math.round(Number(amount) * 100);
}

export function filterTransactionsByMonth(
  transactions,
  month
) {
  return transactions.filter(
    (transaction) =>
      transaction.date.startsWith(month)
  );
}

export function calculateFinancialSummary(
  transactions
) {
  let incomeCents = 0;
  let expenseCents = 0;

  for (const transaction of transactions) {
    const amount = toCents(transaction.amount);

    if (transaction.type === "income") {
      incomeCents += amount;
    }

    if (transaction.type === "expense") {
      expenseCents += amount;
    }
  }

  return {
    income: incomeCents / 100,
    expenses: expenseCents / 100,
    balance:
      (incomeCents - expenseCents) / 100,

    transactionCount: transactions.length
  };
}

export function calculateSpendingBreakdown(
  transactions
) {
  const categories = new Map();

  let totalExpenses = 0;

  for (const transaction of transactions) {
    if (transaction.type !== "expense") {
      continue;
    }

    const amount = toCents(transaction.amount);

    totalExpenses += amount;

    categories.set(
      transaction.category,
      (categories.get(transaction.category) ?? 0)
        + amount
    );
  }

  return Array.from(categories.entries())
    .map(([category, amount]) => ({
      category,

      amount: amount / 100,

      percentage:
        totalExpenses > 0
          ? (amount / totalExpenses) * 100
          : 0
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function calculateBudgetStatus(
  budgetAmount,
  expenses
) {
  if (
    budgetAmount === null ||
    budgetAmount === undefined ||
    budgetAmount <= 0
  ) {
    return {
      hasBudget: false,
      status: "Not Set",
      utilization: 0,
      remaining: null
    };
  }

  const budgetCents = toCents(budgetAmount);
  const expenseCents = toCents(expenses);

  const remaining =
    (budgetCents - expenseCents) / 100;

  const utilization =
    (expenseCents / budgetCents) * 100;

  let status = "Within Budget";

  if (expenseCents > budgetCents) {
    status = "Over Budget";
  } else if (expenseCents === budgetCents) {
    status = "Limit Reached";
  } else if (utilization >= 75) {
    status = "Approaching Limit";
  }

  return {
    hasBudget: true,
    budgetAmount,
    expenses,
    remaining,
    utilization,
    status
  };
}