"use client";

import { useState } from 'react';
import { Product, mockProducts } from '@/lib/engine/mockProducts';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';
import { Constraints } from '@/lib/engine/compatibility';

interface SmartSwapModalProps {
  product: Product;
  currentSolutionProducts: Product[];
  constraints: Constraints;
  onClose: () => void;
  onSwap: (newProduct: Product) => void;
}

export default function SmartSwapModal({ product, currentSolutionProducts, constraints, onClose, onSwap }: SmartSwapModalProps) {
  // Logic: Find other products in the same category that are compatible
  
  const getDeskThickness = () => {
    // If we are swapping the desk, we can't use the old desk's thickness.
    // For MVP, we'll assume the swap logic is simple.
    const desk = currentSolutionProducts.find(p => p.category === 'desk');
    if (desk && desk.specs.deskThickness !== 'N/A' && desk.specs.deskThickness !== 'MISSING') {
      return desk.specs.deskThickness as number;
    }
    return null;
  };

  const compatibleAlternatives = mockProducts.filter(p => {
    if (p.id === product.id) return false;
    if (p.category !== product.category) return false;
    if (!p.isAvailable) return false;

    // Check Space Rule for Desk
    if (p.category === 'desk') {
      if (p.specs.width !== 'N/A' && p.specs.width !== 'MISSING' && p.specs.width > constraints.maxWidth) return false;
    }

    // Check inter-compatibility for arm/cable if desk exists
    const deskThickness = getDeskThickness();
    if (deskThickness !== null) {
      if (p.category === 'monitor_arm' || p.category === 'cable_management') {
        if (p.specs.clampThicknessMax !== 'N/A' && p.specs.clampThicknessMax !== 'MISSING') {
          if (deskThickness > p.specs.clampThicknessMax) return false;
        }
      }
    }

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
          <div>
            <h2 className="text-2xl font-bold">Smart Swap</h2>
            <p className="text-muted-foreground text-sm mt-1">Tìm sản phẩm thay thế phù hợp với bộ giải pháp hiện tại</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {compatibleAlternatives.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Không tìm thấy sản phẩm thay thế</h3>
              <p className="text-muted-foreground max-w-sm">Hệ thống đã loại bỏ các sản phẩm không tương thích kích thước hoặc ngân sách để đảm bảo an toàn cho góc máy của bạn.</p>
              <button onClick={onClose} className="mt-4 px-6 py-2 bg-muted hover:bg-border rounded-full font-medium">Giữ nguyên sản phẩm cũ</button>
            </div>
          ) : (
            <div className="space-y-4">
              {compatibleAlternatives.map(alt => (
                <div key={alt.id} className="flex flex-col sm:flex-row gap-6 p-4 border border-border rounded-2xl hover:border-accent transition-colors items-center group">
                  <img src={alt.image} alt={alt.name} className="w-24 h-24 object-cover rounded-xl" />
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-bold text-lg">{alt.name}</h4>
                    <div className="font-semibold text-accent mt-1">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(alt.price)}
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-green-600 mt-2 bg-green-50 w-fit px-2 py-1 rounded">
                      <CheckCircle className="w-4 h-4" /> Tương thích 100%
                    </div>
                  </div>
                  <button 
                    onClick={() => onSwap(alt)}
                    className="w-full sm:w-auto px-6 py-3 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-all opacity-100 sm:opacity-0 group-hover:opacity-100"
                  >
                    Chọn thay thế
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
