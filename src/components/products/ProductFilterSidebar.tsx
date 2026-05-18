import React, { useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterSection = ({ title, isOpen, onToggle, children }: FilterSectionProps) => {
  return (
    <div className="border-b border-border/50 py-4">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between group py-3"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">{title}</span>
        {isOpen ? (
          <ChevronUp size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
        ) : (
          <ChevronDown size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </button>
      {isOpen && (
        <div className="pt-4 pb-2 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};

interface ProductFilterSidebarProps {
  className?: string;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onReset: () => void;
}

export function ProductFilterSidebar({ 
  className, 
  selectedCategory, 
  onCategoryChange, 
  selectedStatus, 
  onStatusChange, 
  onReset 
}: ProductFilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Category": true,
    "Status": true,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
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
    fetchCategories();
  }, []);

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className={cn("w-full bg-white flex flex-col p-6 space-y-6", className)}>
      <div className="w-full flex justify-center pb-2">
        <Button 
          variant="outline" 
          onClick={onReset}
          className="w-full h-12 rounded-full border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-all"
        >
          Reset Filters
        </Button>
      </div>

      <div className="flex flex-col">
        <FilterSection title="Category" isOpen={openSections["Category"]} onToggle={() => toggleSection("Category")}>
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-2"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
            ) : (
              categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-3">
                  <Checkbox 
                    id={`cat-${cat.id}`} 
                    checked={selectedCategory === cat.id || selectedCategory === cat.name}
                    onCheckedChange={() => onCategoryChange(cat.id)}
                  />
                  <label htmlFor={`cat-${cat.id}`} className="text-sm font-black uppercase italic leading-none cursor-pointer">{cat.name}</label>
                </div>
              ))
            )}
          </div>
        </FilterSection>

        <FilterSection title="Lifecycle Status" isOpen={openSections["Status"]} onToggle={() => toggleSection("Status")}>
          <div className="space-y-3">
            {["active", "draft", "archived"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <Checkbox 
                  id={`status-${item}`} 
                  checked={selectedStatus === item}
                  onCheckedChange={() => onStatusChange(item)}
                />
                <label htmlFor={`status-${item}`} className="text-sm font-medium leading-none cursor-pointer uppercase">{item}</label>
              </div>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}
