import React, { useEffect, useState, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Image as ImageIcon, Upload, Grid, Trash2, Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

interface MediaAsset {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
}

export function MediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = async () => {
    try {
      const res = await api.get("/media");
      setAssets(res.data);
    } catch (error) {
      toast.error("Failed to decrypt media vault");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Asset successfully synthesized");
      fetchAssets();
    } catch (error) {
      toast.error("Asset synthesis failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to purge this asset?")) return;

    try {
      await api.delete(`/media/${id}`);
      toast.success("Asset purged from vault");
      setAssets(assets.filter(a => a.id !== id));
    } catch (error) {
      toast.error("Purge operation failed");
    }
  };

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              <ImageIcon size={12} fill="currentColor" />
              Assets Management
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              Media <span className="text-primary">Vault</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search Command Matrix..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-secondary/20 border border-border/50 rounded-xl pl-10 pr-4 h-11 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all w-64"
                />
             </div>
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleUpload} 
               className="hidden" 
               accept="image/*"
             />
             <Button 
               onClick={() => fileInputRef.current?.click()}
               disabled={uploading}
               className="bg-primary text-black font-black uppercase italic tracking-tighter h-11 px-6 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
             >
               {uploading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Upload className="mr-2 h-4 w-4" />}
               Upload Asset
             </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square bg-secondary/20 rounded-3xl animate-pulse border border-border/30" />
            ))}
          </div>
        ) : filteredAssets.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="group relative aspect-square bg-secondary/10 rounded-[2rem] border border-border/30 overflow-hidden hover:border-primary/50 transition-all shadow-xl">
                 <img 
                   src={asset.url} 
                   alt={asset.name} 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button 
                      onClick={() => handleDelete(asset.id)}
                      className="p-3 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                    >
                       <Trash2 size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(asset.url);
                        toast.success("URL copied to clipboard");
                      }}
                      className="p-3 bg-primary/20 text-primary rounded-xl hover:bg-primary hover:text-black transition-all shadow-lg"
                    >
                       <ImageIcon size={18} />
                    </button>
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-[8px] font-black uppercase text-white truncate italic">{asset.name}</p>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-96 border border-dashed border-border/50 rounded-[3rem] flex flex-col items-center justify-center space-y-4 bg-secondary/5">
             <Grid size={48} className="text-muted-foreground opacity-20" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic opacity-50">Vault Empty. Deployment Required.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
