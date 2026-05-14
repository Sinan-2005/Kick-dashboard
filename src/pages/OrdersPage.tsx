import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle,
  TrendingUp,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

export function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        api.get("/orders"),
        api.get("/analytics/dashboard")
      ]);
      const orderData = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data?.data || []);
      setOrders(orderData);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
      case "PAID":
        return <Badge className="bg-emerald-500 text-emerald-950 border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5">Paid</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-500 text-amber-950 border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5">Pending</Badge>;
      case "FAILED":
      case "CANCELLED":
        return <Badge className="bg-red-500 text-red-950 border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5">Failed</Badge>;
      default:
        return <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest px-2 py-0.5">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              <ShoppingCart size={12} fill="currentColor" />
              Order Management
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              Tactical <span className="text-primary">Fulfillment</span>
            </h2>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest pt-2">
              Managing global transactions and shipment logs
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-border/50 bg-card/50 text-foreground hover:bg-secondary h-11 rounded-xl font-black uppercase italic tracking-tighter text-xs">
              <Download className="mr-2 h-4 w-4" /> Export Ledger
            </Button>
          </div>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {[
             { label: "Total Volume", value: stats?.totalOrders || 0, icon: Package, color: "text-foreground" },
             { label: "Realized Revenue", value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: "text-emerald-500" },
             { label: "Awaiting Dispatch", value: "0", icon: Clock, color: "text-amber-500" },
             { label: "Failed Streams", value: "0", icon: XCircle, color: "text-red-500" }
           ].map((stat, i) => (
             <Card key={i} className="glass-premium border-border/30 overflow-hidden group">
                <CardContent className="p-4 flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                      <p className="text-xl font-black text-foreground italic">{stat.value}</p>
                   </div>
                   <div className={cn("w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:scale-110 transition-transform", stat.color)}>
                      <stat.icon size={18} />
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
           <div className="flex-1 w-full relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
              <Input 
                placeholder="Search orders, customers, or transaction IDs..." 
                className="pl-12 bg-card border-border/50 h-14 rounded-2xl focus:border-primary/50 text-base font-medium uppercase tracking-tight italic"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <Button variant="outline" className="h-14 px-6 border-border/50 bg-card text-foreground rounded-2xl font-black uppercase italic tracking-widest text-xs">
              <Filter size={18} className="mr-2 text-primary" /> Filter Matrix
           </Button>
        </div>

        <Card className="glass-premium border-border/30 overflow-hidden shadow-none">
           <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/20 sticky top-0 z-10">
                <TableRow className="hover:bg-transparent border-border/50 h-16">
                  <TableHead className="w-[150px] pl-6 text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Order ID</TableHead>
                  <TableHead className="min-w-[200px] text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Customer</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Date</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Value</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Payment</TableHead>
                  <TableHead className="text-right pr-6 text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell className="pl-6 h-16"><div className="w-24 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-32 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-20 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-16 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-20 h-6 bg-secondary/50 rounded-full" /></TableCell>
                      <TableCell className="text-right pr-6"><div className="w-8 h-8 bg-secondary/50 rounded-lg ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : Array.isArray(orders) && orders.length > 0 ? (
                  orders.map((order, i) => (
                    <motion.tr 
                      key={order.id} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: i * 0.05 }} 
                      className="group border-border/30 hover:bg-secondary/10 transition-colors"
                    >
                      <TableCell className="pl-6">
                        <span className="font-black text-foreground uppercase italic tracking-tighter text-sm">#KCK-{order.id.substring(0, 8)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-black text-foreground uppercase italic tracking-tighter text-sm">{order.user?.name || 'Guest'}</span>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{order.user?.email || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="text-[9px] text-muted-foreground font-black uppercase">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-black text-foreground text-sm tracking-tighter">${order.totalAmount.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.paymentStatus)}</TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-10 w-10 rounded-xl hover:bg-secondary transition-all">
                              <MoreVertical size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border p-2 min-w-[160px]">
                            <DropdownMenuItem className="focus:bg-primary focus:text-black cursor-pointer rounded-lg font-black uppercase italic text-xs tracking-tighter px-3 py-2.5">
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-secondary cursor-pointer rounded-lg font-black uppercase italic text-xs tracking-tighter px-3 py-2.5">
                              <ExternalLink className="mr-2 h-4 w-4" /> Receipt
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <ShoppingCart size={48} className="text-muted-foreground opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">No Transactions Detected</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
           </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
