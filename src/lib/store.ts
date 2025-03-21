import { create } from 'zustand';
import { Transaction, Account, PeriodSummary, Category, CategoryMeta, ExpenseCategory, IncomeCategory } from './types';
import { persist } from 'zustand/middleware';

export const EXPENSE_CATEGORIES: Record<string, CategoryMeta> = {
  food: { name: "Food & Drinks", icon: "utensils", color: "#FF8A65" },
  transport: { name: "Transport", icon: "car", color: "#64B5F6" },
  entertainment: { name: "Entertainment", icon: "film", color: "#BA68C8" },
  shopping: { name: "Shopping", icon: "shopping-bag", color: "#4DB6AC" },
  health: { name: "Health", icon: "heart", color: "#F06292" },
  home: { name: "Home", icon: "home", color: "#FFD54F" },
  bills: { name: "Bills", icon: "file-text", color: "#7986CB" },
  education: { name: "Education", icon: "book", color: "#4DD0E1" },
  other: { name: "Other", icon: "more-horizontal", color: "#A1887F" },
};

export const INCOME_CATEGORIES: Record<string, CategoryMeta> = {
  salary: { name: "Salary", icon: "briefcase", color: "#66BB6A" },
  freelance: { name: "Freelance", icon: "edit-3", color: "#9CCC65" },
  gifts: { name: "Gifts", icon: "gift", color: "#FFCA28" },
  investments: { name: "Investments", icon: "trending-up", color: "#26C6DA" },
  other: { name: "Other", icon: "more-horizontal", color: "#8D6E63" },
};

export const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: "1",
    name: "Cash",
    balance: 500,
    color: "#4CAF50",
    icon: "dollar-sign",
  },
  {
    id: "2",
    name: "Bank Card",
    balance: 1500,
    color: "#2196F3",
    icon: "credit-card",
  },
];

interface FinanceState {
  transactions: Transaction[];
  accounts: Account[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  addAccount: (account: Omit<Account, "id">) => void;
  deleteTransaction: (id: string) => void;
  deleteAccount: (id: string) => void;
  updateAccount: (account: Account) => void;
  getCurrentPeriodSummary: () => PeriodSummary;
  expenseCategories: ExpenseCategory[];
  incomeCategories: IncomeCategory[];
}

// Helper to generate ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Helper to calculate summary
const calculateSummary = (transactions: Transaction[]): PeriodSummary => {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
    
  // Calculate expense by category
  const expenseByCategory = Object.entries(
    transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>)
  ).map(([category, amount]) => ({
    category: category as Category,
    amount,
    percentage: totalExpense ? (amount / totalExpense) * 100 : 0
  }));
  
  // Calculate income by category
  const incomeByCategory = Object.entries(
    transactions
      .filter(t => t.type === "income")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>)
  ).map(([category, amount]) => ({
    category: category as Category,
    amount,
    percentage: totalIncome ? (amount / totalIncome) * 100 : 0
  }));
  
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    expenseByCategory,
    incomeByCategory
  };
};

// Create store with persistence
export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      accounts: DEFAULT_ACCOUNTS,
      expenseCategories: Object.keys(EXPENSE_CATEGORIES) as ExpenseCategory[],
      incomeCategories: Object.keys(INCOME_CATEGORIES) as IncomeCategory[],
      
      addTransaction: (transaction) => {
        const newTransaction = { ...transaction, id: generateId() };
        
        set(state => {
          // Update account balance
          const updatedAccounts = state.accounts.map(account => {
            if (account.name === transaction.account) {
              const balanceChange = transaction.type === "income" 
                ? transaction.amount 
                : -transaction.amount;
                
              return {
                ...account,
                balance: account.balance + balanceChange
              };
            }
            return account;
          });
          
          return {
            transactions: [newTransaction, ...state.transactions],
            accounts: updatedAccounts
          };
        });
      },
      
      deleteTransaction: (id) => {
        set(state => {
          const transaction = state.transactions.find(t => t.id === id);
          
          if (!transaction) return state;
          
          // Revert account balance
          const updatedAccounts = state.accounts.map(account => {
            if (account.name === transaction.account) {
              const balanceChange = transaction.type === "income" 
                ? -transaction.amount 
                : transaction.amount;
                
              return {
                ...account,
                balance: account.balance + balanceChange
              };
            }
            return account;
          });
          
          return {
            transactions: state.transactions.filter(t => t.id !== id),
            accounts: updatedAccounts
          };
        });
      },
      
      addAccount: (account) => {
        set(state => ({
          accounts: [...state.accounts, { ...account, id: generateId() }]
        }));
      },
      
      deleteAccount: (id) => {
        set(state => ({
          accounts: state.accounts.filter(a => a.id !== id)
        }));
      },
      
      updateAccount: (updatedAccount) => {
        set(state => ({
          accounts: state.accounts.map(account =>
            account.id === updatedAccount.id ? updatedAccount : account
          )
        }));
      },
      
      getCurrentPeriodSummary: () => {
        const { transactions } = get();
        // Get transactions for the current month
        const now = new Date();
        const currentMonthTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return (
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear()
          );
        });
        
        return calculateSummary(currentMonthTransactions);
      }
    }),
    {
      name: 'finance-store',
    }
  )
);
