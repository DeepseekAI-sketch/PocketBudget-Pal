
export type TransactionType = "expense" | "income";

export type ExpenseCategory = 
  | "food" 
  | "transport" 
  | "entertainment" 
  | "shopping" 
  | "health" 
  | "home" 
  | "bills" 
  | "education" 
  | "other";

export type IncomeCategory = 
  | "salary" 
  | "freelance" 
  | "gifts" 
  | "investments" 
  | "other";

export type Category = ExpenseCategory | IncomeCategory;

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  date: Date;
  description: string;
  account: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  color: string;
  icon: string;
}

export interface CategoryMeta {
  name: string;
  icon: string;
  color: string;
}

export interface CategorySummary {
  category: Category;
  amount: number;
  percentage: number;
}

export interface PeriodSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  expenseByCategory: CategorySummary[];
  incomeByCategory: CategorySummary[];
}
