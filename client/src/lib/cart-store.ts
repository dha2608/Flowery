import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  productSlug: string;
  shopId: string;
  shopName: string;
  shopSlug: string;
  price: number;
  salePrice?: number;
  quantity: number;
  customizations?: Record<string, string>;
}

export interface ShopGroup {
  shopId: string;
  shopName: string;
  shopSlug: string;
  items: CartItem[];
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  clearShopItems: (shopId: string) => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getShopGroups: () => Map<string, ShopGroup>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const { quantity = 1, ...rest } = newItem;
        set((state) => {
          const existing = state.items.find((i) => i.productId === rest.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === rest.productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...rest, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      clearShopItems: (shopId) => {
        set((state) => ({
          items: state.items.filter((i) => i.shopId !== shopId),
        }));
      },

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, item) => {
          const price = item.salePrice ?? item.price;
          return sum + price * item.quantity;
        }, 0),

      getShopGroups: () => {
        const groups = new Map<string, ShopGroup>();
        for (const item of get().items) {
          if (!groups.has(item.shopId)) {
            groups.set(item.shopId, {
              shopId: item.shopId,
              shopName: item.shopName,
              shopSlug: item.shopSlug,
              items: [],
            });
          }
          groups.get(item.shopId)!.items.push(item);
        }
        return groups;
      },
    }),
    { name: 'flowery-cart' },
  ),
);
