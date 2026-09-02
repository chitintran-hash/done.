"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm mb-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>DONE. Study Setup</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          {t('home.hero.title')}
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t('home.hero.subtitle')}
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => router.push('/build')}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-medium text-lg hover:bg-foreground/90 transition-all w-full sm:w-auto"
          >
            {t('home.hero.start')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => router.push('/shop')}
            className="flex items-center justify-center px-8 py-4 bg-muted text-foreground rounded-full font-medium text-lg hover:bg-border transition-all w-full sm:w-auto"
          >
            Mua lẻ sản phẩm
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="pt-16 w-full max-w-5xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 aspect-video">
            <img 
              src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1600&q=80" 
              alt="DONE. Workspace Setup" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
