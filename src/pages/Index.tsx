
import React, { useState } from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import QuickAdd from "@/components/Dashboard/QuickAdd";
import ExpenseChart from "@/components/Dashboard/ExpenseChart";
import AccountsSummary from "@/components/Dashboard/AccountsSummary";
import RecentTransactions from "@/components/Dashboard/RecentTransactions";
import AddTransactionModal from "@/components/Modals/AddTransactionModal";
import { TransactionType } from "@/lib/types";
import ThemeToggle from "@/components/UI/ThemeToggle";
import LanguageToggle from "@/components/UI/LanguageToggle";
import { motion } from "framer-motion";

const Index = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>("expense");

  const openAddTransaction = (type: TransactionType = "expense") => {
    setTransactionType(type);
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background relative pb-20">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      
      <Header openAddTransaction={() => openAddTransaction()} />
      
      <main className="container mx-auto px-4 py-6">
        <QuickAdd openAddTransaction={openAddTransaction} />
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          <ExpenseChart />
          <AccountsSummary />
        </motion.div>
        
        <RecentTransactions />
      </main>
      
      <Footer openAddTransaction={() => openAddTransaction()} />
      
      <AddTransactionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType={transactionType}
      />
    </div>
  );
};

export default Index;
