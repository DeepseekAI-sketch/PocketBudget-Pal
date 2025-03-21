
import React from "react";
import { Category, TransactionType } from "@/lib/types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/store";
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

interface CategoryIconProps {
  category: Category;
  size?: number;
  className?: string;
  withBackground?: boolean;
}

export const getCategoryMetadata = (category: Category) => {
  return (
    EXPENSE_CATEGORIES[category as string] ||
    INCOME_CATEGORIES[category as string] ||
    { name: category, icon: "circle", color: "#9e9e9e" }
  );
};

const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  size = 20,
  className = "",
  withBackground = false,
}) => {
  const { icon, color } = getCategoryMetadata(category);
  
  // Get the icon component more safely
  const IconComponent = Object.entries(Icons).find(
    ([iconName]) => iconName.toLowerCase() === icon.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('').toLowerCase()
  )?.[1] as LucideIcon || Icons.Circle;

  if (withBackground) {
    return (
      <div
        className={`flex items-center justify-center rounded-full ${className}`}
        style={{
          backgroundColor: `${color}20`, // Use the color with transparency
          width: size * 2,
          height: size * 2,
        }}
      >
        <IconComponent size={size} color={color} />
      </div>
    );
  }

  return <IconComponent size={size} color={color} className={className} />;
};

export default CategoryIcon;
