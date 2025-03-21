
import React, { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { useLanguage } from "@/lib/contexts";
import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/formatters";
import { TransactionType, Category, ExpenseCategory } from "@/lib/types";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import AddTransactionModal from "@/components/Modals/AddTransactionModal";
import ThemeToggle from "@/components/UI/ThemeToggle";
import LanguageToggle from "@/components/UI/LanguageToggle";
import { Progress } from "@/components/ui/progress-custom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CategoryIcon from "@/components/UI/CategoryIcon";
import { Plus } from "lucide-react";

// Budget data (simplified for this example)
const sampleBudgets = [
  { category: "food" as ExpenseCategory, limit: 500, spent: 320 },
  { category: "transport" as ExpenseCategory, limit: 300, spent: 275 },
  { category: "entertainment" as ExpenseCategory, limit: 200, spent: 150 },
  { category: "shopping" as ExpenseCategory, limit: 400, spent: 150 },
  { category: "bills" as ExpenseCategory, limit: 800, spent: 750 },
];

const Budgets = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { t } = useLanguage();
  
  const transactions = useFinanceStore((state) => state.transactions);
  const currentMonthExpenses = transactions.filter(
    (t) => t.type === "expense" && new Date(t.date).getMonth() === new Date().getMonth()
  );
  
  const openAddTransaction = () => {
    setIsAddModalOpen(true);
  };
  
  // Calculate real spending by category
  const calculateSpentByCategory = (category: ExpenseCategory) => {
    return currentMonthExpenses
      .filter((t) => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };
  
  // Function to get progress bar color based on percentage
  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <div className="min-h-screen bg-background relative pb-20">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      
      <Header openAddTransaction={openAddTransaction} />
      
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{t("budgets")}</h1>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus size={16} />
              {t("add.budget")}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {sampleBudgets.map((budget) => {
              const realSpent = calculateSpentByCategory(budget.category);
              const percentage = Math.min(100, (realSpent / budget.limit) * 100);
              
              return (
                <Card key={budget.category} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-muted p-2 rounded-full">
                          <CategoryIcon 
                            category={budget.category}
                            size={20}
                            withBackground={false}
                          />
                        </div>
                        <span className="font-medium">{t(budget.category)}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(realSpent)} / {formatCurrency(budget.limit)}
                        </div>
                        <div className="text-xs font-medium text-muted-foreground">
                          {percentage.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    
                    <Progress 
                      value={percentage} 
                      className="h-2" 
                      indicatorClassName={getProgressColor(realSpent, budget.limit)}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      </main>
      
      <Footer openAddTransaction={openAddTransaction} />
      
      <AddTransactionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType="expense"
      />
    </div>
  );
};

export default Budgets;
