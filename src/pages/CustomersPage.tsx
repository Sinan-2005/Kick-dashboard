import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  UserCheck, 
  ShieldAlert,
  Download,
  Plus
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
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

export function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/users");
      // Filter for non-admin users if necessary, or show all
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              <Users size={12} fill="currentColor" />
              Client Database
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              Identity <span className="text-primary">Registry</span>
            </h2>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest pt-2">
              Managing authorized users and terminal access logs
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-border/50 bg-card/50 text-foreground hover:bg-secondary h-11 rounded-xl font-black uppercase italic tracking-tighter text-xs">
              <Download className="mr-2 h-4 w-4" /> Export Identities
            </Button>
            <Button className="bg-primary text-black hover:bg-primary/90 font-black uppercase italic tracking-tighter h-11 px-6 rounded-xl">
              <Plus className="mr-2 h-4 w-4" strokeWidth={3} /> Add Identity
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
           <div className="flex-1 w-full relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
              <Input 
                placeholder="Search by name, email, or identity ID..." 
                className="pl-12 bg-card border-border/50 h-14 rounded-2xl focus:border-primary/50 text-base font-medium uppercase tracking-tight italic"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <Button variant="outline" className="h-14 px-6 border-border/50 bg-card text-foreground rounded-2xl font-black uppercase italic tracking-widest text-xs">
              <Filter size={18} className="mr-2 text-primary" /> Authority Filter
           </Button>
        </div>

        <Card className="glass-premium border-border/30 overflow-hidden shadow-none">
           <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/20 sticky top-0 z-10">
                <TableRow className="hover:bg-transparent border-border/50 h-16">
                  <TableHead className="min-w-[200px] pl-6 text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Identity</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Access Level</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Registry Date</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Orders</TableHead>
                  <TableHead className="text-right pr-6 text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell className="pl-6 h-16"><div className="w-48 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-24 h-6 bg-secondary/50 rounded-full" /></TableCell>
                      <TableCell><div className="w-24 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-12 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell className="text-right pr-6"><div className="w-8 h-8 bg-secondary/50 rounded-lg ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : Array.isArray(customers) && customers.length > 0 ? (
                  customers.map((user, i) => (
                    <motion.tr 
                      key={user.id} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: i * 0.05 }} 
                      className="group border-border/30 hover:bg-secondary/10 transition-colors"
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black uppercase italic">
                            {user.name?.substring(0, 2) || 'G'}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-foreground uppercase italic tracking-tighter text-sm">{user.name || 'Anonymous'}</span>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5",
                          user.role === "SUPER_ADMIN" ? "bg-primary text-black" : 
                          user.role === "ADMIN" ? "bg-secondary text-foreground border border-border/50" : 
                          "bg-zinc-800 text-zinc-400"
                        )}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-foreground">{new Date(user.createdAt).toLocaleDateString()}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-black text-foreground text-sm tracking-tighter">{user.orders?.length || 0}</span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-10 w-10 rounded-xl hover:bg-secondary transition-all">
                              <MoreVertical size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border p-2 min-w-[160px]">
                            <DropdownMenuItem className="focus:bg-primary focus:text-black cursor-pointer rounded-lg font-black uppercase italic text-xs tracking-tighter px-3 py-2.5">
                              <Mail className="mr-2 h-4 w-4" /> Message
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-secondary cursor-pointer rounded-lg font-black uppercase italic text-xs tracking-tighter px-3 py-2.5">
                              <UserCheck className="mr-2 h-4 w-4" /> Elevate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg font-black uppercase italic text-xs tracking-tighter px-3 py-2.5 text-red-500">
                              <ShieldAlert className="mr-2 h-4 w-4" /> Suspend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">No Registered Identities</p>
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
