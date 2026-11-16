import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ROTAS } from "../../routes/paths";
import useCartStore, { selectCartSubtotal } from "../../store/cartStore";
import { precoNoCarrinho, ROTULOS_TAMANHO } from "../../types/product";

const formatarPreco = (valor: number) => valor.toFixed(2);

interface CartPanelProps {
  onClose: () => void;
}

export default function CartPanel({ onClose }: CartPanelProps) {
  const { currentCart, removeFromCart, updateQuantity } = useCartStore();
  const subtotal = useCartStore(selectCartSubtotal);
  const totalItens = currentCart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-black uppercase leading-none">
            Seu Pedido
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {totalItens === 0
              ? "Nenhum item"
              : `${totalItens} ${totalItens === 1 ? "item" : "itens"}`}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar pedido"
          className="p-2 bg-slate-100 rounded-full hover:bg-orange-600 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 max-h-[min(60vh,26rem)] overflow-y-auto mb-4 pr-1">
        {currentCart.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
            <ShoppingBag className="w-8 h-8" />
            <p className="text-sm font-bold">Seu pedido está vazio.</p>
            <p className="text-xs">Escolha algo no cardápio.</p>
          </div>
        ) : (
          currentCart.map(({ product, quantity, tamanho }) => {
            const preco = precoNoCarrinho(product, tamanho);
            const subtotalLinha =
              preco === null ? null : formatarPreco(preco * quantity);
            return (
              <div
                key={`${product.id}:${tamanho ?? ""}`}
                className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-600">
                      {product.categoria}
                    </span>
                    <h4 className="truncate text-sm font-bold leading-tight">
                      {product.nome}
                    </h4>
                    <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                      {tamanho
                        ? ROTULOS_TAMANHO[tamanho] ?? tamanho
                        : "Preço fixo"}
                      {preco !== null && ` · R$ ${formatarPreco(preco)} / un`}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remover ${product.nome} do pedido`}
                    className="shrink-0 rounded-full p-1.5 text-slate-400 transition-all hover:bg-red-600 hover:text-white"
                    onClick={() => removeFromCart(product.id, tamanho)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-xl bg-slate-50 p-1">
                    <button
                      type="button"
                      aria-label={`Diminuir quantidade de ${product.nome}`}
                      className="rounded-lg p-1.5 text-slate-600 transition-all hover:bg-white hover:text-orange-600 hover:shadow-sm"
                      onClick={() =>
                        updateQuantity(product.id, tamanho, quantity - 1)
                      }
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span
                      className="min-w-6 text-center text-sm font-black"
                      aria-label={`Quantidade: ${quantity}`}
                    >
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Aumentar quantidade de ${product.nome}`}
                      className="rounded-lg p-1.5 text-slate-600 transition-all hover:bg-white hover:text-orange-600 hover:shadow-sm"
                      onClick={() =>
                        updateQuantity(product.id, tamanho, quantity + 1)
                      }
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-sm font-black">
                    {subtotalLinha === null ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Preço a definir
                      </span>
                    ) : (
                      `R$ ${subtotalLinha}`
                    )}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mb-4 space-y-1 border-t border-dashed border-slate-200 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Total
          </span>
          <span className="text-xl font-black text-orange-600">
            R$ {formatarPreco(subtotal)}
          </span>
        </div>
        <p className="text-right text-[10px] font-semibold text-slate-400">
          Valor informativo — o total final é calculado no pedido.
        </p>
      </div>

      {currentCart.length > 0 ? (
        <Link
          to={ROTAS.checkout}
          onClick={onClose}
          className="block w-full z-10 bg-slate-900 text-center text-white py-3 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-orange-600 transition-all active:scale-[0.98]"
        >
          Finalizar Pedido
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="w-full z-10 bg-slate-900 text-white py-3 rounded-2xl font-black text-sm uppercase tracking-wider opacity-40"
        >
          Finalizar Pedido
        </button>
      )}
    </>
  );
}
