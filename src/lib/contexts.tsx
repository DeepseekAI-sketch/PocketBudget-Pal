
import React, { createContext, useContext, useState, useEffect } from "react";

// Language types
export type Language = "fr" | "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Translation data
export const translations = {
  fr: {
    // Dashboard
    "app.title": "Gestionnaire de Finances",
    "expense": "Dépense",
    "income": "Revenu",
    "accounts": "Mes comptes",
    "recent.transactions": "Transactions récentes",
    "see.all": "Voir tout",
    "today": "Aujourd'hui",
    "yesterday": "Hier",
    "total.balance": "Solde total",
    // Categories
    "food": "Alimentation",
    "transport": "Transport",
    "entertainment": "Divertissement",
    "shopping": "Shopping",
    "health": "Santé",
    "home": "Maison",
    "bills": "Factures",
    "education": "Éducation",
    "other": "Autre",
    "salary": "Salaire",
    "freelance": "Freelance",
    "gifts": "Cadeaux",
    "investments": "Investissements",
    // Theme and Navigation
    "theme.toggle": "Changer de thème",
    "theme.toggle.dark": "Passer en mode sombre",
    "theme.toggle.light": "Passer en mode clair",
    "language.toggle": "Changer de langue",
    "dashboard": "Tableau de bord",
    "transactions": "Transactions",
    "analytics": "Analyses",
    "budgets": "Budgets",
    "add": "Ajouter",
    "add.transaction": "Ajouter une transaction",
    "back.home": "Retourner à l'accueil",
    "page.not.found": "Cette page n'existe pas",
    // Expense chart
    "expense.by.category": "Dépenses par catégorie",
    "no.expense.this.month": "Aucune dépense ce mois-ci",
    "add.transactions.to.see.stats": "Ajoutez des transactions pour voir les statistiques",
    "of.total": "du total",
    "other.categories": "autres catégories",
    // Recent transactions
    "no.transactions": "Aucune transaction",
    "start.by.adding.transaction": "Commencez par ajouter une transaction",
    "show.more": "Afficher plus",
    // Footer and common
    "home": "Accueil", 
    "history": "Historique",
    "settings": "Paramètres",
    // Analytics
    "monthly.overview": "Aperçu mensuel",
    "category.breakdown": "Répartition par catégorie",
    "no.income.this.month": "Aucun revenu ce mois-ci",
    // Budgets
    "add.budget": "Ajouter un budget"
  },
  en: {
    // Dashboard
    "app.title": "Finance Manager",
    "expense": "Expense",
    "income": "Income",
    "accounts": "My Accounts",
    "recent.transactions": "Recent Transactions",
    "see.all": "See All",
    "today": "Today",
    "yesterday": "Yesterday",
    "total.balance": "Total Balance",
    // Categories
    "food": "Food",
    "transport": "Transportation",
    "entertainment": "Entertainment",
    "shopping": "Shopping",
    "health": "Health",
    "home": "Home",
    "bills": "Bills",
    "education": "Education",
    "other": "Other",
    "salary": "Salary",
    "freelance": "Freelance",
    "gifts": "Gifts",
    "investments": "Investments",
    // Theme and Navigation
    "theme.toggle": "Toggle Theme",
    "theme.toggle.dark": "Switch to dark mode",
    "theme.toggle.light": "Switch to light mode",
    "language.toggle": "Change Language",
    "dashboard": "Dashboard",
    "transactions": "Transactions",
    "analytics": "Analytics",
    "budgets": "Budgets",
    "add": "Add",
    "add.transaction": "Add Transaction",
    "back.home": "Back to Home",
    "page.not.found": "Page Not Found",
    // Expense chart
    "expense.by.category": "Expenses by Category",
    "no.expense.this.month": "No expenses this month",
    "add.transactions.to.see.stats": "Add transactions to see statistics",
    "of.total": "of total",
    "other.categories": "other categories",
    // Recent transactions
    "no.transactions": "No transactions",
    "start.by.adding.transaction": "Start by adding a transaction",
    "show.more": "Show more",
    // Footer and common
    "home": "Home",
    "history": "History",
    "settings": "Settings",
    // Analytics
    "monthly.overview": "Monthly Overview",
    "category.breakdown": "Category Breakdown",
    "no.income.this.month": "No income this month",
    // Budgets
    "add.budget": "Add Budget"
  },
  ar: {
    // Dashboard
    "app.title": "مدير المالية",
    "expense": "مصروف",
    "income": "دخل",
    "accounts": "حساباتي",
    "recent.transactions": "المعاملات الأخيرة",
    "see.all": "عرض الكل",
    "today": "اليوم",
    "yesterday": "أمس",
    "total.balance": "الرصيد الإجمالي",
    // Categories
    "food": "طعام",
    "transport": "نقل",
    "entertainment": "ترفيه",
    "shopping": "تسوق",
    "health": "صحة",
    "home": "منزل",
    "bills": "فواتير",
    "education": "تعليم",
    "other": "آخر",
    "salary": "راتب",
    "freelance": "عمل حر",
    "gifts": "هدايا",
    "investments": "استثمارات",
    // Theme and Navigation
    "theme.toggle": "تغيير المظهر",
    "theme.toggle.dark": "التبديل إلى الوضع المظلم",
    "theme.toggle.light": "التبديل إلى الوضع الفاتح",
    "language.toggle": "تغيير اللغة",
    "dashboard": "لوحة التحكم",
    "transactions": "المعاملات",
    "analytics": "التحليلات",
    "budgets": "الميزانيات",
    "add": "إضافة",
    "add.transaction": "إضافة معاملة",
    "back.home": "العودة للرئيسية",
    "page.not.found": "الصفحة غير موجودة",
    // Expense chart
    "expense.by.category": "المصاريف حسب الفئة",
    "no.expense.this.month": "لا توجد مصاريف هذا الشهر",
    "add.transactions.to.see.stats": "أضف معاملات لرؤية الإحصائيات",
    "of.total": "من المجموع",
    "other.categories": "فئات أخرى",
    // Recent transactions
    "no.transactions": "لا توجد معاملات",
    "start.by.adding.transaction": "ابدأ بإضافة معاملة",
    "show.more": "عرض المزيد",
    // Footer and common
    "home": "الرئيسية",
    "history": "السجل",
    "settings": "الإعدادات",
    // Analytics
    "monthly.overview": "نظرة عامة شهرية",
    "category.breakdown": "التوزيع حسب الفئة",
    "no.income.this.month": "لا يوجد دخل هذا الشهر",
    // Budgets
    "add.budget": "إضافة ميزانية"
  }
};

// Theme Context
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("app-theme");
    return (savedTheme as "light" | "dark") || "light";
  });

  useEffect(() => {
    localStorage.setItem("app-theme", theme);
    
    // Apply theme to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Language Context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem("app-language");
    return (savedLang as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("app-language", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
