import { create } from "zustand";
import type { ItemCardapio } from "../types/product";

interface CartItem {
  product: ItemCardapio;
  quantity: number;
}

interface CartState {
  currentCart: CartItem[];
  addToCart: (product: ItemCardapio, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

const useCartStore = create<CartState>((set, get) => ({
  currentCart: [],
  addToCart: (product, quantity) => {
    const existingItemIndex = get().currentCart.findIndex(
      (item) => item.product.id === product.id,
    );
    if (existingItemIndex !== -1) {
      const updatedCart = [...get().currentCart];
      updatedCart[existingItemIndex] = {
        product,
        quantity: updatedCart[existingItemIndex].quantity + quantity,
      };
      set({ currentCart: updatedCart });
    } else {
      set({
        currentCart: [...get().currentCart, { product, quantity }],
      });
    }
  },
  removeFromCart: (productId) => {
    set({
      currentCart: get().currentCart.filter(
        (item) => item.product.id !== productId,
      ),
    });
  },
  clearCart: () => set({ currentCart: [] }),
}));

export default useCartStore;
