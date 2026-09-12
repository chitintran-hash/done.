"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const steps = [
  {
    id: "recipient",
    title: "Bạn đang tìm quà cho ai?",
    options: [
      { label: "Bạn gái / Vợ", value: "ban-gai", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80" },
      { label: "Bạn trai / Chồng", value: "ban-trai", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" },
      { label: "Bạn thân", value: "ban-than", img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80" },
      { label: "Mẹ", value: "me", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
      { label: "Bố", value: "bo", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
    ]
  },
  {
    id: "occasion",
    title: "Bạn tặng vào dịp nào?",
    options: [
      { label: "Sinh nhật", value: "sinh-nhat", img: "https://images.unsplash.com/photo-1530103862676-de8892ebeea6?w=400&q=80" },
      { label: "Kỷ niệm", value: "ky-niem", img: "https://images.unsplash.com/photo-1518199268815-95a206b18cc6?w=400&q=80" },
      { label: "Valentine", value: "valentine", img: "https://images.unsplash.com/photo-1518199268815-95a206b18cc6?w=400&q=80" },
      { label: "Giáng sinh", value: "giang-sinh", img: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&q=80" },
      { label: "Tân gia", value: "tan-gia", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80" },
      { label: "Không cần dịp", value: "khong-dip", img: "https://images.unsplash.com/photo-1606787620819-8bdf0c44c293?w=400&q=80" },
    ]
  },
  {
    id: "interest",
    title: "Người ấy thích gì? (Có thể chọn nhiều)",
    multiSelect: true,
    options: [
      { label: "Công nghệ", value: "cong-nghe", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80" },
      { label: "Gaming", value: "gaming", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80" },
      { label: "Làm đẹp", value: "lam-dep", img: "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=400&q=80" },
      { label: "Du lịch", value: "du-lich", img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80" },
      { label: "Decor", value: "decor", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80" },
    ]
  },
  {
    id: "budget",
    title: "Ngân sách của bạn?",
    options: [
      { label: "Dưới 200.000đ", value: "under-200k", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80" },
      { label: "200.000đ - 500.000đ", value: "200k-500k", img: "https://images.unsplash.com/photo-1580519542036-ed47ec33028b?w=400&q=80" },
      { label: "500.000đ - 1 Triệu", value: "500k-1m", img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&q=80" },
      { label: "Trên 1 Triệu", value: "over-1m", img: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=400&q=80" },
    ]
  },
  {
    id: "style",
    title: "Bạn muốn món quà như thế nào? (Có thể chọn nhiều)",
    multiSelect: true,
    options: [
      { label: "Dễ thương", value: "de-thuong", img: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&q=80" },
      { label: "Ý nghĩa", value: "y-nghia", img: "https://images.unsplash.com/photo-1518199268815-95a206b18cc6?w=400&q=80" },
      { label: "Thiết thực", value: "thiet-thuc", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" },
      { label: "Hài hước", value: "hai-huoc", img: "https://images.unsplash.com/photo-1545696562-eb7e1b590e82?w=400&q=80" },
      { label: "Độc lạ", value: "doc-la", img: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400&q=80" },
      { label: "Sang trọng", value: "sang-trong", img: "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=400&q=80" },
    ]
  }
];

export default function GiftFinder() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});

  const handleSelect = (value: string) => {
    const step = steps[currentStep];
    
    if (step.multiSelect) {
      const currentSelections = (selections[step.id] as string[]) || [];
      if (currentSelections.includes(value)) {
        setSelections({ ...selections, [step.id]: currentSelections.filter(v => v !== value) });
      } else {
        setSelections({ ...selections, [step.id]: [...currentSelections, value] });
      }
    } else {
      setSelections({ ...selections, [step.id]: value });
      setTimeout(() => {
        handleNext();
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const queryParams = new URLSearchParams();
    Object.entries(selections).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        queryParams.append(key, value.join(','));
      } else if (typeof value === 'string' && value) {
        queryParams.append(key, value);
      }
    });
    router.push(`/products?${queryParams.toString()}`);
  };

  const step = steps[currentStep];

  return (
    <main className="min-h-screen bg-ug-cream pt-32 pb-24 font-sans flex flex-col items-center justify-center">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-2">
            {steps.map((_, idx) => (
              <div key={idx} className={`h-2 flex-1 mx-1 rounded-full ${idx <= currentStep ? 'bg-primary' : 'bg-gray-200'}`} />
            ))}
          </div>
          <p className="text-center text-muted-foreground text-sm font-medium mt-4">
            Bước {currentStep + 1} / {steps.length}
          </p>
        </div>

        {/* Question */}
        <h1 className="text-3xl lg:text-4xl font-bold text-center text-primary mb-12 tracking-tight">
          {step.title}
        </h1>

        {/* Options Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {step.options.map((option) => {
            const isSelected = step.multiSelect 
              ? (selections[step.id] as string[] || []).includes(option.value)
              : selections[step.id] === option.value;

            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`group flex flex-col items-center bg-white rounded-2xl overflow-hidden border-2 transition-all transform hover:-translate-y-1 hover:shadow-lg ${isSelected ? 'border-primary shadow-md' : 'border-transparent shadow-sm'}`}
              >
                <div className="w-full aspect-square relative bg-gray-100">
                  <Image src={option.img} alt={option.label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                        ✓
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 text-center w-full">
                  <span className={`font-bold ${isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>{option.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Actions */}
        <div className="flex justify-between mt-12">
          {currentStep > 0 ? (
            <button 
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-8 py-3 rounded-full font-bold text-primary border border-primary/20 hover:bg-primary/5 transition-colors"
            >
              Quay lại
            </button>
          ) : <div></div>}

          {(step.multiSelect || selections[step.id]) && (
            <button 
              onClick={handleNext}
              className="px-8 py-3 rounded-full font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
            >
              {currentStep === steps.length - 1 ? 'Xem quà phù hợp' : 'Tiếp theo'}
            </button>
          )}
        </div>

      </div>
    </main>
  );
}
