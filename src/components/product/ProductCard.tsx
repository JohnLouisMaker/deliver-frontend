import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  ehPizza,
  TAMANHOS_PIZZA,
  type ItemCardapio,
  type TamanhoPizza,
} from "../../types/product";

interface ProductCardProps {
  product: ItemCardapio;
  imageUrl: string;
  onSelect: (productId: number) => void;
  onAdd: (product: ItemCardapio, tamanho?: TamanhoPizza) => void;
}

const rotulosTamanho: Record<TamanhoPizza, string> = {
  pequena: "P",
  media: "M",
  grande: "G",
};

export default function ProductCard({
  product,
  imageUrl,
  onSelect,
  onAdd,
}: ProductCardProps) {
  const pizza = ehPizza(product);
  const [tamanho, setTamanho] = useState<TamanhoPizza | null>(null);
  const podeAdicionar = !pizza || tamanho !== null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => onSelect(product.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(product.id);
        }
      }}
      role="button"
      tabIndex={0}
      className="group bg-white rounded-4xl p-4 shadow-sm hover:shadow-2xl hover:shadow-orange-100 transition-shadow duration-300 border border-transparent hover:border-orange-100 cursor-pointer"
    >
      <div className="relative h-36 sm:h-48 w-full bg-slate-50 rounded-2xl overflow-hidden mb-4">
        <img
          src={imageUrl}
          alt={product.nome}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      <div className="px-2">
        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
          {product.categoria}
        </span>
        <h4 className="text-lg font-bold mb-1 truncate">{product.nome}</h4>

        {pizza && (
          <div
            role="radiogroup"
            aria-label={`Tamanho para ${product.nome}`}
            className="flex gap-1.5 mt-3"
            onClick={(event) => event.stopPropagation()}
          >
            {TAMANHOS_PIZZA.map((valor) => (
              <button
                key={valor}
                type="button"
                role="radio"
                aria-checked={tamanho === valor}
                onClick={(event) => {
                  event.stopPropagation();
                  setTamanho(valor);
                }}
                className={`flex-1 rounded-xl border-2 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all ${
                  tamanho === valor
                    ? "border-orange-600 bg-orange-50 text-orange-700"
                    : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                }`}
              >
                {rotulosTamanho[valor]}
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-black">
            <span className="text-sm font-bold text-orange-600 mr-1">R$</span>
            {product.preco.toFixed(2)}
            {pizza && (
              <span className="text-[10px] font-bold text-slate-400 align-middle ml-1">
                (ref.)
              </span>
            )}
          </span>
          <button
            type="button"
            disabled={!podeAdicionar}
            aria-label={
              pizza && tamanho === null
                ? `Selecione o tamanho de ${product.nome} para adicionar ao pedido`
                : `Adicionar ${product.nome} ao pedido`
            }
            title={
              pizza && tamanho === null
                ? "Selecione um tamanho"
                : `Adicionar ${product.nome}`
            }
            className="bg-slate-900 text-white p-2.5 rounded-xl group-active:scale-80 transition-transform group-hover:bg-orange-600 transition-colors shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed disabled:group-hover:bg-slate-300"
            onClick={(event) => {
              event.stopPropagation();
              if (!podeAdicionar) return;
              onAdd(product, tamanho ?? undefined);
            }}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
