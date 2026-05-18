import React, { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Grid, Loader2, Check } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  selectedUrls?: string[];
}

export function MediaPicker({ isOpen, onClose, onSelect, selectedUrls = [] }: MediaPickerProps) {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAssets = async () => {
    try {
      const res = await api.get("/media");
      setAssets(res.data);
    } catch (error) {
      console.error("Failed to fetch media", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchAssets();
  }, [isOpen]);

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col bg-card border-border/50 p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-border/50">
          <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">Select from <span className="text-primary">Vault</span></DialogTitle>
          <div className="relative mt-4">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
             <input 
               type="text" 
               placeholder="Search assets..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-secondary/20 border border-border/50 rounded-xl pl-10 pr-4 h-11 text-xs font-bold uppercase tracking-widest focus:outline-none"
             />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : filteredAssets.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredAssets.map((asset) => (
                <div 
                  key={asset.id} 
                  onClick={() => {
                    onSelect(asset.url);
                    onClose();
                  }}
                  className={cn(
                    "group relative aspect-square rounded-xl border border-border/50 overflow-hidden cursor-pointer hover:border-primary/50 transition-all",
                    selectedUrls.includes(asset.url) && "border-primary ring-2 ring-primary/20"
                  )}
                >
                   <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                   {selectedUrls.includes(asset.url) && (
                     <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-black rounded-full p-1"><Check size={16} strokeWidth={3} /></div>
                     </div>
                   )}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-[8px] font-black text-white uppercase italic tracking-widest px-2 text-center truncate">{asset.name}</p>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 space-y-2 opacity-50">
               <Grid size={48} />
               <p className="text-[10px] font-black uppercase tracking-widest italic">Vault Empty</p>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-border/50 flex justify-end">
           <Button variant="outline" onClick={onClose} className="rounded-xl font-black uppercase italic text-xs">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
