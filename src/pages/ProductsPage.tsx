import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Download,
  Package,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProductFilterSidebar } from "@/components/products/ProductFilterSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api";

export function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProductsAndStats = async () => {
    setIsLoading(true);
    try {
      const [productsRes, statsRes] = await Promise.all([
        api.get("/products", {
          params: {
            search: searchTerm,
            status: selectedFilter !== "all" ? selectedFilter : undefined,
          }
        }),
        api.get("/analytics/dashboard")
      ]);

      const productData = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.data || []);
      const mapped = productData.map((p: any) => ({
        ...p,
        image: p.images?.[0]?.imageUrl || "https://via.placeholder.com/150",
        category: p.category?.name || "General",
      }));
      
      setProducts(mapped);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error("Fetch Failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to terminate this asset?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Deletion failed", error);
    }
  };

  React.useEffect(() => {
    fetchProductsAndStats();
  }, [searchTerm, selectedFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const healthStats = [
    { label: "Total Assets", value: stats?.totalProducts || 0, icon: Package, color: "text-foreground" },
    { label: "Active Live", value: stats?.activeProducts || 0, icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Out of Stock", value: stats?.outOfStockCount || 0, icon: XCircle, color: "text-red-500" },
    { label: "Low Inventory", value: stats?.lowStockCount || 0, icon: TrendingUp, color: "text-amber-500" }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              <Package size={12} fill="currentColor" />
              Catalog Management
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              Store <span className="text-primary">Inventory</span>
            </h2>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest pt-2">
              Optimize and monitor your product performance
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex bg-secondary/30 p-1 rounded-xl border border-border/50">
                <Button variant="ghost" size="icon" onClick={() => setViewMode("table")} className={cn("rounded-lg h-9 w-9", viewMode === "table" ? "bg-primary text-black" : "text-muted-foreground")}><List size={18} /></Button>
                <Button variant="ghost" size="icon" onClick={() => setViewMode("grid")} className={cn("rounded-lg h-9 w-9", viewMode === "grid" ? "bg-primary text-black" : "text-muted-foreground")}><LayoutGrid size={18} /></Button>
             </div>
            <Button variant="outline" className="border-border/50 bg-card/50 text-foreground hover:bg-secondary h-11 rounded-xl font-black uppercase italic tracking-tighter text-xs">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Link to="/products">
              <Button className="bg-primary text-black hover:bg-primary/90 font-black uppercase italic tracking-tighter h-11 px-6 rounded-xl">
                <Plus className="mr-2 h-4 w-4" strokeWidth={3} /> Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Catalog Health Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {healthStats.map((stat, i) => (
             <Card key={i} className="glass-premium border-border/30 overflow-hidden group">
                <CardContent className="p-4 flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                      <p className="text-xl font-black text-foreground italic">{stat.value}</p>
                   </div>
                   <div className={cn("w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:scale-110 transition-transform", stat.color)}>
                      <stat.icon size={18} />
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
           <div className="flex-1 w-full relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
              <Input 
                placeholder="Find products, SKUs, or collections..." 
                className="pl-12 bg-card border-border/50 h-14 rounded-2xl focus:border-primary/50 text-base font-medium uppercase tracking-tight italic"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-3">
              <div className="lg:hidden">
                 <Sheet>
                    <SheetTrigger asChild>
                       <Button variant="outline" className="h-14 px-6 border-border/50 bg-card text-foreground rounded-2xl font-black uppercase italic tracking-widest text-xs">
                          <Filter size={18} className="mr-2 text-primary" /> Filteration
                       </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="p-0 w-[300px]">
                       <div className="p-6 border-b border-border/50 flex items-center justify-between">
                          <h2 className="text-xl font-black uppercase italic tracking-tighter">Filter <span className="text-primary">Ops</span></h2>
                       </div>
                       <ProductFilterSidebar />
                    </SheetContent>
                 </Sheet>
              </div>

              <div className="hidden lg:block">
                 <Button variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={cn("h-14 px-6 border-border/50 bg-card text-foreground rounded-2xl font-black uppercase italic tracking-widest text-xs transition-all", isSidebarOpen && "border-primary text-primary")}>
                    <Filter size={18} className="mr-2" />
                    {isSidebarOpen ? "Hide Filters" : "Show Filters"}
                 </Button>
              </div>

              <Link to="/products">
                 <Button className="bg-primary text-black hover:bg-primary/90 font-black uppercase italic tracking-tighter h-14 px-8 rounded-2xl">
                    <Plus className="mr-2 h-5 w-5" strokeWidth={3} /> Add New
                 </Button>
              </Link>
           </div>
        </div>

        <div className="flex gap-8 items-start">
           <AnimatePresence>
              {isSidebarOpen && (
                 <motion.div initial={{ opacity: 0, x: -20, width: 0 }} animate={{ opacity: 1, x: 0, width: 320 }} exit={{ opacity: 0, x: -20, width: 0 }} className="hidden lg:block sticky top-28">
                    <Card className="overflow-hidden border-border/30 bg-white shadow-none"><ProductFilterSidebar /></Card>
                 </motion.div>
              )}
           </AnimatePresence>

           <div className="flex-1 overflow-hidden">
              <Card className="glass-premium border-border/30 overflow-hidden shadow-none">
                 <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-secondary/20 sticky top-0 z-10">
                      <TableRow className="hover:bg-transparent border-border/50 h-16">
                        <TableHead className="w-[50px] pl-6"><Checkbox checked={selectedIds.length === products.length && products.length > 0} onCheckedChange={toggleSelectAll} /></TableHead>
                        <TableHead className="w-[80px] text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Asset</TableHead>
                        <TableHead className="min-w-[200px] text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Identity</TableHead>
                        <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Financials</TableHead>
                        <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Inventory</TableHead>
                        <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic text-center">Performance</TableHead>
                        <TableHead className="text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Status</TableHead>
                        <TableHead className="text-right pr-6 text-foreground/90 font-black uppercase text-[10px] tracking-widest italic">Control</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product, i) => (
                        <motion.tr key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={cn("group border-border/30 hover:bg-secondary/10 transition-colors", selectedIds.includes(product.id) && "bg-primary/[0.03] hover:bg-primary/[0.05]")}>
                          <TableCell className="pl-6"><Checkbox checked={selectedIds.includes(product.id)} onCheckedChange={() => toggleSelect(product.id)} /></TableCell>
                          <TableCell><div className="w-14 h-14 rounded-xl border border-border/50 overflow-hidden bg-secondary/30 flex items-center justify-center p-1 group-hover:scale-105 transition-transform"><img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" /></div></TableCell>
                          <TableCell><div className="flex flex-col gap-0.5"><div className="flex items-center gap-2"><span className="font-black text-foreground uppercase italic tracking-tighter text-sm">{product.name}</span>{product.isFeatured && <Star size={10} className="text-primary fill-primary" />}</div><div className="flex items-center gap-2"><span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">KCK-{product.id.substring(0, 8)}</span><span className="w-1 h-1 rounded-full bg-border" /><span className="text-[9px] font-black text-primary uppercase tracking-widest">{product.category}</span></div></div></TableCell>
                          <TableCell><div className="flex flex-col"><span className="font-black text-foreground text-sm tracking-tighter">${product.price.toFixed(2)}</span></div></TableCell>
                          <TableCell><div className="space-y-2 w-32"><div className="flex justify-between items-end"><span className={cn("text-[10px] font-black uppercase italic", product.stock === 0 ? "text-red-500" : product.stock < 20 ? "text-amber-500" : "text-emerald-500")}>{product.stock} Units</span></div><div className="h-1 w-full bg-secondary rounded-full overflow-hidden"><div className={cn("h-full rounded-full", product.stock === 0 ? "bg-red-500" : product.stock < 20 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }} /></div></div></TableCell>
                          <TableCell><div className="flex items-center justify-center gap-6"><div className="text-center"><p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-0.5">Views</p><p className="text-xs font-black text-foreground italic">{product.views || '0'}</p></div><div className="text-center"><p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-0.5">Sales</p><p className="text-xs font-black text-foreground italic">{product.sales || '0'}</p></div></div></TableCell>
                          <TableCell><Badge variant="outline" className={cn("rounded-sm border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5", product.stock === 0 ? "bg-red-500 text-red-950" : product.stock < 10 ? "bg-amber-500 text-amber-950" : "bg-emerald-500 text-emerald-950")}>{product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? 'Low Stock' : 'Active'}</Badge></TableCell>
                          <TableCell className="text-right pr-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-10 w-10 rounded-xl hover:bg-secondary transition-all"><MoreVertical size={18} /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-card border-border p-2 min-w-[160px]">
                                <DropdownMenuItem className="focus:bg-primary focus:text-black cursor-pointer rounded-lg font-black uppercase italic text-xs tracking-tighter px-3 py-2.5"><Eye className="mr-2 h-4 w-4" /> Analyze</DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-secondary cursor-pointer rounded-lg font-black uppercase italic text-xs tracking-tighter px-3 py-2.5"><Edit className="mr-2 h-4 w-4" /> Configure</DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-border/50" />
                                <DropdownMenuItem onClick={() => handleDelete(product.id)} className="focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg font-black uppercase italic text-xs tracking-tighter px-3 py-2.5 text-red-500"><Trash2 className="mr-2 h-4 w-4" /> Terminate</DropdownMenuItem>
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
        </div>
      </div>
    </AdminLayout>
  );
}
