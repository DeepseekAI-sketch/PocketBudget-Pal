
/**
 * Format a number as currency
 */
export const formatCurrency = (
  amount: number, 
  currency = "EUR", 
  locale = "fr-FR"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date in a localized format
 */
export const formatDate = (
  date: Date | string, 
  options: Intl.DateTimeFormatOptions = { 
    day: "numeric", 
    month: "short", 
    year: "numeric" 
  },
  locale = "fr-FR"
): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Format a relative date (today, yesterday, etc.)
 */
export const formatRelativeDate = (date: Date | string, locale = "fr-FR"): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  
  const isToday = 
    dateObj.getDate() === now.getDate() &&
    dateObj.getMonth() === now.getMonth() &&
    dateObj.getFullYear() === now.getFullYear();
    
  if (isToday) {
    return "Aujourd'hui";
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  
  const isYesterday = 
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear();
    
  if (isYesterday) {
    return "Hier";
  }
  
  return formatDate(dateObj, { day: "numeric", month: "short" }, locale);
};

/**
 * Calculate percentage and format it
 */
export const formatPercentage = (value: number, total: number): string => {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength = 30): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
};
