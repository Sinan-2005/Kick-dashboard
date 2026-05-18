import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Download,
  Layers,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";
import { CategoryModal } from "@/components/categories/CategoryModal";

export function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success("Category deleted");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              <Layers size={12} fill="currentColor" />
              Taxonomy Management
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              Asset <span className="text-primary">Categories</span>
            </h2>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest pt-2">
              Organize your product nodes into logical sectors
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-black hover:bg-primary/90 font-black uppercase italic tracking-tighter h-11 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">
              <Plus className="mr-2 h-4 w-4" strokeWidth={3} /> Add Category
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
           <div className="flex-1 w-full relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
              <Input 
                placeholder="Search categories..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-card border-border/50 h-14 rounded-2xl focus:border-primary/50 text-base font-medium uppercase tracking-tight italic"
              />
           </div>
        </div>

        <Card className="glass-premium border-border/30 overflow-hidden shadow-none">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/20 h-16">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="w-[80px] pl-6 text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Visual</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Name</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Slug</TableHead>
                  <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic text-right pr-6">Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i} className="animate-pulse border-border/10">
                      <TableCell className="pl-6"><div className="w-10 h-10 bg-secondary/50 rounded-lg" /></TableCell>
                      <TableCell><div className="h-4 w-32 bg-secondary/50 rounded" /></TableCell>
                      <TableCell><div className="h-4 w-24 bg-secondary/50 rounded" /></TableCell>
                      <TableCell className="text-right pr-6"><div className="w-8 h-8 bg-secondary/50 rounded-lg ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredCategories.map((cat, i) => (
                  <motion.tr 
                    key={cat.id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.05 }}
                    className="group border-border/10 hover:bg-secondary/10 transition-colors"
                  >
                    <TableCell className="pl-6">
                       <div className="w-10 h-10 rounded-lg border border-border/50 overflow-hidden bg-secondary/30 flex items-center justify-center">
                          {cat.image ? (
                             <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                          ) : (
                             <ImageIcon size={16} className="text-muted-foreground" />
                          )}
                       </div>
                    </TableCell>
                    <TableCell className="font-black text-foreground uppercase italic tracking-tighter">{cat.name}</TableCell>
                    <TableCell className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">{cat.slug}</TableCell>
                    <TableCell className="text-right pr-6">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-10 w-10 rounded-xl hover:bg-secondary transition-all"><MoreVertical size={18} /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border p-2 min-w-[160px]">
                             <DropdownMenuItem onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }} className="focus:bg-secondary cursor-pointer rounded-lg font-black uppercase italic text-xs tracking-tighter px-3 py-2.5"><Edit className="mr-2 h-4 w-4" /> Configure</DropdownMenuItem>
                             <DropdownMenuSeparator className="bg-border/50" />
                             <DropdownMenuItem onClick={() => handleDelete(cat.id)} className="focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg font-black uppercase italic text-xs tracking-tighter px-3 py-2.5 text-red-500"><Trash2 className="mr-2 h-4 w-4" /> Terminate</DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingCategory(null); }}
        onSuccess={fetchCategories}
        category={editingCategory}
      />
    </AdminLayout>
  );
}
