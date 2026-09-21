import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // product id (hoặc id tự tạo nếu là hàng custom)
  name: string;
  price: number;
  image: string;
  quantity: number;
  isCustom?: boolean;
  customText?: string;
  customNote?: string;
  customSpecs?: any;
  sellerId?: string; // legacy support
  storeName?: string; // legacy support
  deliveryDays?: number; // legacy support
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => {
        // Đối với hàng custom, ta không gom chung mà coi như 1 item riêng nếu id khác
        // Nếu cùng id (VD product ID giống nhau) nhưng isCustom khác nhau hoặc text khác nhau thì không nên gộp.
        // Tạm thời đơn giản: Nếu là isCustom thì tạo ID đặc biệt luôn ở phía gọi (ví dụ id + '-' + timestamp).
        const existing = state.items.find((i) => i.id === item.id && !i.isCustom);
        if (existing && !item.isCustom) {
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
            ),
          };
        }
        return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      updateQuantity: (id, quantity) => set((state) => {
        if (quantity < 1) return { items: state.items };
        return {
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        };
      }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cupfy-cart-storage',
    }
  )
);
