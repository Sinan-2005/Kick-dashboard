import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";
import { Layers, Save, Image as ImageIcon, Database, Loader2 } from "lucide-react";
import { MediaPicker } from "@/components/media/MediaPicker";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: any;
}

export function CategoryModal({ isOpen, onClose, onSuccess, category }: CategoryModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: ""
  });

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          name: category.name || "",
          slug: category.slug || "",
          image: category.image || ""
        });
      } else {
        setFormData({ name: "", slug: "", image: "" });
      }
    }
  }, [isOpen, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (category) {
        await api.patch(`/categories/${category.id}`, formData);
        toast.success("Category protocol updated.");
      } else {
        await api.post("/categories", formData);
        toast.success("New category sector deployed.");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2">
            <Layers className="text-primary" />
            {category ? "Configure Sector" : "Initialize Sector"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Sector Designation</Label>
              <Input 
                placeholder="e.g. Performance Sneakers" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                required
                className="bg-secondary/20 border-border/50 h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Network Slug</Label>
              <Input 
                placeholder="performance-sneakers" 
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                required
                className="bg-secondary/20 border-border/50 h-12 rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Visual Asset</Label>
              <div className="flex gap-4">
                 <div className="w-24 h-24 rounded-2xl border border-border/50 bg-secondary/20 overflow-hidden flex items-center justify-center">
                    {formData.image ? (
                       <img src={formData.image} className="w-full h-full object-cover" />
                    ) : (
                       <ImageIcon className="text-muted-foreground opacity-20" size={32} />
                    )}
                 </div>
                 <div className="flex-1 space-y-2">
                    <Button 
                      type="button" 
                      onClick={() => setIsPickerOpen(true)}
                      className="w-full bg-secondary/30 text-foreground hover:bg-secondary/50 h-11 rounded-xl font-black uppercase italic text-xs border border-border/50"
                    >
                       <Database className="mr-2 h-4 w-4 text-primary" /> Select from Vault
                    </Button>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">
                       Choose a high-resolution render from the Media Vault to represent this sector.
                    </p>
                 </div>
              </div>
            </div>
          </div>

          <MediaPicker 
            isOpen={isPickerOpen}
            onClose={() => setIsPickerOpen(false)}
            selectedUrls={formData.image ? [formData.image] : []}
            onSelect={(url) => setFormData(prev => ({ ...prev, image: url }))}
          />

          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={onClose} className="border-border/50 font-black uppercase italic h-12 rounded-xl">Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-primary text-black hover:bg-primary/90 font-black uppercase italic h-12 px-8 rounded-xl shadow-neon">
              {isLoading ? <Loader2 className="animate-spin" /> : "Deploy Sector"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
