import { Plus } from "lucide-react";
import { motion } from "motion/react";
import type { ItemCardapio } from "../../types/product";

interface ProductCardProps {
  product: ItemCardapio;
  imageUrl: string;
  onSelect: (productId: number) => void;
  onAdd: (product: ItemCardapio) => void;
}

export default function ProductCard({
  product,
  imageUrl,
  onSelect,
  onAdd,
}: ProductCardProps) {
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

        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-black">
            <span className="text-sm font-bold text-orange-600 mr-1">R$</span>
            {product.preco.toFixed(2)}
          </span>
          <button
            type="button"
            aria-label={`Adicionar ${product.nome} ao carrinho`}
            className="bg-slate-900 text-white p-2.5 rounded-xl group-active:scale-80 transition-transform group-hover:bg-orange-600 transition-colors shadow-lg"
            onClick={(event) => {
              event.stopPropagation();
              onAdd(product);
            }}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
