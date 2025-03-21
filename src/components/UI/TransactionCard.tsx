
import React from "react";
import { Transaction } from "@/lib/types";
import { formatCurrency, formatRelativeDate } from "@/utils/formatters";
import CategoryIcon, { getCategoryMetadata } from "./CategoryIcon";
import { cn } from "@/lib/utils";

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
  className?: string;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onClick,
  className,
}) => {
  const { type, amount, category, date, description, account } = transaction;
  const { name: categoryName, color } = getCategoryMetadata(category);
  
  return (
    <div 
      className={cn(
        "flex items-center p-4 rounded-2xl cursor-pointer transition-all hover:shadow-md animate-in glass",
        className
      )}
      onClick={onClick}
    >
      <div className="mr-4">
        <CategoryIcon category={category} size={24} withBackground />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-foreground">{description || categoryName}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span>{formatRelativeDate(date)}</span>
              <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/40"></span>
              <span>{account}</span>
            </p>
          </div>
          
          <div className="text-right">
            <p className={cn(
              "font-medium",
              type === "expense" ? "text-red-500" : "text-green-500"
            )}>
              {type === "expense" ? "-" : "+"}{formatCurrency(amount)}
            </p>
            <span className="text-xs text-muted-foreground">
              {categoryName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
