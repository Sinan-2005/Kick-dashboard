import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { Logo } from "@/components/ui/Logo";
import api from "@/lib/api";
import { toast } from "sonner";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, accessToken } = response.data;
      
      if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
        throw new Error("Access Denied: Administrative privileges required.");
      }

      login(user, accessToken);
      localStorage.setItem("kick_admin_token", accessToken);
      toast.success("Authentication Successful", {
        description: `Welcome back, ${user.name || 'Agent'}. Terminal access granted.`
      });
      navigate("/dashboard");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Authentication failed";
      toast.error("Access Denied", {
        description: message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-premium relative overflow-hidden p-6">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64"
      />
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -ml-64 -mb-64"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mb-6"
          >
            <Logo size="xl" />
          </motion.div>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
              Terminal Access
            </h1>
            <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">
              Identify yourself to enter the matrix
            </p>
          </div>
        </div>

        <Card className="glass-premium border-white/5 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1 pb-6 text-center">
              <CardTitle className="text-2xl font-black italic uppercase tracking-tight text-white">Login</CardTitle>
              <CardDescription className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">Secure Authentication Protocol</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Identity Mail</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
                  <Input 
                    type="email" 
                    placeholder="admin@kick.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 bg-black/40 border-white/5 focus:border-primary/50 focus:ring-primary/20 text-white rounded-xl transition-all"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Access Key</label>
                  <button type="button" className="text-[9px] font-bold text-primary hover:underline uppercase tracking-widest">Forgotten?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 bg-black/40 border-white/5 focus:border-primary/50 focus:ring-primary/20 text-white rounded-xl transition-all"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-8">
              <Button 
                type="submit" 
                className="w-full bg-primary text-black hover:bg-primary/90 font-black italic uppercase tracking-widest h-12 rounded-xl group overflow-hidden relative"
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Execute Authentication
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} strokeWidth={3} />
                    </>
                  )}
                </span>
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
          Unauthorized Access is Strictly <span className="text-red-900">Prohibited</span>
        </p>
      </motion.div>
    </div>
  );
}
