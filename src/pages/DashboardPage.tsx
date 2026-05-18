import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  ArrowUpRight,
  RefreshCcw,
  Star,
  Zap,
  CheckCircle2,
  AlertCircle,
  Plus,
  Ticket,
  Layers,
  ShoppingBag,
  Bell,
  ChevronRight,
  Clock,
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

const quickActions = [
  { title: "Add Product", icon: Plus, color: "bg-primary text-black", href: "/products" },
  { title: "Add Coupon", icon: Ticket, color: "bg-secondary text-foreground", href: "/coupons" },
  { title: "Add Category", icon: Layers, color: "bg-secondary text-foreground", href: "/categories" },
  { title: "Create Order", icon: ShoppingBag, color: "bg-secondary text-foreground", href: "/orders" },
];

import { toast } from "sonner";

export function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    const fetchDashboardData = async () => {
      try {
        const [statsRes, salesRes] = await Promise.all([
          api.get("/analytics/dashboard"),
          api.get("/analytics/sales")
        ]);

        setStats(statsRes.data);
        const sData = Array.isArray(salesRes.data) ? salesRes.data : (salesRes.data?.data || []);
        setSalesData(sData);

        // Map recent orders to activities
        const recentOrders = Array.isArray(statsRes.data?.recentOrders) ? statsRes.data.recentOrders : [];
        const mappedActivities = recentOrders.map((order: any) => ({
          id: order.id,
          type: "order",
          title: `Order #${order.id.substring(0, 8)}`,
          description: `Order by ${order.user?.name || 'Customer'} - $${order.totalAmount}`,
          time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          icon: ShoppingCart,
          color: "text-primary"
        }));
        setActivities(mappedActivities);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const d = stats?.stats ? {
    totalRevenue: stats.stats.totalRevenue || 0,
    monthlySales: stats.stats.totalOrders || 0,
    pendingOrders: stats.stats.totalOrders || 0,
    completedOrders: stats.stats.totalOrders || 0,
    lowStockItems: stats.stats.lowStockCount || 0,
    newCustomers: stats.stats.totalUsers || 0,
    conversionRate: 3.8,
    canceledOrders: 0
  } : {
    totalRevenue: 0, monthlySales: 0, pendingOrders: 0, completedOrders: 0,
    lowStockItems: 0, newCustomers: 0, conversionRate: 0, canceledOrders: 0
  };

  const handleGenerateReport = () => {
    if (!stats) {
      toast.error("Telemetry data unavailable for synthesis.");
      return;
    }

    const reportData = [
      ["Metric", "Value"],
      ["Total Revenue", `$${stats.stats?.totalRevenue || 0}`],
      ["Total Orders", stats.stats?.totalOrders || 0],
      ["Total Users", stats.stats?.totalUsers || 0],
      ["Low Stock Alert", stats.stats?.lowStockCount || 0],
      ["Report Generation Date", new Date().toLocaleString()]
    ];

    const csvContent = reportData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `KICK_SYSTEM_REPORT_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Master performance report synthesized.");
  };

  return (
    <AdminLayout>
      <div className="space-y-10 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]"
            >
              <Zap size={12} fill="currentColor" />
              Real-time Performance
            </motion.div>
            <h2 className="text-5xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              Command <span className="text-primary">Center</span>
            </h2>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest pt-2">
              Monitoring global storefront metrics and live activities
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleGenerateReport} className="bg-primary text-black hover:bg-primary/90 font-black uppercase italic tracking-tighter px-6 h-12 rounded-xl group shadow-neon">
              Generate Report
              <ArrowUpRight className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Revenue" value={d.totalRevenue} prefix="$" icon={DollarSign} trend={12.5} trendType="up" description="Since last month" delay={0.1} />
          <StatCard title="Total Orders" value={d.monthlySales} icon={ShoppingCart} trend={8.2} trendType="up" description="Projected growth" delay={0.2} />
          <StatCard title="Active Users" value={d.newCustomers} icon={Users} trend={4.1} trendType="up" description="Registered customers" delay={0.3} />
          <StatCard title="Low Stock" value={d.lowStockItems} icon={AlertCircle} trend={15.4} trendType="down" description="Items below threshold" delay={0.4} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Card className="glass-premium border-border/30 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-6 pt-8 px-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <CardTitle className="text-2xl font-black text-foreground uppercase italic tracking-tighter">Revenue <span className="text-primary">Flow</span></CardTitle>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Detailed financial flow analytics</p>
                </div>
              </CardHeader>
              <CardContent className="pt-10 px-4">
                <div className="h-[400px] w-full min-h-[400px] relative">
                  {mounted && !isLoading ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevenueMain" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" vertical={false} />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }} dy={10} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }} dx={-10} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} itemStyle={{ color: "hsl(var(--primary))", fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '4 4' }} />
                        <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenueMain)" animationDuration={2000} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-secondary/10 rounded-2xl animate-pulse">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Synthesizing Data...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <h3 className="text-lg font-black text-foreground uppercase italic tracking-tighter flex items-center gap-2">
                    <Zap size={18} className="text-primary fill-primary" />
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {quickActions.map((action, i) => (
                      <Link key={i} to={action.href} className="block">
                        <motion.button
                          whileHover={{ y: -5, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "w-full p-6 rounded-2xl border border-border/50 flex flex-col items-center gap-4 group transition-all",
                            i === 0 ? "glass-premium bg-primary/10 border-primary/20 hover:border-primary/50" : "glass border-border/30 hover:border-foreground/20"
                          )}
                        >
                          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", action.color)}>
                            <action.icon size={22} strokeWidth={3} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{action.title}</span>
                        </motion.button>
                      </Link>
                    ))}
                  </div>
               </div>

               <Card className="glass-premium border-border/30 overflow-hidden h-full">
                  <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="text-lg font-black text-foreground uppercase italic tracking-tighter flex items-center justify-between">
                      Inventory Status
                      <Badge variant="outline" className="border-primary/30 text-primary uppercase text-[9px] font-black tracking-widest">Live</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                     <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                           <span className="text-muted-foreground">In Stock Capacity</span>
                           <span className="text-foreground">78%</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} whileInView={{ width: "78%" }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-primary" />
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <Card className="glass-premium border-border/30 h-full flex flex-col sticky top-28">
              <CardHeader className="border-b border-border/50 py-6 px-8 flex flex-row items-center justify-between bg-secondary/10">
                <div>
                  <CardTitle className="text-xl font-black text-foreground uppercase italic tracking-tighter">Live <span className="text-primary">Stream</span></CardTitle>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-1">Real-time system activities</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                   <Bell size={16} className="text-primary animate-bounce" />
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <div className="h-full max-h-[700px] overflow-y-auto custom-scrollbar px-6 py-6 space-y-6">
                  {activities.length > 0 ? activities.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative pl-8 pb-2">
                      <div className={cn("absolute left-0 top-1 w-6 h-6 rounded-lg flex items-center justify-center", item.type === 'order' ? "bg-primary text-black" : "bg-secondary border border-border/50")}>
                         <item.icon size={12} strokeWidth={3} className={item.type !== 'order' ? item.color : ""} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[11px] font-black text-foreground uppercase tracking-tight">{item.title}</h4>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">{item.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium pr-4 leading-relaxed">{item.description}</p>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                       <Clock size={32} className="text-muted-foreground opacity-20 animate-pulse" />
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">No Recent Activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
