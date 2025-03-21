
import React from "react";
import { useFinanceStore } from "@/lib/store";
import TransactionCard from "@/components/UI/TransactionCard";
import { motion } from "framer-motion";
import { formatRelativeDate } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/contexts";

const RecentTransactions = () => {
  const transactions = useFinanceStore((state) => state.transactions);
  const { t } = useLanguage();
  
  if (!transactions.length) {
    return (
      <motion.div 
        className="rounded-3xl p-6 glass mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-lg font-medium mb-4">{t("recent.transactions")}</h2>
        <div className="py-12 flex flex-col items-center justify-center">
          <p className="text-muted-foreground mb-2">{t("no.transactions")}</p>
          <p className="text-xs text-muted-foreground mb-4">
            {t("start.by.adding.transaction")}
          </p>
        </div>
      </motion.div>
    );
  }
  
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
    <motion.div 
      className="rounded-3xl p-6 glass mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">{t("recent.transactions")}</h2>
        <Button variant="ghost" size="sm">{t("see.all")}</Button>
      </div>
      
      <div className="space-y-6">
        {dates.slice(0, 3).map((date) => (
          <div key={date}>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {date}
            </h3>
            <div className="space-y-2">
              {groupedTransactions[date].slice(0, 3).map((transaction) => (
                <TransactionCard 
                  key={transaction.id} 
                  transaction={transaction} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {transactions.length > 9 && (
        <div className="text-center mt-4">
          <Button variant="outline" size="sm">
            {t("show.more")}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default RecentTransactions;
