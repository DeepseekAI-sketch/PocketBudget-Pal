
import React from "react";
import { Home, BarChart3, PlusCircle, Clock, Settings } from "lucide-react";
import { useLanguage } from "@/lib/contexts";
import { Link, useLocation } from "react-router-dom";

interface FooterProps {
  openAddTransaction: () => void;
}

const Footer: React.FC<FooterProps> = ({ openAddTransaction }) => {
  const { t } = useLanguage();
  const location = useLocation();
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-10 md:hidden">
      <div className="glass border-t border-border p-2">
        <div className="flex justify-around items-center">
          <NavItem 
            icon={<Home size={20} />} 
            label={t("home")} 
            to="/"
            active={location.pathname === "/"} 
          />
          <NavItem 
            icon={<BarChart3 size={20} />} 
            label={t("analytics")} 
            to="/analytics"
            active={location.pathname === "/analytics"} 
          />
          <NavItem 
            icon={<PlusCircle size={30} />} 
            label={t("add")} 
            isPrimary 
            onClick={openAddTransaction}
          />
          <NavItem 
            icon={<Clock size={20} />} 
            label={t("transactions")} 
            to="/transactions"
            active={location.pathname === "/transactions"} 
          />
          <NavItem 
            icon={<Settings size={20} />} 
            label={t("budgets")} 
            to="/budgets"
            active={location.pathname === "/budgets"} 
          />
        </div>
      </div>
    </footer>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isPrimary?: boolean;
  onClick?: () => void;
  to?: string;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  active, 
  isPrimary, 
  onClick,
  to
}) => {
  const Content = (
    <>
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </>
  );
  
  const className = `flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-colors ${
    isPrimary 
      ? "text-primary -mt-6 animate-pulse-light" 
      : active 
        ? "text-primary" 
        : "text-muted-foreground hover:text-foreground"
  }`;
  
  if (to) {
    return (
      <Link to={to} className={className}>
        {Content}
      </Link>
    );
  }
  
  return (
    <button 
      className={className}
      onClick={onClick}
    >
      {Content}
    </button>
  );
};

export default Footer;
