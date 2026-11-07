import { create } from "zustand";
import { ehPizza, type ItemCardapio, type TamanhoPizza } from "../types/product";

/**
 * Item do pedido local (informativo). O preço exibido é de referência:
 * o backend recalcula com os preços oficiais no checkout.
 */
interface CartItem {
  product: ItemCardapio;
  quantity: number;
  /** Obrigatório para pizzas; ausente para itens de preço fixo. */
  tamanho?: TamanhoPizza;
}

interface CartState {
  currentCart: CartItem[];
  addToCart: (
    product: ItemCardapio,
    quantity: number,
    tamanho?: TamanhoPizza,
  ) => void;
  removeFromCart: (itemId: number, tamanho?: TamanhoPizza) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const selectCartSubtotal = (state: CartState) => state.subtotal();
export const selectCartTotalItems = (state: CartState) => state.totalItems();

/** Chave identificadora: id + tamanho (pizza = 1 sabor x tamanho). */
const chaveItem = (itemId: number, tamanho?: TamanhoPizza) =>
  `${itemId}:${tamanho ?? ""}`;

const useCartStore = create<CartState>((set, get) => ({
  currentCart: [],
  addToCart: (product, quantity, tamanho) => {
    const tamanhoResolvido = ehPizza(product) ? tamanho : undefined;
    if (ehPizza(product) && !tamanhoResolvido) {
      throw new Error(
        `Selecione o tamanho para adicionar '${product.nome}' ao pedido.`,
      );
    }

    const chave = chaveItem(product.id, tamanhoResolvido);
    const existingItemIndex = get().currentCart.findIndex(
      (item) =>
        chaveItem(item.product.id, item.tamanho) === chave,
    );

    if (existingItemIndex !== -1) {
      const updatedCart = [...get().currentCart];
      updatedCart[existingItemIndex] = {
        product,
        quantity: updatedCart[existingItemIndex].quantity + quantity,
        tamanho: tamanhoResolvido,
      };
      set({ currentCart: updatedCart });
    } else {
      set({
        currentCart: [
          ...get().currentCart,
          { product, quantity, tamanho: tamanhoResolvido },
        ],
      });
    }
  },
  removeFromCart: (itemId, tamanho) => {
    const chave = chaveItem(itemId, tamanho);
    set({
      currentCart: get().currentCart.filter(
        (item) => chaveItem(item.product.id, item.tamanho) !== chave,
      ),
    });
  },
  clearCart: () => set({ currentCart: [] }),
  totalItems: () => {
    return get().currentCart.reduce((total, item) => total + item.quantity, 0);
  },
  /** Subtotal informativo: usa o preço base para pizza aguardando preço por tamanho. */
  subtotal: () => {
    return get().currentCart.reduce(
      (total, item) => total + item.product.preco * item.quantity,
      0,
    );
  },
}));

export default useCartStore;
