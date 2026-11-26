import { db } from "./db";

import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  toCents
} from "../utils/budget";

import {
  isValid,
  parseISO,
  format
} from "date-fns";

function validateAmount(amount) {
  const number = Number(amount);

  if (
    !Number.isFinite(number) ||
    number <= 0 ||
    number > 1000000000 ||
    toCents(number) < 1 ||
    Math.abs(number * 100 - toCents(number)) > 0.00001
  ) {
    throw new Error(
      "Enter a valid positive amount with up to two decimal places."
    );
  }

  return toCents(number) / 100;
}

function validateTransaction(data) {
  const name = data.name?.trim();

  if (!name) {
    throw new Error(
      "Please enter a transaction description."
    );
  }

  if (!["income", "expense"].includes(data.type)) {
    throw new Error(
      "Please select a valid transaction type."
    );
  }

  const categories =
    data.type === "income"
      ? INCOME_CATEGORIES
      : EXPENSE_CATEGORIES;

  if (!categories.includes(data.category)) {
    throw new Error(
      "Please select a valid category."
    );
  }

  const amount = validateAmount(data.amount);

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
    !isValid(parseISO(data.date)) ||
    format(parseISO(data.date), "yyyy-MM-dd") !== data.date
  ) {
    throw new Error(
      "Please enter a valid transaction date."
    );
  }

  return {
    name,
    type: data.type,
    category: data.category,
    amount,
    date: data.date
  };
}

export async function createTransaction(data) {
  const transaction = validateTransaction(data);

  return db.transactions.add(transaction);
}

export async function updateTransaction(id, data) {
  const transaction = validateTransaction(data);

  const updated = await db.transactions.update(
    id,
    transaction
  );

  if (!updated) {
    throw new Error("Transaction not found.");
  }

  return updated;
}

export async function deleteTransaction(id) {
  return db.transactions.delete(id);
}

export async function setMonthlyBudget(
  month,
  amount
) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    throw new Error("Invalid budget month.");
  }

  const validatedAmount = validateAmount(amount);

  return db.budgets.put({
    month,
    amount: validatedAmount
  });
}

export async function removeMonthlyBudget(month) {
  return db.budgets.delete(month);
}