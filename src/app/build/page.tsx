"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGoalStore } from '@/store/useGoalStore';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ArrowRight, Check, ChevronLeft, Laptop, Monitor, Mouse, Keyboard, Armchair } from 'lucide-react';

export default function GoalBuilderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const store = useGoalStore();
  const { t } = useLanguage();

  const steps = [
    { id: 'goal', title: t('builder.step.goal') },
    { id: 'budget', title: t('builder.step.budget') },
    { id: 'space', title: t('builder.step.space') },
    { id: 'style', title: t('builder.step.style') },
    { id: 'owned', title: t('builder.step.owned') },
    { id: 'deadline', title: t('builder.step.deadline') },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      router.push('/solutions/loading');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
    else router.push('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header / Progress bar */}
      <header className="flex items-center p-6 border-b border-border">
        <button onClick={handleBack} className="p-2 hover:bg-muted rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 mx-8 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-muted-foreground w-12 text-right">
          {currentStep + 1} / {steps.length}
        </span>
      </header>

      {/* Main Form Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                {steps[currentStep].title}
              </h2>

              {currentStep === 0 && (
                <div className="grid grid-cols-1 gap-4">
                  {['Study Setup', 'Work From Home', 'Gaming Station', 'Creator Studio'].map(g => (
                    <button
                      key={g}
                      onClick={() => { store.setGoal(g); handleNext(); }}
                      className={`p-6 rounded-2xl border-2 text-left text-lg font-medium transition-all ${
                        store.goal === g ? 'border-accent bg-accent/5' : 'border-border hover:border-foreground/20'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center text-4xl font-bold text-accent">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(store.budget)}
                  </div>
                  <input 
                    type="range" 
                    min={1000000} max={20000000} step={500000}
                    value={store.budget}
                    onChange={(e) => store.setBudget(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1 Tr</span>
                    <span>20 Tr</span>
                  </div>
                  <button onClick={handleNext} className="w-full py-4 bg-foreground text-background rounded-full font-medium mt-8 hover:bg-foreground/90 transition-all">
                    Tiếp tục
                  </button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center text-4xl font-bold text-foreground">
                    Tối đa <span className="text-accent">{store.maxWidth} cm</span>
                  </div>
                  <input 
                    type="range" 
                    min={80} max={200} step={10}
                    value={store.maxWidth}
                    onChange={(e) => store.setMaxWidth(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>80 cm</span>
                    <span>200 cm</span>
                  </div>
                  <button onClick={handleNext} className="w-full py-4 bg-foreground text-background rounded-full font-medium mt-8 hover:bg-foreground/90 transition-all">
                    {t('builder.btn.continue')}
                  </button>
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'minimal', label: 'Minimal (Tối giản)' },
                    { id: 'productivity', label: 'Productivity (Hiệu suất)' },
                    { id: 'ergonomic', label: 'Ergonomic (Công thái học)' },
                    { id: 'gaming', label: 'Gaming (Hầm hố)' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => { store.setStyle(s.id as any); handleNext(); }}
                      className={`p-6 rounded-2xl border-2 text-center font-medium transition-all flex flex-col items-center justify-center gap-2 ${
                        store.style === s.id ? 'border-accent bg-accent/5' : 'border-border hover:border-foreground/20'
                      }`}
                    >
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <p className="text-center text-muted-foreground">DONE. sẽ tính toán để không mua trùng những thứ bạn đã có.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { id: 'laptop', icon: Laptop, label: 'Laptop' },
                      { id: 'monitor', icon: Monitor, label: 'Màn hình' },
                      { id: 'keyboard', icon: Keyboard, label: 'Bàn phím' },
                      { id: 'mouse', icon: Mouse, label: 'Chuột' },
                      { id: 'chair', icon: Armchair, label: 'Ghế' }
                    ].map(item => {
                      const Icon = item.icon;
                      const isSelected = store.ownedItems.includes(item.id as any);
                      return (
                        <button
                          key={item.id}
                          onClick={() => store.toggleOwnedItem(item.id as any)}
                          className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-3 relative ${
                            isSelected ? 'border-accent bg-accent/5' : 'border-border hover:border-foreground/20'
                          }`}
                        >
                          <Icon className={`w-8 h-8 ${isSelected ? 'text-accent' : 'text-muted-foreground'}`} />
                          <span className="text-sm font-medium">{item.label}</span>
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-accent text-white rounded-full p-0.5">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={handleNext} className="w-full py-4 bg-foreground text-background rounded-full font-medium mt-8 hover:bg-foreground/90 transition-all">
                    {t('builder.btn.continue')}
                  </button>
                </div>
              )}

              {steps[currentStep].id === 'deadline' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-5xl font-black text-accent">{store.deadlineDays} <span className="text-2xl text-foreground">ngày</span></span>
                    <input 
                      type="range" 
                      min="1" 
                      max="30" 
                      step="1"
                      value={store.deadlineDays}
                      onChange={(e) => store.setDeadlineDays(Number(e.target.value))}
                      className="w-full max-w-sm h-3 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
                    />
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Hệ thống sẽ loại bỏ các sản phẩm không thể giao hàng kịp thời hạn.
                  </p>
                  <button onClick={handleNext} className="w-full py-4 bg-accent text-white rounded-full font-bold text-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2">
                    {t('builder.btn.finish')}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
