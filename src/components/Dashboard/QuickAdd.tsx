
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts";

interface QuickAddProps {
  openAddTransaction: (type: "income" | "expense") => void;
}

const QuickAdd: React.FC<QuickAddProps> = ({ openAddTransaction }) => {
  const { t } = useLanguage();

  return (
    <motion.div 
      className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center my-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        onClick={() => openAddTransaction("expense")}
        className="flex-1 py-6 text-md bg-red-500 hover:bg-red-600 shadow-md rounded-xl"
      >
        <TrendingDownIcon className="mr-2" size={18} />
        {t("expense")}
      </Button>
      
      <Button
        onClick={() => openAddTransaction("income")}
        className="flex-1 py-6 text-md bg-green-500 hover:bg-green-600 shadow-md rounded-xl"
      >
        <TrendingUpIcon className="mr-2" size={18} />
        {t("income")}
      </Button>
    </motion.div>
  );
};

export default QuickAdd;
