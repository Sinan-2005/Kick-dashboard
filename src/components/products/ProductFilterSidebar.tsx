import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
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
        className="w-full flex items-center justify-between group py-2"
      >
        <span className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">{title}</span>
        {isOpen ? (
          <ChevronUp size={20} className="text-foreground" />
        ) : (
          <ChevronDown size={20} className="text-foreground" />
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

export function ProductFilterSidebar({ className }: { className?: string }) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Gender": true,
    "Size": false,
    "Shop By Price": false,
    "Brand": false,
    "Discount": false,
    "Product Label": false,
  });

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
          className="w-full h-12 rounded-full border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-all"
        >
          Reset
        </Button>
      </div>

      <div className="flex flex-col">
        <FilterSection title="Gender" isOpen={openSections["Gender"]} onToggle={() => toggleSection("Gender")}>
          <div className="space-y-3">
            {["Men", "Women", "Unisex"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <Checkbox id={`gender-${item}`} />
                <label htmlFor={`gender-${item}`} className="text-sm font-medium leading-none cursor-pointer">{item}</label>
              </div>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Size" isOpen={openSections["Size"]} onToggle={() => toggleSection("Size")}>
          <div className="grid grid-cols-3 gap-2">
            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
              <button key={size} className="h-10 border border-border/50 rounded-lg text-xs font-bold hover:border-primary hover:bg-primary/5 transition-all uppercase tracking-widest">{size}</button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Shop By Price" isOpen={openSections["Shop By Price"]} onToggle={() => toggleSection("Shop By Price")}>
          <div className="space-y-3">
             {["Under $50", "$50 - $100", "$100 - $150", "Over $150"].map((range) => (
              <div key={range} className="flex items-center gap-3">
                <Checkbox id={`price-${range}`} />
                <label htmlFor={`price-${range}`} className="text-sm font-medium leading-none cursor-pointer">{range}</label>
              </div>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}
