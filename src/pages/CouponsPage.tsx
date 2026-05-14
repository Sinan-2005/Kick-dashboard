import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  Ticket, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Zap,
  Calendar,
  Percent,
  Tag
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

export function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/coupons");
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setCoupons(data);
    } catch (error) {
      console.error("Failed to fetch coupons", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              <Ticket size={12} fill="currentColor" />
              Promotions Engine
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              Market <span className="text-primary">Incentives</span>
            </h2>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest pt-2">
              Configuring active discount codes and seasonal campaigns
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-primary text-black hover:bg-primary/90 font-black uppercase italic tracking-tighter h-11 px-6 rounded-xl">
              <Plus className="mr-2 h-4 w-4" strokeWidth={3} /> Generate Code
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {[
             { label: "Active Codes", value: coupons.length, icon: Zap, color: "text-primary" },
             { label: "Redemptions", value: "0", icon: Ticket, color: "text-foreground" },
             { label: "Revenue Saved", value: "$0", icon: Percent, color: "text-emerald-500" },
             { label: "Expiring Soon", value: "0", icon: Calendar, color: "text-amber-500" }
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

        <Card className="glass-premium border-border/30 overflow-hidden shadow-none">
           <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/20 sticky top-0 z-10">
                <TableRow className="hover:bg-transparent border-border/50 h-16">
                  <TableHead className="w-[150px] pl-6 text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Protocol Code</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Reduction</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Usage Limit</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Expiration</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Status</TableHead>
                  <TableHead className="text-right pr-6 text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell className="pl-6 h-16"><div className="w-24 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-16 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-20 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-24 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-16 h-6 bg-secondary/50 rounded-full" /></TableCell>
                      <TableCell className="text-right pr-6"><div className="w-8 h-8 bg-secondary/50 rounded-lg ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : Array.isArray(coupons) && coupons.length > 0 ? (
                  coupons.map((coupon, i) => (
                    <motion.tr 
                      key={coupon.id} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: i * 0.05 }} 
                      className="group border-border/30 hover:bg-secondary/10 transition-colors"
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-2">
                          <Tag size={12} className="text-primary" />
                          <span className="font-black text-foreground uppercase italic tracking-tighter text-sm">{coupon.code}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-black text-foreground text-sm tracking-tighter">
                          {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-[10px] font-black text-muted-foreground uppercase">{coupon.usedCount || 0} / {coupon.usageLimit || '∞'}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-foreground">
                          {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'NO EXPIRY'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5",
                          coupon.isActive ? "bg-emerald-500 text-emerald-950" : "bg-zinc-800 text-zinc-400"
                        )}>
                          {coupon.isActive ? 'Active' : 'Archived'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-10 w-10 rounded-xl hover:bg-secondary transition-all">
                              <MoreVertical size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border p-2 min-w-[160px]">
                            <DropdownMenuItem className="focus:bg-secondary cursor-pointer rounded-lg font-black uppercase italic text-xs tracking-tighter px-3 py-2.5">
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg font-black uppercase italic text-xs tracking-tighter px-3 py-2.5 text-red-500">
                              <Trash2 className="mr-2 h-4 w-4" /> Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">No Active Promotions</p>
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
