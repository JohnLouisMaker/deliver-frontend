import { AnimatePresence, motion } from "framer-motion";
import {
  Hamburger,
  LogOut,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import useAuthStore from "../store/authStore";
import { type ItemCardapio } from "../types/product";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Estados da API
  const [comidas, setComidas] = useState<ItemCardapio[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Modal e Produto
  const [selectedProduct, setSelectedProduct] = useState<ItemCardapio | null>(
    null,
  );
  const [, setLoadingDetail] = useState(false);
  const [quantidade, setQuantidade] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL;

  // 1. Carrega o cardápio
  useEffect(() => {
    async function fetchComidas() {
      try {
        const response = await api.get("/cardapio/cardapio");
        setComidas(response.data);
      } catch (error) {
        console.error("Erro ao carregar cardápio:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchComidas();
  }, []);

  // 2. Lógica do Modal
  const openModalProduct = async (id: number) => {
    setLoadingDetail(true);
    setQuantidade(1); // Reseta a quantidade
    document.body.style.overflow = "hidden";

    try {
      const response = await api.get(`/cardapio/cardapio/${id}`);
      setSelectedProduct(response.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = "auto";
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-xl shadow-lg shadow-orange-200">
              <Hamburger className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase">
              Menuu<span className="text-orange-600">.</span>
            </h1>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-10 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="O que vamos comer hoje?"
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="p-3 bg-slate-100 rounded-2xl hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-colors relative">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border-2 border-white" />
            </button>

            <div className="hidden sm:flex items-center gap-2 p-1 pr-4 bg-white border border-slate-200 rounded-full">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold uppercase">
                {user?.nome?.charAt(0) || <User className="w-5 h-5" />}
              </div>
              <span className="text-sm font-bold text-slate-700">
                {user?.nome?.split(" ")[0] || "Perfil"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-3 bg-slate-100 rounded-2xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        {/* --- BANNER DE CUPOM --- */}
        <section className="relative w-full h-64 bg-orange-600 rounded-[2.5rem] overflow-hidden mb-12 flex items-center px-12 text-white shadow-2xl shadow-orange-200">
          <div className="z-10">
            <span className="inline-block px-4 py-1 bg-orange-500 text-xs font-black rounded-full mb-4 tracking-widest uppercase">
              CUPOM: FAMINTO20
            </span>
            <h2 className="text-5xl font-black leading-none uppercase mb-4">
              20% OFF NA <br />{" "}
              <span className="text-orange-200">PRIMEIRA COMPRA</span>
            </h2>
            <button className="bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform active:scale-95">
              Aproveitar agora
            </button>
          </div>
          {/* Decoração sutil no fundo */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-20" />
        </section>

        {/* --- GRID DE PRODUTOS --- */}
        <section>
          <h3 className="text-3xl font-black uppercase mb-8">
            Populares{" "}
            <span className="text-orange-600 text-xl font-medium block sm:inline">
              do Menu
            </span>
          </h3>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-80 bg-slate-200 animate-pulse rounded-4xl"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {comidas.map((item) => (
                <motion.div
                  layoutId={`product-${item.id}`}
                  key={item.id}
                  onClick={() => openModalProduct(item.id)}
                  className="group bg-white rounded-4xl p-4 shadow-sm hover:shadow-2xl hover:shadow-orange-100 transition-all duration-500 border border-transparent hover:border-orange-100 cursor-pointer"
                >
                  <div className="relative h-48 w-full bg-slate-50 rounded-2xl overflow-hidden mb-4">
                    <img
                      src={`${API_URL}${item.imagem_url}`}
                      alt={item.nome}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  <div className="px-2">
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                      {item.categoria}
                    </span>
                    <h4 className="text-lg font-bold mb-1 truncate">
                      {item.nome}
                    </h4>

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-2xl font-black">
                        <span className="text-sm font-bold text-orange-600 mr-1">
                          R$
                        </span>
                        {item.preco.toFixed(2)}
                      </span>
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl group-hover:bg-orange-600 transition-colors shadow-lg">
                        <Plus className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* --- MODAL DETALHADO --- */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              layoutId={`product-${selectedProduct.id}`}
              className="bg-white w-full max-w-3xl rounded-[3rem] overflow-hidden shadow-2xl relative z-10"
            >
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 z-20 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-orange-600 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-1/2 h-64 md:h-auto">
                  <img
                    src={`${API_URL}${selectedProduct.imagem_url}`}
                    alt={selectedProduct.nome}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-full md:w-1/2 p-10 flex flex-col justify-between bg-white">
                  <div>
                    <span className="text-orange-600 font-black text-xs uppercase tracking-widest mb-2 block">
                      {selectedProduct.categoria}
                    </span>
                    <h2 className="text-4xl font-black leading-tight uppercase mb-4">
                      {selectedProduct.nome}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                      {selectedProduct.descricao ||
                        "Ingredientes selecionados para o melhor sabor."}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Contador de Quantidade */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-slate-100 rounded-2xl p-1">
                        <button
                          onClick={() =>
                            setQuantidade(Math.max(1, quantidade - 1))
                          }
                          className="p-2 hover:bg-white rounded-xl transition-all"
                        >
                          <Minus className="w-5 h-5 text-slate-600" />
                        </button>
                        <span className="w-10 text-center font-black text-xl">
                          {quantidade}
                        </span>
                        <button
                          onClick={() => setQuantidade(quantidade + 1)}
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
                        {(selectedProduct.preco * quantidade).toFixed(2)}
                      </span>
                      <button className="flex-1 bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 active:scale-95">
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
