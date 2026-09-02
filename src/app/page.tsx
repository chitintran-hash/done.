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
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium text-lg hover:bg-primary/90 transition-all w-full sm:w-auto"
          >
            {t('home.hero.start')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
