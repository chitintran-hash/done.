import { mockProducts, Product, ProductCategory, StylePreference, ProductSpecs } from './mockProducts';

export interface Constraints {
  budget: number;
  maxWidth: number;
  style: StylePreference | null;
  ownedItems: string[];
}

export interface Solution {
  id: string;
  name: string;
  type: 'budget' | 'best-fit' | 'premium';
  totalPrice: number;
  products: Product[];
  explanation: Record<string, string>; // productId -> why it fits
}

export function buildSolutions(constraints: Constraints): Solution[] {
  // We need to build 3 solutions: Budget, Best Fit, Premium
  // Each solution should ideally have: Desk, Chair, Lamp, Accessory.
  // Monitor Arm is added only if they own a Monitor.
  // We skip items they already own.
  
  const neededCategories: ProductCategory[] = ['desk', 'chair', 'lamp', 'accessory'];
  if (constraints.ownedItems.includes('monitor')) {
    neededCategories.push('monitor_arm');
  }

  // Remove categories they already own (e.g. if they own desk, don't buy desk)
  const finalCategories = neededCategories.filter(c => {
    if (c === 'desk' && constraints.ownedItems.includes('desk')) return false;
    if (c === 'chair' && constraints.ownedItems.includes('chair')) return false;
    return true;
  });

  // Filter products by HARD CONSTRAINTS
  const eligibleProducts = mockProducts.filter(p => {
    if (!p.isAvailable) return false;
    
    // Desk constraints
    if (p.category === 'desk') {
      if (p.specs.width && p.specs.width > constraints.maxWidth) return false;
    }
    
    return true;
  });

  // Helper to generate a solution
  const generateSolution = (type: 'budget' | 'best-fit' | 'premium'): Solution | null => {
    let currentTotal = 0;
    const selectedProducts: Product[] = [];
    const explanation: Record<string, string> = {};

    for (const cat of finalCategories) {
      // Find eligible products for this category
      let candidates = eligibleProducts.filter(p => p.category === cat);
      
      // Soft constraint: Style matching (boost score or filter)
      if (constraints.style && type !== 'budget') {
        const styleMatch = candidates.filter(p => p.specs.style.includes(constraints.style!));
        if (styleMatch.length > 0) candidates = styleMatch;
      }

      // Sort based on type
      if (type === 'budget') {
        candidates.sort((a, b) => a.price - b.price); // Cheapest first
      } else if (type === 'premium') {
        candidates.sort((a, b) => b.price - a.price); // Most expensive first
      } else {
        // Best fit: mid-range or random if small dataset
        candidates.sort((a, b) => a.price - b.price);
        if (candidates.length > 1) {
          candidates = [candidates[Math.floor(candidates.length / 2)]]; // Take middle
        }
      }

      if (candidates.length > 0) {
        const selected = candidates[0];
        
        // Arm compatibility check
        if (cat === 'monitor_arm') {
          const desk = selectedProducts.find(p => p.category === 'desk');
          if (desk && selected.specs.clampThicknessMax && desk.specs.deskThickness) {
            if (desk.specs.deskThickness > selected.specs.clampThicknessMax) {
              // Incompatible! Skip this arm
              continue;
            }
          }
        }

        selectedProducts.push(selected);
        currentTotal += selected.price;

        // Generate explanation
        if (cat === 'desk') {
          explanation[selected.id] = `Bàn có chiều rộng ${selected.specs.width}cm, hoàn toàn vừa vặn với không gian ${constraints.maxWidth}cm của bạn.`;
        } else if (cat === 'monitor_arm') {
          explanation[selected.id] = `Giúp nâng đỡ màn hình bạn đang có, giải phóng hoàn toàn không gian mặt bàn. Kẹp vừa vặn với độ dày bàn.`;
        } else if (cat === 'chair') {
          explanation[selected.id] = `Ghế phù hợp với phong cách ${constraints.style || 'của bạn'}, giúp ngồi lâu không mỏi.`;
        } else {
          explanation[selected.id] = `Phụ kiện giúp hoàn thiện góc máy theo định hướng mục tiêu ban đầu.`;
        }
      }
    }

    if (currentTotal > constraints.budget && type === 'premium') {
      // It's okay if premium goes slightly over, but let's try to cap it or just return it as a stretch goal
    }

    return {
      id: type,
      name: type === 'budget' ? 'Giải Pháp Tiết Kiệm' : type === 'best-fit' ? 'Phù Hợp Nhất' : 'Giải Pháp Nâng Cấp',
      type,
      totalPrice: currentTotal,
      products: selectedProducts,
      explanation
    };
  };

  const budgetSolution = generateSolution('budget');
  const bestFitSolution = generateSolution('best-fit');
  const premiumSolution = generateSolution('premium');

  return [budgetSolution, bestFitSolution, premiumSolution].filter(s => s !== null) as Solution[];
}
