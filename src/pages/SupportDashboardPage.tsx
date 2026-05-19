import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { motion } from "framer-motion";
import { LifeBuoy, AlertCircle, Clock, CheckCircle, MessagesSquare, Users } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SupportDashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    pending: 0,
    resolved: 0,
    urgent: 0,
    newTickets: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get("/support/analytics");
      setStats(data);
    } catch (error) {
      toast.error("Failed to load support analytics");
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { title: "Total Tickets", value: stats.total, icon: MessagesSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "New / Unread", value: stats.newTickets, icon: LifeBuoy, color: "text-primary", bg: "bg-primary/10" },
    { title: "Open Issues", value: stats.open, icon: AlertCircle, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { title: "Pending", value: stats.pending, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Resolved", value: stats.resolved, icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Urgent Priority", value: stats.urgent, icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              <LifeBuoy size={12} fill="currentColor" />
              Support Center
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              Help <span className="text-primary">Desk</span>
            </h2>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest pt-2">
              Real-time overview of customer support metrics and ticket volumes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-premium border-border/30 p-6 flex items-center justify-between group hover:border-primary/50 transition-all duration-300">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.title}</p>
                  <p className="text-4xl font-black italic tracking-tighter">
                    {isLoading ? "-" : stat.value}
                  </p>
                </div>
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                  <stat.icon size={24} strokeWidth={2.5} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="glass-premium border-border/30 p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
          <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground border border-border/50">
             <LifeBuoy size={32} />
          </div>
          <div className="space-y-1">
             <h3 className="font-black text-xl italic uppercase tracking-tighter">Analytics Module Init</h3>
             <p className="text-xs uppercase font-medium tracking-widest text-muted-foreground max-w-md">
               Advanced ticket trends, resolution rates, and agent performance graphs will be visualized here in a future update.
             </p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
