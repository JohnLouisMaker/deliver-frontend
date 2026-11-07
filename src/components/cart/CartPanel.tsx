import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { ROTAS } from "../../routes/paths";
import useCartStore, { selectCartSubtotal } from "../../store/cartStore";

interface CartPanelProps {
  onClose: () => void;
}

export default function CartPanel({ onClose }: CartPanelProps) {
  const { currentCart, removeFromCart } = useCartStore();
  const subtotal = useCartStore(selectCartSubtotal);

  return (
    <>
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
        <h3 className="text-lg font-black uppercase">Seu Pedido</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar pedido"
          className="p-1.5 bg-slate-100 rounded-full hover:bg-orange-600 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-1">
        {currentCart.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">
            Seu pedido está vazio.
          </p>
        ) : (
          currentCart.map(({ product, quantity, tamanho }) => (
            <div
              key={product.id}
              className="flex justify-between items-center bg-slate-50 p-2.5 rounded-2xl"
            >
              <div className="truncate pr-2">
                <h4 className="font-bold text-xs truncate">{product.nome}</h4>
                <span className="text-[10px] text-slate-400">
                  Qtd: {quantity}
                  {tamanho && ` | ${tamanho}`}
                </span>
              </div>
              <span className="font-black text-xs shrink-0">
                R$ {(product.preco * quantity).toFixed(2)}
              </span>
              <button
                type="button"
                aria-label={`Remover ${product.nome} do pedido`}
                className="p-1.5 bg-slate-100 rounded-full hover:bg-red-600 hover:text-white transition-all"
                onClick={() => removeFromCart(product.id, tamanho)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
        <h3 className="font-bold text-sm">Total: R$ {subtotal.toFixed(2)} <span className="text-[10px] font-bold text-slate-400 ml-1">(informativo)</span></h3>
      </div>

      {currentCart.length > 0 ? (
        <Link
          to={ROTAS.checkout}
          onClick={onClose}
          className="block w-full z-10 bg-orange-600 text-center text-white py-3 rounded-2xl font-bold text-sm hover:bg-orange-700 transition-all active:scale-[0.98]"
        >
          Finalizar Pedido
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="w-full z-10 bg-orange-600 text-white py-3 rounded-2xl font-bold text-sm opacity-50"
        >
          Finalizar Pedido
        </button>
      )}
    </>
  );
}
