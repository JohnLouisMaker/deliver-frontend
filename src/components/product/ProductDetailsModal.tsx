import { Minus, Plus, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { ItemCardapio } from "../../types/product";

interface ProductDetailsModalProps {
  product: ItemCardapio;
  imageUrl: string;
  onClose: () => void;
  onAdd: (product: ItemCardapio, quantity: number) => void;
}

export default function ProductDetailsModal({
  product,
  imageUrl,
  onClose,
  onAdd,
}: ProductDetailsModalProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-0"
      />

      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto z-10"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar detalhes do produto"
          className="absolute top-6 right-6 z-20 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-orange-600 hover:text-white transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-48 sm:h-72 w-full shrink-0 bg-slate-50">
            <img
              src={imageUrl}
              alt={product.nome}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-5 sm:p-10 flex flex-col justify-between flex-1">
            <div>
              <span className="text-orange-600 font-black text-xs uppercase tracking-widest mb-2 block">
                {product.categoria}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black leading-tight uppercase mb-4">
                {product.nome}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {product.descricao ||
                  "Ingredientes selecionados para o melhor sabor."}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-slate-100 rounded-2xl p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) => Math.max(1, value - 1))
                    }
                    aria-label="Diminuir quantidade"
                    className="p-2 hover:bg-white rounded-xl transition-all"
                  >
                    <Minus className="w-5 h-5 text-slate-600" />
                  </button>
                  <span className="w-10 text-center font-black text-xl">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => value + 1)}
                    aria-label="Aumentar quantidade"
                    className="p-2 hover:bg-white rounded-xl transition-all"
                  >
                    <Plus className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
                <span className="text-slate-400 text-sm font-medium">
                  Unidades
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <span className="text-3xl font-black">
                  <span className="text-orange-600 text-lg mr-1">R$</span>
                  {(product.preco * quantity).toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => onAdd(product, quantity)}
                  className="flex-1 bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 active:scale-95"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
