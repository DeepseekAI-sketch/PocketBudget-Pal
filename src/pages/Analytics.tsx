
import React, { useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { useLanguage } from "@/lib/contexts";
import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/formatters";
import { TransactionType, Category, Transaction } from "@/lib/types";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import AddTransactionModal from "@/components/Modals/AddTransactionModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeToggle from "@/components/UI/ThemeToggle";
import LanguageToggle from "@/components/UI/LanguageToggle";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Pie,
  PieChart,
} from "recharts";

const Analytics = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TransactionType>("expense");
  const { t } = useLanguage();
  
  const transactions = useFinanceStore((state) => state.transactions);
  const expenseCategories = useFinanceStore((state) => state.expenseCategories);
  const incomeCategories = useFinanceStore((state) => state.incomeCategories);
  
  const openAddTransaction = (type: TransactionType = "expense") => {
    setIsAddModalOpen(true);
  };
  
  // Group transactions by month
  const monthlyData = React.useMemo(() => {
    const lastSixMonths = Array.from({ length: 6 }).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        timestamp: date.getTime(),
      };
    }).reverse();
    
    const monthlyExpenses = lastSixMonths.map(({ month, timestamp }) => {
      const monthStart = new Date(timestamp);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date(timestamp);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      monthEnd.setHours(23, 59, 59, 999);
      
      const monthlyExpense = transactions
        .filter(t => {
          const transactionDate = new Date(t.date).getTime();
          return t.type === "expense" && 
                 transactionDate >= monthStart.getTime() && 
                 transactionDate <= monthEnd.getTime();
        })
        .reduce((sum, t) => sum + t.amount, 0);
        
      const monthlyIncome = transactions
        .filter(t => {
          const transactionDate = new Date(t.date).getTime();
          return t.type === "income" && 
                 transactionDate >= monthStart.getTime() && 
                 transactionDate <= monthEnd.getTime();
        })
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        month,
        expense: monthlyExpense,
        income: monthlyIncome,
      };
    });
    
    return monthlyExpenses;
  }, [transactions]);
  
  // Category breakdown
  const categoryData = React.useMemo(() => {
    const categories = activeTab === "expense" ? expenseCategories : incomeCategories;
    
    return categories.map(category => {
      const amount = transactions
        .filter(t => t.type === activeTab && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
        
      return {
        name: t(category),
        value: amount,
        category,
      };
    }).filter(item => item.value > 0);
  }, [transactions, activeTab, expenseCategories, incomeCategories, t]);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-2 rounded-md border border-border shadow-sm">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm font-semibold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };
  
  const categoryColors = [
    "#4CAF50", "#2196F3", "#FF9800", "#E91E63", "#9C27B0", 
    "#3F51B5", "#00BCD4", "#009688", "#FF5722", "#607D8B"
  ];
  
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
          <h1 className="text-3xl font-bold mb-6">{t("analytics")}</h1>
          
          <Card className="bg-card shadow-sm mb-8">
            <CardHeader>
              <CardTitle>{t("monthly.overview")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="expense"
                    name={t("expense")}
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="income"
                    name={t("income")}
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="bg-card shadow-sm">
            <CardHeader>
              <Tabs defaultValue="expense" className="w-full" onValueChange={(v) => setActiveTab(v as TransactionType)}>
                <div className="flex justify-between items-center">
                  <CardTitle>{t("category.breakdown")}</CardTitle>
                  <TabsList>
                    <TabsTrigger value="expense">{t("expense")}</TabsTrigger>
                    <TabsTrigger value="income">{t("income")}</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="expense" className="mt-6">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64">
                      <p className="text-muted-foreground">{t("no.expense.this.month")}</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="income" className="mt-6">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64">
                      <p className="text-muted-foreground">{t("no.income.this.month")}</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
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

export default Analytics;
