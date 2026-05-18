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
import { Textarea } from "@/components/ui/textarea";
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
import { Package, Save, X, UploadCloud, ImagePlus, Trash2, Loader2, Database } from "lucide-react";
import { MediaPicker } from "@/components/media/MediaPicker";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any;
}

export function ProductModal({ isOpen, onClose, onSuccess, product }: ProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    brand: "",
    categoryId: "",
    price: 0,
    stock: 0,
    featured: false,
    trending: false,
    status: "active",
    images: [] as string[]
  });
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (product) {
        setFormData({
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          brand: product.brand || "",
          categoryId: product.categoryId || "",
          price: product.price || 0,
          stock: product.stock || 0,
          featured: !!product.featured,
          trending: !!product.trending,
          status: product.status || "active",
          images: product.images?.map((img: any) => img.imageUrl) || []
        });
      } else {
        setFormData({
          name: "",
          slug: "",
          description: "",
          brand: "",
          categoryId: "",
          price: 0,
          stock: 0,
          featured: false,
          trending: false,
          status: "active",
          images: []
        });
      }
    }
  }, [isOpen, product]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "products");
        const res = await api.post("/upload/file", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data.url;
      });

      const urls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
      toast.success("Images uploaded successfully");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload images");
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (product) {
        await api.patch(`/products/${product.id}`, formData);
        toast.success("Asset configuration updated successfully.");
      } else {
        await api.post("/products", formData);
        toast.success("New asset deployed to catalog.");
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
      <DialogContent className="sm:max-w-[600px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2">
            <Package className="text-primary" />
            {product ? "Configure Asset" : "Deploy New Asset"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[60vh] overflow-y-auto pr-4 -mr-4 py-4 space-y-6 scrollbar-premium">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">01. Product Identity</Label>
              <Input 
                placeholder="Model Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                required
                className="bg-secondary/20 border-border/50 h-12 rounded-xl focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">02. Routing Slug</Label>
              <Input 
                placeholder="nike-air-max-270" 
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                required
                className="bg-secondary/20 border-border/50 h-12 rounded-xl focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">03. Description Node</Label>
            <Textarea 
              placeholder="Detailed asset specifications..." 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              className="bg-secondary/20 border-border/50 min-h-[100px] rounded-2xl p-4 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">04. Brand Network</Label>
              <Input 
                placeholder="Brand Name" 
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                required
                className="bg-secondary/20 border-border/50 h-12 rounded-xl focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">05. Classification</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(v) => setFormData({...formData, categoryId: v})}
              >
                <SelectTrigger className="bg-secondary/20 border-border/50 h-12 rounded-xl">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50">
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id} className="font-black uppercase italic text-xs">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">06. Financial Point ($)</Label>
              <Input 
                type="number"
                placeholder="0.00" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                required
                className="bg-secondary/20 border-border/50 h-12 rounded-xl focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">07. Inventory Units</Label>
              <Input 
                type="number"
                placeholder="100" 
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                required
                className="bg-secondary/20 border-border/50 h-12 rounded-xl focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">08. Asset Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(v) => setFormData({...formData, status: v})}
            >
              <SelectTrigger className="bg-secondary/20 border-border/50 h-12 rounded-xl">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                <SelectItem value="active" className="font-black uppercase italic text-xs">Active</SelectItem>
                <SelectItem value="draft" className="font-black uppercase italic text-xs">Draft</SelectItem>
                <SelectItem value="archived" className="font-black uppercase italic text-xs">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">09. Visual Assets (Photos)</Label>
            <div className="grid grid-cols-4 gap-4">
              {formData.images.map((url, index) => (
                <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-border/50 bg-secondary/10 hover:border-primary/50 transition-all">
                  <img src={url} alt={`Product ${index}`} className="w-full h-full object-contain p-2" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 bg-destructive text-destructive-foreground rounded-full hover:scale-110 transition-transform"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-border/50 bg-secondary/5 hover:bg-secondary/10 hover:border-primary/50 transition-all cursor-pointer group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-2">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center mb-2 group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                        <UploadCloud className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Add Asset</p>
                    </>
                  )}
                </div>
                <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" disabled={isLoading} />
              </label>
              
              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-border/50 bg-secondary/5 hover:bg-secondary/10 hover:border-primary/50 transition-all cursor-pointer group"
              >
                 <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center mb-2 group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                    <Database className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                 </div>
                 <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-2 text-center leading-none">Select from Vault</p>
              </button>
            </div>
          </div>

          <MediaPicker 
            isOpen={isPickerOpen}
            onClose={() => setIsPickerOpen(false)}
            selectedUrls={formData.images}
            onSelect={(url) => setFormData(prev => ({ ...prev, images: [...prev.images, url] }))}
          />

          <div className="flex items-center gap-12 pt-4 border-t border-border/30">
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="featured" 
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({...formData, featured: !!checked})}
                className="w-5 h-5 border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="featured" className="text-xs font-black uppercase italic cursor-pointer select-none">Featured Asset</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="trending" 
                checked={formData.trending}
                onCheckedChange={(checked) => setFormData({...formData, trending: !!checked})}
                className="w-5 h-5 border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="trending" className="text-xs font-black uppercase italic cursor-pointer select-none">Trending Protocol</Label>
            </div>
          </div>

          </div>

          <DialogFooter className="pt-6 border-t border-border/30">
            <Button type="button" variant="outline" onClick={onClose} className="border-border/50 font-black uppercase italic h-12 px-8 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary text-black hover:bg-primary/90 font-black uppercase italic h-12 px-10 rounded-xl shadow-neon">
              {isLoading ? "Processing..." : product ? "Update Asset" : "Deploy Asset"}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
