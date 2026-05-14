import React from "react";
import { 
  Search, 
  Bell, 
  User, 
  Moon, 
  Sun, 
  ChevronRight,
  Command,
  Settings,
  LogOut,
  ShoppingCart,
  Star,
  AlertCircle,
  Menu
} from "lucide-react";
import { useSidebar } from "@/lib/store";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

const notifications = [
  { id: 1, type: "order", title: "New Order #9928", description: "Alex Johnson placed an order for $150.00", time: "2m ago", icon: ShoppingCart, color: "text-primary" },
  { id: 2, type: "stock", title: "Low Stock Alert", description: "Nike Dunk Low (Black/White) is at 2 units", time: "15m ago", icon: AlertCircle, color: "text-amber-500" },
  { id: 3, type: "review", title: "Review Pending", description: "New 5-star review from Liam for Nike Air", time: "1h ago", icon: Star, color: "text-primary" },
];

export function Navbar() {
  const { toggle } = useSidebar();
  const [mounted, setMounted] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [theme, setTheme] = React.useState(localStorage.getItem("theme") || "dark");

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header className={cn(
      "flex items-center sticky top-0 z-[50] w-full transition-all duration-500 ease-in-out",
      isScrolled 
        ? "h-16 px-6 bg-white/40 dark:bg-black/40 backdrop-blur-2xl backdrop-saturate-150 border-b border-border/50 shadow-sm" 
        : "h-16 md:h-24 px-4 md:px-10 bg-transparent border-b border-transparent"
    )}>
      <div className="flex-1 flex items-center gap-6">
        <div className="flex md:hidden items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggle}
            className="w-10 h-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl"
          >
            <Menu size={20} />
          </Button>
          <Logo size="sm" />
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center border border-border/50">
             <Settings size={14} className="text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <span>Terminal</span>
            <ChevronRight size={10} strokeWidth={3} className="text-primary" />
            <span className="text-foreground italic">Nodes</span>
          </div>
        </div>

        <div className="max-w-2xl w-full relative group hidden lg:block cursor-pointer">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors" size={16} />
          <div className="pl-12 pr-12 py-3 bg-secondary/30 border border-border/50 rounded-xl text-muted-foreground text-[10px] font-black uppercase tracking-widest group-hover:border-primary/50 group-hover:bg-secondary/50 transition-all duration-300 italic">
            Search Command Matrix...
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded-lg border border-border/50 bg-background text-[9px] font-black text-muted-foreground">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-11 h-11 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl border border-transparent hover:border-primary/20 transition-all"
          onClick={toggleTheme}
        >
          {mounted && (
            <>
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "w-11 h-11 relative text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl border border-transparent hover:border-primary/20 transition-all"
          )}>
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 bg-card/95 backdrop-blur-xl border-border/50 p-2 rounded-2xl">
            <div className="flex items-center justify-between px-4 py-3">
               <DropdownMenuLabel className="text-[10px] font-black text-foreground uppercase italic tracking-[0.2em] p-0">Signals</DropdownMenuLabel>
               <Badge className="bg-primary text-black font-black text-[9px] uppercase tracking-widest h-5">3 New</Badge>
            </div>
            <DropdownMenuSeparator className="bg-border/50" />
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-1 space-y-1">
              {notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="p-4 focus:bg-secondary/50 cursor-pointer rounded-xl group">
                  <div className="flex gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl bg-secondary flex items-center justify-center transition-colors",
                      n.color.replace('text', 'bg') + '/10',
                      n.color
                    )}>
                      <n.icon size={18} strokeWidth={3} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-black text-foreground uppercase italic tracking-tighter">{n.title}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{n.time}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">{n.description}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-4 pl-3 pr-2 py-1.5 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-all group outline-none">
            <div className="hidden md:block text-right space-y-0.5">
              <p className="text-[10px] font-black text-foreground uppercase italic tracking-tighter leading-none">Alex Johnson</p>
              <p className="text-[8px] font-black text-primary uppercase tracking-widest leading-none">Super Admin</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
              <User className="text-black" size={20} strokeWidth={3} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-card/95 backdrop-blur-xl border-border/50 p-2 rounded-2xl">
            <div className="px-4 py-4 flex flex-col items-center gap-3 bg-secondary/20 rounded-xl mb-2">
               <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-black italic font-black text-3xl">AJ</div>
               <div className="text-center">
                  <p className="text-sm font-black text-foreground uppercase italic tracking-tighter">Alex Johnson</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Global Terminal Access</p>
               </div>
            </div>
            <DropdownMenuItem className="focus:bg-secondary cursor-pointer rounded-xl font-black uppercase italic text-xs tracking-tighter px-4 py-3">
              <User className="mr-3 h-4 w-4" /> Identity Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-secondary cursor-pointer rounded-xl font-black uppercase italic text-xs tracking-tighter px-4 py-3">
              <Settings className="mr-3 h-4 w-4" /> Terminal Config
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem className="focus:bg-destructive/10 cursor-pointer rounded-xl font-black uppercase italic text-xs tracking-tighter px-4 py-3 text-red-500">
              <LogOut className="mr-3 h-4 w-4" /> Terminate Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
