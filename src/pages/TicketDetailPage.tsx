import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Clock, User, MessageSquare, Shield, Tag, FileText } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [activeTab, setActiveTab] = useState<"reply" | "note">("reply");

  useEffect(() => {
    fetchTicket();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const interval = setInterval(() => {
      // Silently refetch ticket without triggering full screen loading spinner
      api.get(`/support/tickets/${id}`).then(({ data }) => {
        setTicket(data);
      }).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchTicket = async () => {
    try {
      const { data } = await api.get(`/support/tickets/${id}`);
      setTicket(data);
    } catch (error) {
      toast.error("Failed to load ticket");
      navigate("/tickets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    try {
      await api.post(`/support/tickets/${id}/reply`, { message: replyMessage, isAdmin: true });
      toast.success("Reply sent successfully");
      setReplyMessage("");
      fetchTicket();
    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  const handleAddNote = async () => {
    if (!internalNote.trim()) return;
    try {
      await api.post(`/support/tickets/${id}/notes`, { note: internalNote });
      toast.success("Internal note added");
      setInternalNote("");
      fetchTicket();
    } catch (error) {
      toast.error("Failed to add note");
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      await api.patch(`/support/tickets/${id}/status`, { status });
      toast.success(`Status updated to ${status}`);
      fetchTicket();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) return <AdminLayout><div className="flex h-64 items-center justify-center"><Clock className="animate-spin text-primary" /></div></AdminLayout>;
  if (!ticket) return null;

  return (
    <AdminLayout>
      <div className="space-y-6 pb-20 max-w-7xl">
        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" onClick={() => navigate("/tickets")} className="rounded-full bg-secondary/50 hover:bg-secondary">
             <ArrowLeft size={18} />
           </Button>
           <div>
             <div className="flex items-center gap-3">
               <h2 className="text-2xl font-black italic uppercase tracking-tighter">{ticket.subject}</h2>
               <Badge className="bg-primary text-black font-black uppercase text-[10px] tracking-widest">{ticket.ticketNumber}</Badge>
             </div>
             <p className="text-muted-foreground text-xs font-black uppercase tracking-widest mt-1">
               {ticket.category} • Created {new Date(ticket.createdAt).toLocaleString()}
             </p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Conversation Thread */}
           <div className="lg:col-span-2 space-y-6">
              <Card className="glass-premium border-border/30 p-6 flex flex-col h-[500px]">
                 <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
                    {/* Original Message */}
                    <div className="flex gap-4">
                       <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                         <User size={18} />
                       </div>
                       <div className="space-y-1 w-full">
                         <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{ticket.customerName}</span>
                            <span className="text-[10px] text-muted-foreground font-black uppercase">{new Date(ticket.createdAt).toLocaleString()}</span>
                         </div>
                         <div className="bg-secondary/20 p-4 rounded-2xl rounded-tl-none border border-border/30 text-sm">
                            {ticket.message}
                         </div>
                       </div>
                    </div>

                    {/* Replies */}
                    {ticket.replies.map((reply: any) => (
                      <div key={reply.id} className={cn("flex gap-4", reply.isAdmin && "flex-row-reverse")}>
                         <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", reply.isAdmin ? "bg-primary text-black" : "bg-secondary")}>
                           {reply.isAdmin ? <Shield size={18} /> : <User size={18} />}
                         </div>
                         <div className={cn("space-y-1 w-full flex flex-col", reply.isAdmin && "items-end")}>
                           <div className="flex items-center gap-2">
                              <span className="font-bold text-sm">{reply.isAdmin ? "Support Agent" : ticket.customerName}</span>
                              <span className="text-[10px] text-muted-foreground font-black uppercase">{new Date(reply.createdAt).toLocaleString()}</span>
                           </div>
                           <div className={cn(
                             "p-4 rounded-2xl border text-sm max-w-[80%]",
                             reply.isAdmin 
                               ? "bg-primary/10 border-primary/20 rounded-tr-none text-foreground" 
                               : "bg-secondary/20 border-border/30 rounded-tl-none"
                           )}>
                              {reply.message}
                           </div>
                         </div>
                      </div>
                    ))}

                    {/* Internal Notes */}
                    {ticket.notes.map((note: any) => (
                      <div key={note.id} className="flex gap-4 justify-center">
                         <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-2xl text-sm w-full max-w-[80%] relative">
                            <div className="absolute -top-2.5 left-4 bg-yellow-500 text-black text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                               <FileText size={10} /> Internal Note
                            </div>
                            <span className="font-bold mr-2">{note.admin.name}:</span>
                            <span className="text-yellow-500/90">{note.note}</span>
                         </div>
                      </div>
                    ))}
                 </div>

                 {/* Reply Box */}
                 <div className="pt-6 border-t border-border/30 mt-4 space-y-4">
                    <div className="flex gap-2">
                       <Button 
                         variant={activeTab === "reply" ? "default" : "outline"} 
                         size="sm" 
                         className={cn("rounded-full text-xs font-black uppercase tracking-widest", activeTab === "reply" && "bg-primary text-black")}
                         onClick={() => setActiveTab("reply")}
                       >
                         Public Reply
                       </Button>
                       <Button 
                         variant={activeTab === "note" ? "default" : "outline"} 
                         size="sm" 
                         className={cn("rounded-full text-xs font-black uppercase tracking-widest", activeTab === "note" && "bg-yellow-500 text-black hover:bg-yellow-600")}
                         onClick={() => setActiveTab("note")}
                       >
                         Private Note
                       </Button>
                    </div>

                    {activeTab === "reply" ? (
                      <div className="flex gap-3">
                        <textarea 
                          className="flex-1 bg-secondary/30 border border-border/50 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none h-24"
                          placeholder="Type your reply to the customer..."
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                        />
                        <Button onClick={handleReply} className="h-24 px-6 rounded-2xl flex flex-col gap-2 bg-primary text-black hover:bg-primary/80">
                          <Send size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Send</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <textarea 
                          className="flex-1 bg-yellow-500/5 border border-yellow-500/30 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 resize-none h-24 placeholder:text-yellow-500/50"
                          placeholder="Type an internal note (customers cannot see this)..."
                          value={internalNote}
                          onChange={(e) => setInternalNote(e.target.value)}
                        />
                        <Button onClick={handleAddNote} className="h-24 px-6 rounded-2xl flex flex-col gap-2 bg-yellow-500 text-black hover:bg-yellow-600">
                          <FileText size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Add</span>
                        </Button>
                      </div>
                    )}
                 </div>
              </Card>
           </div>

           {/* Sidebar Info */}
           <div className="space-y-6">
              <Card className="glass-premium border-border/30 p-6 space-y-6">
                 <h3 className="font-black italic uppercase tracking-tighter text-lg border-b border-border/30 pb-3">Customer Profile</h3>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                         <User size={20} className="text-muted-foreground" />
                       </div>
                       <div>
                         <p className="font-bold">{ticket.customerName}</p>
                         <p className="text-xs text-muted-foreground">{ticket.email}</p>
                       </div>
                    </div>
                 </div>
              </Card>

              <Card className="glass-premium border-border/30 p-6 space-y-6">
                 <h3 className="font-black italic uppercase tracking-tighter text-lg border-b border-border/30 pb-3">Ticket Properties</h3>
                 <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</label>
                      <select 
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="w-full bg-secondary/50 border border-border/50 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-primary"
                      >
                        <option value="NEW">New</option>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                        <option value="SPAM">Spam</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Priority</label>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-secondary text-foreground">{ticket.priority}</Badge>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</label>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Tag size={14} className="text-muted-foreground" />
                        {ticket.category}
                      </div>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
