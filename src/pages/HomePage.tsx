import { Hamburger, Search, ShoppingBag, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import CartPanel from "../components/cart/CartPanel";
import ProductCard from "../components/product/ProductCard";
import ProductDetailsModal from "../components/product/ProductDetailsModal";
import ProfilePanel from "../components/profile/ProfilePanel";
import { ROTAS } from "../routes/paths";
import useAuthStore from "../store/authStore";
import useCartStore, {
  selectCartSubtotal,
  selectCartTotalItems,
} from "../store/cartStore";
import { type ItemCardapio } from "../types/product";

export default function HomePage() {
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();
  const { addToCart, currentCart } = useCartStore();

  const subtotal = useCartStore(selectCartSubtotal);
  const totalItems = useCartStore(selectCartTotalItems);

  const [comidas, setComidas] = useState<ItemCardapio[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ItemCardapio | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [cartCurrentOpen, setCartCurrentOpen] = useState(false);
  const [modalUser, setModalUser] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const userRef = useRef<HTMLDivElement | null>(null);
  const cartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!modalUser) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        window.matchMedia("(min-width: 1024px)").matches &&
        userRef.current &&
        !userRef.current.contains(event.target as Node)
      ) {
        setModalUser(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalUser(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [modalUser]);

  useEffect(() => {
    if (!cartCurrentOpen) return;

    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (
        window.matchMedia("(min-width: 1024px)").matches &&
        cartRef.current &&
        !cartRef.current.contains(event.target as Node)
      ) {
        setCartCurrentOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
    };
  }, [cartCurrentOpen]);

  const API_URL =
    import.meta.env.VITE_API_URL || "https://deliver-backend-6ec9.onrender.com";

  const getImageUrl = (path: string) => {
    if (!path || path.startsWith("http://") || path.startsWith("https://"))
      return path || "";
    return `${API_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  };

  useEffect(() => {
    async function carregarCardapio() {
      try {
        const response = await api.get("/cardapio/");
        setComidas(response.data);
      } catch (error) {
        console.error("Erro ao carregar cardápio:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarCardapio();
  }, []);

  const abrirDetalhesProduto = async (id: number) => {
    document.body.style.overflow = "hidden";

    try {
      const response = await api.get(`/cardapio/${id}`);
      setSelectedProduct(response.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
      document.body.style.overflow = "auto";
    }
  };

  const fecharDetalhesProduto = () => {
    setSelectedProduct(null);
    document.body.style.overflow = "auto";
  };

  const encerrarSessao = () => {
    logout();
    navigate(ROTAS.login);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Barra de navegação */}
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

          {/* Campo de busca — desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-10 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />

            <input
              type="text"
              placeholder="O que vamos comer hoje?"
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            {/* Busca mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-3 md:hidden bg-slate-100 rounded-2xl hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-colors"
            >
              <Search className="w-6 h-6" />
            </button>
            {/* Carrinho */}
            <div ref={cartRef} className="relative">
              <button
                className="hidden lg:block p-3 bg-slate-100 rounded-2xl hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-colors relative"
                onClick={() => setCartCurrentOpen(!cartCurrentOpen)}
              >
                <ShoppingBag className="w-6 h-6" />

                {currentCart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {cartCurrentOpen && (
                  <motion.div
                    key="desktop-cart"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="hidden lg:block absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 z-50"
                  >
                    <CartPanel onClose={() => setCartCurrentOpen(false)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Perfil do usuário */}
            <div ref={userRef} className="relative">
              <button
                type="button"
                onClick={() => setModalUser((open) => !open)}
                aria-expanded={modalUser}
                aria-haspopup="dialog"
                aria-controls="profile-modal"
                className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white p-1 sm:pr-4 transition-colors hover:border-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold uppercase">
                  {user?.nome?.charAt(0) || <User className="w-5 h-5" />}
                </div>
                <span className="hidden text-sm font-bold text-slate-700 sm:inline">
                  {user?.nome?.split(" ")[0] || "Perfil"}
                </span>
              </button>

              <AnimatePresence>
                {modalUser && (
                  <motion.div
                    role="dialog"
                    aria-label="Opções do perfil"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 z-50 mt-3 hidden w-80 rounded-3xl border border-slate-100 bg-white p-5 shadow-2xl lg:block"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <ProfilePanel
                      user={user}
                      onClose={() => setModalUser(false)}
                      onLogout={encerrarSessao}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Perfil Mobile */}
      <AnimatePresence>
        {modalUser && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalUser(false)}
          >
            <div className="absolute inset-0 bg-black/40" />
            <motion.div
              role="dialog"
              aria-label="Opções do perfil"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 inset-x-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-6 pb-10"
              onClick={(event) => event.stopPropagation()}
            >
              <ProfilePanel
                user={user}
                onClose={() => setModalUser(false)}
                onLogout={encerrarSessao}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Busca Mobile */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 bg-white border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="O que vamos comer hoje?"
              autoFocus
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all"
            />
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        {/* Banner promocional */}
        <section className="relative w-full h-48 sm:h-64 bg-orange-600 rounded-[2.5rem] overflow-hidden mb-12 flex items-center px-6 sm:px-12 text-white shadow-2xl shadow-orange-200">
          <div className="z-10">
            <span className="inline-block px-4 py-1 bg-orange-500 text-xs font-black rounded-full mb-4 tracking-widest uppercase">
              CUPOM: FAMINTO20
            </span>

            <h2 className="text-3xl sm:text-5xl font-black leading-none uppercase mb-4">
              20% OFF NA <br />{" "}
              <span className="text-orange-200">PRIMEIRA COMPRA</span>
            </h2>

            <button className="bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform active:scale-95">
              Aproveitar agora
            </button>
          </div>

          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-20" />
        </section>

        {/* Lista de produtos */}
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
                <ProductCard
                  key={item.id}
                  product={item}
                  imageUrl={getImageUrl(item.imagem_url)}
                  onSelect={abrirDetalhesProduto}
                  onAdd={(product) => addToCart(product, 1)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Carrinho Mobile */}
      <AnimatePresence>
        {currentCart.length > 0 && !cartCurrentOpen && (
          <motion.button
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            onClick={() => setCartCurrentOpen(true)}
            className="lg:hidden fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-2xl"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative shrink-0 rounded-xl bg-orange-600 p-2">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-slate-900">
                  {totalItems}
                </span>
              </div>
              <div className="min-w-0 text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Seu carrinho
                </p>
                <p className="truncate text-sm font-black">Ver pedido</p>
              </div>
            </div>
            <span className="shrink-0 font-black">
              R$ {subtotal.toFixed(2)}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Carrinho Mobile Aberto */}
      <AnimatePresence>
        {cartCurrentOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartCurrentOpen(false)}
          >
            <div className="absolute inset-0 bg-black/40" />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 inset-x-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-6 pb-10"
              onClick={(e) => e.stopPropagation()}
            >
              <CartPanel onClose={() => setCartCurrentOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de detalhes do produto */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            imageUrl={getImageUrl(selectedProduct.imagem_url)}
            onClose={fecharDetalhesProduto}
            onAdd={(product, quantity) => {
              addToCart(product, quantity);
              fecharDetalhesProduto();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
