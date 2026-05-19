import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { motion } from "framer-motion";
import { Ticket as TicketIcon, Search, Filter, Eye } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/support/tickets");
      setTickets(data);
    } catch (error) {
      toast.error("Failed to fetch tickets");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-primary text-black';
      case 'OPEN': return 'bg-yellow-500 text-black';
      case 'IN_PROGRESS': return 'bg-blue-500 text-white';
      case 'RESOLVED': return 'bg-green-500 text-white';
      case 'CLOSED': return 'bg-secondary text-muted-foreground';
      case 'SPAM': return 'bg-red-500 text-white';
      default: return 'bg-secondary text-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'text-gray-400';
      case 'MEDIUM': return 'text-blue-400';
      case 'HIGH': return 'text-yellow-500';
      case 'URGENT': return 'text-red-500 animate-pulse';
      default: return 'text-gray-400';
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.customerName.toLowerCase().includes(search.toLowerCase()) ||
    t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              <TicketIcon size={12} fill="currentColor" />
              Support Center
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              All <span className="text-primary">Tickets</span>
            </h2>
          </div>
          <div className="flex gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input 
                placeholder="Search tickets..." 
                className="pl-9 bg-secondary/30 border-border/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-border/50">
              <Filter size={16} className="mr-2" /> Filter
            </Button>
          </div>
        </div>

        <Card className="glass-premium border-border/30 overflow-hidden shadow-none">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/20 sticky top-0 z-10">
                <TableRow className="hover:bg-transparent border-border/50 h-16">
                  <TableHead className="w-[120px] pl-6 text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">ID</TableHead>
                  <TableHead className="w-[200px] text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Customer</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Subject</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Status</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Priority</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Created</TableHead>
                  <TableHead className="text-right pr-6 text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell className="pl-6 h-16"><div className="w-20 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-32 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-64 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-16 h-4 bg-secondary/50 rounded-full" /></TableCell>
                      <TableCell><div className="w-16 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-24 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell className="text-right pr-6"><div className="w-8 h-8 bg-secondary/50 rounded-lg ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <TicketIcon size={48} className="text-muted-foreground opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">No Tickets Found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket, i) => (
                    <motion.tr 
                      key={ticket.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group border-border/30 hover:bg-secondary/10 transition-colors cursor-pointer"
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                    >
                      <TableCell className="pl-6">
                        <span className="font-bold text-xs text-muted-foreground">{ticket.ticketNumber}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm font-black text-foreground italic tracking-tighter">
                            {ticket.customerName}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium">{ticket.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col max-w-sm">
                           <span className="font-bold text-sm truncate">{ticket.subject}</span>
                           <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest truncate">{ticket.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5", getStatusColor(ticket.status))}>
                          {ticket.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={cn("text-xs font-black uppercase tracking-widest", getPriorityColor(ticket.priority))}>
                          {ticket.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-foreground">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                         <Button variant="ghost" size="icon" className="hover:text-primary transition-all">
                            <Eye size={16} />
                         </Button>
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
