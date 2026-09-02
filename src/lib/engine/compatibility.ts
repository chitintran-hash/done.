import { mockProducts, Product, ProductCategory, StylePreference } from './mockProducts';

export interface MonitorConstraints {
  vesa: string; // e.g. '100x100'
  size: number; // inches, e.g. 27
  weight: number; // kg, e.g. 5
}

export interface Constraints {
  budget: number;
  maxWidth: number;
  maxDepth?: number;
  style: StylePreference | null;
  ownedItems: string[];
  deadlineDays: number;
  monitorDetails?: MonitorConstraints;
}

export interface Solution {
  id: string;
  name: string;
  type: 'budget' | 'best-fit' | 'premium';
  totalPrice: number;
  maxDeliveryDays: number;
  products: Product[];
  explanation: Record<string, string>; // productId -> why it fits
  warnings: string[]; // for budget or deadline warnings
}

export function buildSolutions(constraints: Constraints): Solution[] {
  // RULE SPACE 01 & 02: Filter Desk
  const filterDesk = (p: Product) => {
    if (p.category !== 'desk') return true;
    if (p.specs.width !== 'N/A' && p.specs.width !== 'MISSING' && p.specs.width > constraints.maxWidth) return false;
    if (constraints.maxDepth && p.specs.depth !== 'N/A' && p.specs.depth !== 'MISSING' && p.specs.depth > constraints.maxDepth) return false;
    return true;
  };

  const neededCategories: ProductCategory[] = ['desk', 'chair', 'desk_lamp', 'cable_management'];
  if (constraints.ownedItems.includes('monitor')) {
    neededCategories.push('monitor_arm');
  }

  // Remove owned categories
  const finalCategories = neededCategories.filter(c => {
    if (c === 'desk' && constraints.ownedItems.includes('desk')) return false;
    if (c === 'chair' && constraints.ownedItems.includes('chair')) return false;
    return true;
  });

  const eligibleProducts = mockProducts.filter(p => {
    if (!p.isAvailable) return false;
    if (!filterDesk(p)) return false;
    
    // RULE ARM VESA/SIZE/WEIGHT: Pre-filter Monitor Arm based on Monitor Details (if any)
    if (p.category === 'monitor_arm' && constraints.monitorDetails) {
      const { vesa, size, weight } = constraints.monitorDetails;
      if (p.specs.vesaSupported !== 'N/A' && p.specs.vesaSupported !== 'MISSING' && !p.specs.vesaSupported.includes(vesa)) return false;
      if (p.specs.supportedMonitorSize !== 'N/A' && p.specs.supportedMonitorSize !== 'MISSING' && size > p.specs.supportedMonitorSize) return false;
      if (p.specs.maxLoad !== 'N/A' && p.specs.maxLoad !== 'MISSING' && weight > p.specs.maxLoad) return false;
    }
    
    return true;
  });

  const generateSolution = (type: 'budget' | 'best-fit' | 'premium'): Solution | null => {
    let currentTotal = 0;
    let maxDelivery = 0;
    const selectedProducts: Product[] = [];
    const explanation: Record<string, string> = {};
    const warnings: string[] = [];

    // Helper to get desk thickness
    const getDeskThickness = () => {
      const desk = selectedProducts.find(p => p.category === 'desk');
      if (desk && desk.specs.deskThickness !== 'N/A' && desk.specs.deskThickness !== 'MISSING') {
        return desk.specs.deskThickness as number;
      }
      return null;
    };

    for (const cat of finalCategories) {
      let candidates = eligibleProducts.filter(p => p.category === cat);
      
      if (constraints.style && type !== 'budget') {
        const styleMatch = candidates.filter(p => p.specs.style.includes(constraints.style!));
        if (styleMatch.length > 0) candidates = styleMatch;
      }

      // Sort
      if (type === 'budget') candidates.sort((a, b) => a.price - b.price);
      else if (type === 'premium') candidates.sort((a, b) => b.price - a.price);
      else {
        candidates.sort((a, b) => a.price - b.price);
        if (candidates.length > 1) candidates = [candidates[Math.floor(candidates.length / 2)]];
      }

      let selected = null;
      
      for (const candidate of candidates) {
        // Evaluate inter-product compatibility (RULE ARM DESK, RULE CABLE DESK)
        const deskThickness = getDeskThickness();
        if (deskThickness !== null) {
          if (candidate.category === 'monitor_arm') {
            if (candidate.specs.clampThicknessMax !== 'N/A' && candidate.specs.clampThicknessMax !== 'MISSING') {
              if (deskThickness > candidate.specs.clampThicknessMax) continue; // Incompatible, try next candidate
            }
          }
          if (candidate.category === 'cable_management') {
            if (candidate.specs.clampThicknessMax !== 'N/A' && candidate.specs.clampThicknessMax !== 'MISSING') {
              if (deskThickness > candidate.specs.clampThicknessMax) continue; // Incompatible
            }
          }
        }
        
        selected = candidate;
        break; // Found a compatible one
      }

      if (selected) {
        selectedProducts.push(selected);
        currentTotal += selected.price;
        if (selected.deliveryDays > maxDelivery) maxDelivery = selected.deliveryDays;

        if (cat === 'desk') explanation[selected.id] = `RULE SPACE 01: Bàn rộng ${selected.specs.width}cm <= Không gian ${constraints.maxWidth}cm.`;
        else if (cat === 'monitor_arm') explanation[selected.id] = `RULE ARM: Chuẩn VESA và tải trọng tương thích hoàn hảo. RULE ARM DESK: Ngàm kẹp vừa vặn độ dày bàn.`;
        else if (cat === 'cable_management') explanation[selected.id] = `RULE CABLE DESK: Khay kẹp dây tương thích với độ dày bàn.`;
        else explanation[selected.id] = `Phù hợp với phong cách và ngân sách.`;
      }
    }

    if (selectedProducts.length === 0) return null;

    // RULE BUDGET
    if (currentTotal > constraints.budget) {
      warnings.push(`RULE BUDGET (Hard Warning): Tổng giá trị vượt quá ngân sách ${constraints.budget.toLocaleString()}đ.`);
    }

    // RULE DEADLINE
    if (maxDelivery > constraints.deadlineDays) {
      warnings.push(`RULE DEADLINE (Hard Warning): Có sản phẩm giao trễ hơn thời hạn ${constraints.deadlineDays} ngày.`);
    }

    return {
      id: type,
      name: type === 'budget' ? 'Giải Pháp Tiết Kiệm' : type === 'best-fit' ? 'Phù Hợp Nhất' : 'Giải Pháp Nâng Cấp',
      type,
      totalPrice: currentTotal,
      maxDeliveryDays: maxDelivery,
      products: selectedProducts,
      explanation,
      warnings
    };
  };

  const budgetSolution = generateSolution('budget');
  const bestFitSolution = generateSolution('best-fit');
  const premiumSolution = generateSolution('premium');

  return [budgetSolution, bestFitSolution, premiumSolution].filter(s => s !== null) as Solution[];
}
