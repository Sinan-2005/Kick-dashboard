import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { motion } from "framer-motion";
import { MessageSquare, Loader2, Trash2, CheckCircle, MailOpen } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/contact/messages");
      setMessages(data);
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/contact/messages/${id}/read`);
      toast.success("Message marked as read");
      setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await api.delete(`/contact/messages/${id}`);
      toast.success("Message deleted");
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              <MessageSquare size={12} fill="currentColor" />
              Comms Terminal
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              Node <span className="text-primary">Reports</span>
            </h2>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest pt-2">
              Review and manage incoming reports and transmissions from operatives
            </p>
          </div>
        </div>

        <Card className="glass-premium border-border/30 overflow-hidden shadow-none">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/20 sticky top-0 z-10">
                <TableRow className="hover:bg-transparent border-border/50 h-16">
                  <TableHead className="w-[200px] pl-6 text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Operative</TableHead>
                  <TableHead className="w-[400px] text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Payload (Message)</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Status</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Received</TableHead>
                  <TableHead className="text-right pr-6 text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell className="pl-6 h-16"><div className="w-32 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-64 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-16 h-4 bg-secondary/50 rounded-full" /></TableCell>
                      <TableCell><div className="w-24 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell className="text-right pr-6"><div className="w-8 h-8 bg-secondary/50 rounded-lg ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <MessageSquare size={48} className="text-muted-foreground opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">No Transmissions Detected</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((msg, i) => (
                    <motion.tr 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group border-border/30 hover:bg-secondary/10 transition-colors"
                    >
                      <TableCell className="pl-6">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm font-black text-foreground italic tracking-tighter">
                            {msg.firstName} {msg.lastName}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium">{msg.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs text-muted-foreground max-w-sm truncate">
                          {msg.message}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5",
                          msg.isRead ? "bg-secondary text-muted-foreground" : "bg-primary text-black"
                        )}>
                          {msg.isRead ? "Read" : "New"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-foreground">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          {!msg.isRead && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => markAsRead(msg.id)}
                              className="text-primary hover:text-primary hover:bg-primary/10 h-8 w-8 rounded-lg transition-all"
                              title="Mark as Read"
                            >
                              <CheckCircle size={16} />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteMessage(msg.id)}
                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 rounded-lg transition-all"
                            title="Delete Message"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
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
