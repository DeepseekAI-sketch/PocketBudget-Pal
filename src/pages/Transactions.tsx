
import React, { useState } from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { useFinanceStore } from "@/lib/store";
import { formatRelativeDate } from "@/utils/formatters";
import TransactionCard from "@/components/UI/TransactionCard";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts";
import AddTransactionModal from "@/components/Modals/AddTransactionModal";
import { TransactionType } from "@/lib/types";
import ThemeToggle from "@/components/UI/ThemeToggle";
import LanguageToggle from "@/components/UI/LanguageToggle";

const Transactions = () => {
  const transactions = useFinanceStore((state) => state.transactions);
  const { t } = useLanguage();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>("expense");

  const openAddTransaction = (type: TransactionType = "expense") => {
    setTransactionType(type);
    setIsAddModalOpen(true);
  };

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = formatRelativeDate(transaction.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, typeof transactions>);

  // Get dates sorted chronologically
  const dates = Object.keys(groupedTransactions);

  return (
    <div className="min-h-screen bg-background relative pb-20">
      <Header openAddTransaction={() => openAddTransaction()} />
      
      <div className="fixed top-4 right-4 z-50 flex space-x-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold mb-2">{t("transactions")}</h1>
          <p className="text-muted-foreground">
            {transactions.length > 0 
              ? t("view.all.your.transactions") 
              : t("no.transactions.yet")}
          </p>
        </motion.div>

        {transactions.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-12 glass rounded-3xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-muted-foreground mb-4">{t("no.transactions.found")}</p>
            <button 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
              onClick={() => openAddTransaction()}
            >
              {t("add.first.transaction")}
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {dates.map((date) => (
              <motion.div 
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-3xl p-6"
              >
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  {date}
                </h3>
                <div className="space-y-2">
                  {groupedTransactions[date].map((transaction) => (
                    <TransactionCard 
                      key={transaction.id} 
                      transaction={transaction} 
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
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

export default Transactions;
