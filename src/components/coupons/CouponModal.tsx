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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api";
import { toast } from "sonner";
import { Ticket, Save, X } from "lucide-react";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  coupon?: any;
}

export function CouponModal({ isOpen, onClose, onSuccess, coupon }: CouponModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount: 0,
    type: "PERCENTAGE",
    minPurchase: 0,
    expiresAt: "",
    isActive: true
  });

  useEffect(() => {
    if (isOpen) {
      if (coupon) {
        setFormData({
          code: coupon.code || "",
          discount: coupon.discount || 0,
          type: coupon.type || "PERCENTAGE",
          minPurchase: coupon.minPurchase || 0,
          expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : "",
          isActive: !!coupon.isActive
        });
      } else {
        setFormData({
          code: "",
          discount: 0,
          type: "PERCENTAGE",
          minPurchase: 0,
          expiresAt: "",
          isActive: true
        });
      }
    }
  }, [isOpen, coupon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (coupon) {
        await api.patch(`/coupons/${coupon.id}`, formData);
        toast.success("Promotion protocol updated.");
      } else {
        await api.post("/coupons", formData);
        toast.success("New promotion protocol generated.");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Save failed", error);
      toast.error(error.response?.data?.message || "Operation Protocol Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2">
            <Ticket className="text-primary" />
            {coupon ? "Configure Protocol" : "Generate Protocol"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Real-time Coupon Ticket Preview */}
          <div className="relative overflow-hidden p-5 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/[0.03] flex items-center justify-between group transition-all hover:bg-primary/[0.05] hover:border-primary/50">
            <div className="space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Incentive Code</span>
              <p className="text-xl font-black text-foreground uppercase tracking-tight italic flex items-center gap-2 leading-none">
                <Ticket className="text-primary h-5 w-5 animate-bounce" />
                {formData.code || "KICKXXXX"}
              </p>
            </div>
            <div className="text-right space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary leading-none block">reduction</span>
              <p className="text-2xl font-black text-primary uppercase italic tracking-tighter leading-none">
                {formData.type === "PERCENTAGE" ? `${formData.discount}% OFF` : `$${formData.discount} OFF`}
              </p>
            </div>
            
            {/* Ticket Cutouts */}
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-card border-r border-border/50" />
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-card border-l border-border/50" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Protocol Code</Label>
            <Input 
              placeholder="e.g. KICK20" 
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
              required
              className="bg-secondary/20 border-border/50 h-11 font-black uppercase italic"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reduction Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(v) => setFormData({...formData, type: v})}
              >
                <SelectTrigger className="bg-secondary/20 border-border/50 h-11">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50">
                  <SelectItem value="PERCENTAGE" className="font-black uppercase italic text-xs">Percentage (%)</SelectItem>
                  <SelectItem value="FIXED" className="font-black uppercase italic text-xs">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {formData.type === "PERCENTAGE" ? "Discount Percentage (%)" : "Discount Amount ($)"}
              </Label>
              <Input 
                type="number"
                placeholder="0" 
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
                required
                className="bg-secondary/20 border-border/50 h-11"
              />
              <p className="text-[9px] text-muted-foreground font-medium mt-1 leading-normal">
                {formData.type === "PERCENTAGE" 
                  ? "Enter discount percentage (Example: 10 = 10% OFF)" 
                  : "Enter discount amount (Example: 10 = $10 OFF)"}
              </p>
              <div className="text-[10px] font-black uppercase italic tracking-wider text-primary mt-2 flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-lg w-fit border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Customer gets {formData.type === "PERCENTAGE" ? `${formData.discount}%` : `$${formData.discount}`} OFF
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Min. Purchase ($)</Label>
              <Input 
                type="number"
                placeholder="0" 
                value={formData.minPurchase}
                onChange={(e) => setFormData({...formData, minPurchase: parseFloat(e.target.value)})}
                className="bg-secondary/20 border-border/50 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expiration Date</Label>
              <Input 
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                required
                className="bg-secondary/20 border-border/50 h-11"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="active" 
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({...formData, isActive: !!checked})}
            />
            <Label htmlFor="active" className="text-[11px] font-black uppercase italic cursor-pointer">Protocol Active</Label>
          </div>

          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={onClose} className="border-border/50 font-black uppercase italic h-12 px-8 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary text-black hover:bg-primary/90 font-black uppercase italic h-12 px-10 rounded-xl shadow-neon">
              {isLoading ? "Processing..." : coupon ? "Update Protocol" : "Generate Protocol"}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
