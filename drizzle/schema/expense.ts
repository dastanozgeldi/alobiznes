import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helpers";

export const expenseCategories = [
  "wants",
  "needs",
  "bills",
  "groceries",
  "rare_buy",
  "commission",
  "eat-out",
  "transport",
] as const;
export type ExpenseCategory = (typeof expenseCategories)[number];
export const expenseCategoryEnum = pgEnum(
  "expense_category",
  expenseCategories
);

export const ExpenseTable = pgTable("expenses", {
  id,
  date: text().notNull(),
  name: text().notNull(),
  category: expenseCategoryEnum().notNull().default("needs"),
  originalPrice: integer().notNull(),
  originalCurrency: text().notNull(),
  convertedPrice: integer().notNull(),
  convertedCurrency: text().notNull(),
  nameTranslation: text(),
  createdAt,
  updatedAt,
});
