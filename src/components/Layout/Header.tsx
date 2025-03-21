
import React from "react";
import { useFinanceStore } from "@/lib/store";
import { formatCurrency } from "@/utils/formatters";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/contexts";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  openAddTransaction: () => void;
}

const Header: React.FC<HeaderProps> = ({ openAddTransaction }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const summary = useFinanceStore((state) => state.getCurrentPeriodSummary());
  const { totalIncome, totalExpense, balance } = summary;
  const { t } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-10 w-full glass">
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              <h1 className="text-2xl font-bold tracking-tight">
                {t("app.title")}
              </h1>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-20"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActive("/") ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {t("dashboard")}
              </Link>
              <Link
                to="/transactions"
                className={`text-sm font-medium transition-colors ${
                  isActive("/transactions") ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {t("transactions")}
              </Link>
              <Link
                to="/analytics"
                className={`text-sm font-medium transition-colors ${
                  isActive("/analytics") ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {t("analytics")}
              </Link>
              <Link
                to="/budgets"
                className={`text-sm font-medium transition-colors ${
                  isActive("/budgets") ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {t("budgets")}
              </Link>
            </nav>

            <Button onClick={openAddTransaction} className="rounded-full">
              {t("add")}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 md:hidden glass shadow-lg border-t border-border"
        >
          <nav className="flex flex-col p-4 gap-4">
            <Link
              to="/"
              className={`py-2 px-4 rounded-lg transition-colors ${
                isActive("/") ? "text-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {t("dashboard")}
            </Link>
            <Link
              to="/transactions"
              className={`py-2 px-4 rounded-lg transition-colors ${
                isActive("/transactions") ? "text-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {t("transactions")}
            </Link>
            <Link
              to="/analytics"
              className={`py-2 px-4 rounded-lg transition-colors ${
                isActive("/analytics") ? "text-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {t("analytics")}
            </Link>
            <Link
              to="/budgets"
              className={`py-2 px-4 rounded-lg transition-colors ${
                isActive("/budgets") ? "text-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {t("budgets")}
            </Link>
            <Button 
              onClick={() => {
                openAddTransaction();
                setIsOpen(false);
              }}
              className="mt-2"
            >
              {t("add.transaction")}
            </Button>
          </nav>
        </motion.div>
      )}

      {/* Balance summary */}
      <div className="container mx-auto pb-4">
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-xl p-4 glass-dark"
          >
            <p className="text-xs text-muted-foreground mb-1">{t("income")}</p>
            <p className="text-lg font-semibold text-green-500">
              {formatCurrency(totalIncome)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="rounded-xl p-4 glass-dark"
          >
            <p className="text-xs text-muted-foreground mb-1">{t("expense")}</p>
            <p className="text-lg font-semibold text-red-500">
              {formatCurrency(totalExpense)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="rounded-xl p-4 glass-dark"
          >
            <p className="text-xs text-muted-foreground mb-1">{t("total.balance")}</p>
            <p className={`text-lg font-semibold ${balance >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
              {formatCurrency(balance)}
            </p>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
