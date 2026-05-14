import React from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Star, MessageSquare } from "lucide-react";

export function ReviewsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
            <Star size={12} fill="currentColor" />
            Social Proof
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
            Market <span className="text-primary">Feedback</span>
          </h2>
        </div>
        <div className="h-96 border border-dashed border-border/50 rounded-[2rem] flex flex-col items-center justify-center space-y-4 bg-secondary/10">
           <MessageSquare size={48} className="text-muted-foreground opacity-20" />
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">Decrypting Consumer Signals...</p>
        </div>
      </div>
    </AdminLayout>
  );
}
