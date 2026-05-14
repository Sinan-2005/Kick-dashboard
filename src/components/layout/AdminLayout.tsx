import React from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <div className="min-h-screen bg-premium selection:bg-primary selection:text-black">
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all duration-500"
          onClick={toggle}
        />
      )}
      
      <Sidebar />
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-500",
        isCollapsed ? "md:pl-20" : "pl-0 md:pl-[280px]"
      )}>
        <Navbar />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="w-full">
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
