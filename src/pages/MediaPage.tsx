import React from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Image as ImageIcon, Upload, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MediaPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              <ImageIcon size={12} fill="currentColor" />
              Assets Management
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              Media <span className="text-primary">Vault</span>
            </h2>
          </div>
          <Button className="bg-primary text-black font-black uppercase italic tracking-tighter h-11 px-6 rounded-xl">
            <Upload className="mr-2 h-4 w-4" /> Upload Asset
          </Button>
        </div>
        <div className="h-96 border border-dashed border-border/50 rounded-[2rem] flex flex-col items-center justify-center space-y-4 bg-secondary/10">
           <Grid size={48} className="text-muted-foreground opacity-20" />
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">Initialize Media Grid</p>
        </div>
      </div>
    </AdminLayout>
  );
}
