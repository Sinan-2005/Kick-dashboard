import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Ticket, 
  Star, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Zap,
  Sparkles,
  Layers,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";

import { useSidebar } from "@/lib/store";
import { useAuthStore } from "@/store/authStore";

const menuItems = [
  { icon: LayoutDashboard, label: "Command Center", href: "/dashboard" },
  { icon: Package, label: "Inventory", href: "/products" },
  { icon: Layers, label: "Taxonomy", href: "/categories" },
  { icon: ShoppingCart, label: "Fulfillment", href: "/orders" },
  { icon: Users, label: "Client Base", href: "/customers" },
  { icon: ImageIcon, label: "Media Vault", href: "/media" },
  { icon: Ticket, label: "Promotions", href: "/coupons" },
  { icon: Users, label: "Subscribers", href: "/subscribers" },
  { icon: Star, label: "Market Feedback", href: "/reviews" },
  { icon: MessageSquare, label: "Support Desk", href: "/support" },
  { icon: MessageSquare, label: "Tickets", href: "/tickets" },
  { icon: MessageSquare, label: "Node Reports", href: "/messages" },
  { icon: BarChart3, label: "Market Intel", href: "/analytics" },
  { icon: Settings, label: "System Config", href: "/settings" },
];

export function Sidebar() {
  const { isCollapsed, toggle } = useSidebar();
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={cn(
        "fixed left-0 top-0 h-screen z-50 flex flex-col glass-premium border-r border-border/30 transition-all duration-500",
        isCollapsed ? "w-20" : "w-[280px]",
        isCollapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"
      )}
    >
      {/* Logo Section */}
      <div className="p-8 flex items-center justify-between">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Logo size="md" />
          </motion.div>
        )}
        {isCollapsed && (
          <div className="flex items-center justify-center w-full">
            <Logo size="md" iconOnly />
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
          return (
            <Link key={item.href} to={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group",
                  isActive 
                    ? "text-black font-black italic" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <item.icon size={20} strokeWidth={isActive ? 3 : 2} className={cn(isActive ? "text-black" : "group-hover:text-primary transition-colors")} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-nowrap uppercase tracking-widest text-[10px] font-black italic"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-glow"
                    className="absolute inset-0 bg-primary rounded-2xl -z-10 glow-primary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {!isActive && !isCollapsed && (
                  <div className="absolute right-4 w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* System Status */}
      {!isCollapsed && (
        <div className="px-6 mb-4">
           <div className="p-5 rounded-3xl bg-secondary/20 border border-border/30 space-y-4 relative overflow-hidden group">
              <div className="relative z-10 space-y-3">
                 <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">System Status</span>
                 </div>
                 <p className="text-[11px] font-black text-foreground uppercase italic tracking-tighter">All Nodes Operational</p>
                 <div className="h-1 w-full bg-background rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      className="h-full bg-primary" 
                    />
                 </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Zap size={80} />
              </div>
           </div>
        </div>
      )}

      {/* Footer / Logout */}
      <div className="p-4 border-t border-border/30 bg-secondary/10">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-4 px-4 py-4 w-full rounded-2xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 group",
            isCollapsed && "justify-center px-0"
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="uppercase font-black italic text-[10px] tracking-widest"
            >
              Terminate Session
            </motion.span>
          )}
        </button>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="absolute -right-3 top-24 w-7 h-7 rounded-full bg-card border border-border/50 hover:bg-secondary flex z-50"
        >
          {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
        </Button>
      </div>
    </motion.aside>
  );
}
