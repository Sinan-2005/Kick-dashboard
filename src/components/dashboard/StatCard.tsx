import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedCounter from "@/components/ui/animated-counter";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend: number;
  trendType: "up" | "down";
  description: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
  chartData?: { value: number }[];
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendType, 
  description,
  prefix = "",
  suffix = "",
  delay = 0,
  chartData = Array.from({ length: 10 }, () => ({ value: Math.floor(Math.random() * 100) }))
}: StatCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="glass-premium border-border/30 hover:border-primary/50 transition-all duration-500 group overflow-hidden relative hover-glow">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{title}</p>
              <h3 className="text-3xl font-black tracking-tighter text-foreground italic">
                <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-secondary/30 flex items-center justify-center border border-border/50 group-hover:bg-primary group-hover:border-primary group-hover:scale-110 transition-all duration-500">
              <Icon size={24} className="text-muted-foreground group-hover:text-primary-foreground transition-colors" />
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div className="space-y-3">
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter",
                trendType === "up" ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
              )}>
                {trendType === "up" ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
                {trend}%
              </div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{description}</p>
            </div>
            
            <div className="h-12 w-24 min-h-[48px] min-w-[96px] opacity-50 group-hover:opacity-100 transition-opacity duration-500 relative">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={trendType === "up" ? "hsl(var(--primary))" : "#ef4444"} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={trendType === "up" ? "hsl(var(--primary))" : "#ef4444"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={trendType === "up" ? "hsl(var(--primary))" : "#ef4444"} 
                      strokeWidth={2} 
                      fill={`url(#gradient-${title})`}
                      isAnimationActive={true}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-secondary/20 animate-pulse rounded-lg" />
              )}
            </div>
          </div>
        </CardContent>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
           <motion.div 
             initial={{ x: "-100%" }}
             animate={{ x: "100%" }}
             transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             className="w-full h-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"
           />
        </div>
      </Card>
    </motion.div>
  );
}
