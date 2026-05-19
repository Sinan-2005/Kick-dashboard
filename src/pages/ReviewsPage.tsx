import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Star, MessageSquare, Trash2, ShieldAlert } from "lucide-react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string; avatar?: string };
  product: { name: string };
}

export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/reviews");
      setReviews(data);
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this feedback review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success("Review deleted successfully");
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={12} 
            fill={i < rating ? "currentColor" : "none"} 
            stroke="currentColor" 
            strokeWidth={2}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
            <Star size={12} fill="currentColor" />
            Social Proof
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
            Market <span className="text-primary">Feedback</span>
          </h2>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest pt-2">
            Monitor and manage product reviews and customer ratings from the storefront
          </p>
        </div>

        <Card className="glass-premium border-border/30 overflow-hidden shadow-none">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/20 sticky top-0 z-10">
                <TableRow className="hover:bg-transparent border-border/50 h-16">
                  <TableHead className="w-[150px] pl-6 text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Client</TableHead>
                  <TableHead className="w-[200px] text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Product</TableHead>
                  <TableHead className="w-[120px] text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Rating</TableHead>
                  <TableHead className="w-[350px] text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Comment</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Date</TableHead>
                  <TableHead className="text-right pr-6 text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell className="pl-6 h-16"><div className="w-24 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-32 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-16 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-64 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="w-20 h-4 bg-secondary/50 rounded" /></TableCell>
                      <TableCell className="text-right pr-6"><div className="w-8 h-8 bg-secondary/50 rounded-lg ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <MessageSquare size={48} className="text-muted-foreground opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">No Customer Feedback Found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((rev, i) => (
                    <motion.tr 
                      key={rev.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group border-border/30 hover:bg-secondary/10 transition-colors"
                    >
                      <TableCell className="pl-6 font-bold text-sm text-foreground italic tracking-tighter">
                        {rev.user?.name || "Anonymous"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-black uppercase tracking-tighter">
                        {rev.product?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {renderStars(rev.rating)}
                      </TableCell>
                      <TableCell className="text-xs text-foreground uppercase tracking-wider font-semibold">
                        {rev.comment || <span className="text-muted-foreground/30 italic">No comment provided</span>}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-muted-foreground">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(rev.id)}
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 rounded-lg transition-all"
                          title="Delete Feedback"
                        >
                          <Trash2 size={16} />
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
