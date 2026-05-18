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
import { toast } from "sonner";

export function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newIdentity, setNewIdentity] = useState({ name: "", email: "", password: "", role: "USER" });

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/users");
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

  const handleAddIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", newIdentity);
      toast.success("Identity synthesized and added to registry");
      setIsAddModalOpen(false);
      setNewIdentity({ name: "", email: "", password: "", role: "USER" });
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Synthesis Protocol Failure");
    }
  };

  const handleSuspend = async (id: string) => {
    if (!window.confirm("Are you sure you want to suspend this identity? Access will be revoked.")) return;
    try {
      await api.delete(`/users/${id}`);
      setCustomers(prev => prev.filter(u => u.id !== id));
      toast.success("Identity suspended. Node access terminated.");
    } catch (error) {
      console.error("Suspension failed", error);
      toast.error("Suspension Protocol Error");
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Button onClick={() => toast("Exporting identity ledger...")} variant="outline" className="border-border/50 bg-card/50 text-foreground hover:bg-secondary h-11 rounded-xl font-black uppercase italic tracking-tighter text-xs">
              <Download className="mr-2 h-4 w-4" /> Export Identities
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-primary text-black hover:bg-primary/90 font-black uppercase italic tracking-tighter h-11 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">
              <Plus className="mr-2 h-4 w-4" strokeWidth={3} /> Add Identity
            </Button>
          </div>
        </div>

        {/* Add Identity Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setIsAddModalOpen(false)} 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="relative w-full max-w-lg glass-premium p-10 rounded-[3rem] border border-border/50 space-y-8"
            >
              <div className="space-y-1">
                <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Identity <span className="text-primary">Synthesis</span></h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Register new operative credentials</p>
              </div>
              
              <form onSubmit={handleAddIdentity} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic ml-2">Designation (Name)</label>
                    <Input 
                      required 
                      placeholder="e.g. Neo Anderson" 
                      value={newIdentity.name}
                      onChange={(e) => setNewIdentity({...newIdentity, name: e.target.value})}
                      className="bg-secondary/20 border-border/50 h-14 rounded-2xl focus:border-primary/50 font-bold uppercase italic"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic ml-2">Core Identifier (Email)</label>
                    <Input 
                      required 
                      type="email"
                      placeholder="agent@matrix.com" 
                      value={newIdentity.email}
                      onChange={(e) => setNewIdentity({...newIdentity, email: e.target.value})}
                      className="bg-secondary/20 border-border/50 h-14 rounded-2xl focus:border-primary/50 font-bold uppercase italic"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic ml-2">Access Key (Password)</label>
                    <Input 
                      required 
                      type="password"
                      placeholder="••••••••" 
                      value={newIdentity.password}
                      onChange={(e) => setNewIdentity({...newIdentity, password: e.target.value})}
                      className="bg-secondary/20 border-border/50 h-14 rounded-2xl focus:border-primary/50 font-bold uppercase italic"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic ml-2">Authority Level (Role)</label>
                    <select 
                      value={newIdentity.role}
                      onChange={(e) => setNewIdentity({...newIdentity, role: e.target.value})}
                      className="w-full bg-secondary/20 border border-border/50 h-14 rounded-2xl px-4 focus:outline-none focus:border-primary/50 font-bold uppercase italic appearance-none"
                    >
                       <option value="USER" className="bg-black">Operative (User)</option>
                       <option value="ADMIN" className="bg-black">Commander (Admin)</option>
                    </select>
                 </div>
                 
                 <div className="flex gap-4 pt-4">
                    <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="flex-1 h-16 rounded-2xl font-black uppercase italic tracking-widest">Abort</Button>
                    <Button type="submit" className="flex-[2] h-16 bg-primary text-black rounded-2xl font-black uppercase italic tracking-widest shadow-lg shadow-primary/20">Synthesize Identity</Button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}

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
           <Button onClick={() => toast("Authority filters coming in next node update")} variant="outline" className="h-14 px-6 border-border/50 bg-card text-foreground rounded-2xl font-black uppercase italic tracking-widest text-xs">
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
                ) : Array.isArray(filteredCustomers) && filteredCustomers.length > 0 ? (
                  filteredCustomers.map((user, i) => (
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
                            <DropdownMenuItem onClick={() => toast(`Comms channel opening for ${user.email}`)} className="focus:bg-primary focus:text-black cursor-pointer rounded-lg font-black uppercase italic text-xs tracking-tighter px-3 py-2.5">
                              <Mail className="mr-2 h-4 w-4" /> Message
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast("Elevation protocol requires SuperAdmin approval")} className="focus:bg-secondary cursor-pointer rounded-lg font-black uppercase italic text-xs tracking-tighter px-3 py-2.5">
                              <UserCheck className="mr-2 h-4 w-4" /> Elevate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSuspend(user.id)} className="focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg font-black uppercase italic text-xs tracking-tighter px-3 py-2.5 text-red-500">
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
