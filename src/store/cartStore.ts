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
  totalItems: () => number;
  subtotal: () => number;
}

export const selectCartSubtotal = (state: CartState) => state.subtotal();
export const selectCartTotalItems = (state: CartState) => state.totalItems();

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
  totalItems: () => {
    return get().currentCart.reduce((total, item) => total + item.quantity, 0);
  },
  subtotal: () => {
    return get().currentCart.reduce(
      (total, item) => total + item.product.preco * item.quantity,
      0,
    );
  },
}));

export default useCartStore;
