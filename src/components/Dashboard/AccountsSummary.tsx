
import React from "react";
import { Account } from "@/lib/types";
import { useFinanceStore } from "@/lib/store";
import { formatCurrency } from "@/utils/formatters";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

const AccountsSummary = () => {
  const accounts = useFinanceStore((state) => state.accounts);
  const { t } = useLanguage();
  
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  return (
    <motion.div 
      className="rounded-3xl p-6 glass dark:glass-dark"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">{t("accounts")}</h2>
        <span className="text-sm font-medium">
          {formatCurrency(totalBalance)}
        </span>
      </div>
      
      <div className="space-y-4">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </motion.div>
  );
};

interface AccountCardProps {
  account: Account;
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const { name, balance, color, icon } = account;
  
  // Get the icon component more safely
  const IconComponent = Icons[icon as keyof typeof Icons] as LucideIcon || Icons.Circle;

  return (
    <div className="flex items-center p-3 rounded-xl bg-white/50 border border-white/20 hover:shadow-sm transition-all dark:bg-slate-800/50 dark:border-slate-700/50">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
        style={{ backgroundColor: `${color}20` }}
      >
        {IconComponent && <IconComponent size={20} color={color} />}
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium">{name}</h3>
      </div>
      
      <div className="text-right">
        <p className="font-medium">{formatCurrency(balance)}</p>
      </div>
    </div>
  );
};

export default AccountsSummary;
