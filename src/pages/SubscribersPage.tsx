import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { motion } from "framer-motion";
import { Mail, Loader2, Trash2, Users } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/newsletter/subscribers");
      setSubscribers(data);
    } catch (error) {
      toast.error("Failed to fetch subscribers");
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeUser = async (email: string) => {
    try {
      await api.delete(`/newsletter/unsubscribe/${email}`);
      toast.success("User unsubscribed");
      fetchSubscribers();
    } catch (error) {
      toast.error("Failed to unsubscribe user");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              <Users size={12} fill="currentColor" />
              Community Engine
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              Newsletter <span className="text-primary">Subs</span>
            </h2>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest pt-2">
              Managing your email list and subscribers
            </p>
          </div>
        </div>

        <Card className="glass-premium border-border/30 overflow-hidden shadow-none">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/20 sticky top-0 z-10">
                <TableRow className="hover:bg-transparent border-border/50 h-16">
                  <TableHead className="w-[300px] pl-6 text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Email Address</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Status</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Subscribed On</TableHead>
                  <TableHead className="text-right pr-6 text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell className="pl-6 h-16"><div className="w-48 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-16 h-4 bg-secondary/50 rounded-full" /></TableCell>
                      <TableCell><div className="w-24 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell className="text-right pr-6"><div className="w-8 h-8 bg-secondary/50 rounded-lg ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : subscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <Mail size={48} className="text-muted-foreground opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">No Subscribers Detected</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  subscribers.map((sub, i) => (
                    <motion.tr 
                      key={sub.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group border-border/30 hover:bg-secondary/10 transition-colors"
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Mail size={16} />
                          </div>
                          <span className="font-medium text-sm font-black text-foreground italic tracking-tighter">{sub.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5",
                          sub.isActive ? "bg-emerald-500 text-emerald-950" : "bg-red-500/20 text-red-500"
                        )}>
                          {sub.isActive ? "Active" : "Unsubscribed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-foreground">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        {sub.isActive && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => unsubscribeUser(sub.email)}
                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-10 w-10 rounded-xl transition-all"
                            title="Unsubscribe User"
                          >
                            <Trash2 size={18} />
                          </Button>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
