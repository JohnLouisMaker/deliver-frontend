import { create } from "zustand";
import {
  ehPizza,
  precoNoCarrinho,
  type ItemCardapio,
  type TamanhoPizza,
} from "../types/product";

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
  /** Define a quantidade da linha; <= 0 remove o item. */
  updateQuantity: (
    itemId: number,
    tamanho: TamanhoPizza | undefined,
    quantity: number,
  ) => void;
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
  updateQuantity: (itemId, tamanho, quantity) => {
    const chave = chaveItem(itemId, tamanho);
    if (quantity <= 0) {
      set({
        currentCart: get().currentCart.filter(
          (item) => chaveItem(item.product.id, item.tamanho) !== chave,
        ),
      });
      return;
    }
    set({
      currentCart: get().currentCart.map((item) =>
        chaveItem(item.product.id, item.tamanho) === chave
          ? { ...item, quantity }
          : item,
      ),
    });
  },
  clearCart: () => set({ currentCart: [] }),
  totalItems: () => {
    return get().currentCart.reduce((total, item) => total + item.quantity, 0);
  },
  /**
   * Subtotal informativo: usa preço por tamanho quando o backend o expõe.
   * Linhas com preço a definir (null) não entram na soma.
   */
  subtotal: () => {
    return get().currentCart.reduce((total, item) => {
      const preco = precoNoCarrinho(item.product, item.tamanho);
      return preco === null ? total : total + preco * item.quantity;
    }, 0);
  },
}));

export default useCartStore;
