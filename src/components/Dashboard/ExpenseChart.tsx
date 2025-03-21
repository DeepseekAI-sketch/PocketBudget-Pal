
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useFinanceStore } from "@/lib/store";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import CategoryIcon, { getCategoryMetadata } from "@/components/UI/CategoryIcon";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts";

const ExpenseChart = () => {
  const summary = useFinanceStore((state) => state.getCurrentPeriodSummary());
  const { expenseByCategory, totalExpense } = summary;
  const { t } = useLanguage();
  
  // Sort categories by amount
  const sortedCategories = useMemo(() => {
    return [...expenseByCategory].sort((a, b) => b.amount - a.amount);
  }, [expenseByCategory]);

  if (!sortedCategories.length) {
    return (
      <div className="rounded-3xl p-6 glass text-center">
        <h2 className="text-lg font-medium mb-4">{t("expense.by.category")}</h2>
        <div className="py-12 flex flex-col items-center justify-center">
          <p className="text-muted-foreground mb-2">{t("no.expense.this.month")}</p>
          <p className="text-xs text-muted-foreground">
            {t("add.transactions.to.see.stats")}
          </p>
        </div>
      </div>
    );
  }

  const chartData = sortedCategories.map((item) => ({
    name: t(item.category),
    value: item.amount,
    color: getCategoryMetadata(item.category).color,
    category: item.category,
    percentage: item.percentage,
  }));

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        fontSize={12}
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass p-3 rounded-lg shadow-lg border border-white/20 text-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{formatCurrency(data.value)}</p>
          <p className="text-xs text-muted-foreground">{`${data.percentage.toFixed(1)}% ${t("of.total")}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="rounded-3xl p-6 glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-lg font-medium mb-4">{t("expense.by.category")}</h2>
      
      <div className="h-[240px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={90}
              innerRadius={40}
              paddingAngle={2}
              dataKey="value"
              animationDuration={1000}
              animationBegin={200}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 space-y-2">
        {chartData.slice(0, 5).map((entry, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CategoryIcon category={entry.category} size={16} />
              <span className="text-sm">{entry.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{formatCurrency(entry.value)}</span>
              <span className="text-xs text-muted-foreground">
                {formatPercentage(entry.value, totalExpense)}
              </span>
            </div>
          </div>
        ))}
        
        {chartData.length > 5 && (
          <div className="text-xs text-center text-muted-foreground mt-2">
            + {chartData.length - 5} {t("other.categories")}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ExpenseChart;
