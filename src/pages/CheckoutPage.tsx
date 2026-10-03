import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Banknote,
  CreditCard,
  Landmark,
  Loader2,
  Smartphone,
  ShoppingBag,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api, { type FormaPagamento, type FinalizarPedidoData } from "../api/api";
import useCartStore from "../store/cartStore";

const formasPagamento: { value: FormaPagamento; label: string; icon: React.ReactNode }[] = [
  { value: "DINHEIRO", label: "Dinheiro", icon: <Banknote className="w-5 h-5" /> },
  { value: "CARTAO_CREDITO", label: "Cartão de Crédito", icon: <CreditCard className="w-5 h-5" /> },
  { value: "CARTAO_DEBITO", label: "Cartão de Débito", icon: <Landmark className="w-5 h-5" /> },
  { value: "PIX", label: "Pix", icon: <Smartphone className="w-5 h-5" /> },
  { value: "VALE_ALIMENTACAO", label: "Vale Alimentação", icon: <ShoppingBag className="w-5 h-5" /> },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { currentCart, clearCart } = useCartStore();

  const [endereco, setEndereco] = useState("");
  const [pagamento, setPagamento] = useState<FormaPagamento | "">("");
  const [troco, setTroco] = useState("");
  const [observacao, setObservacao] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = currentCart.reduce((s, i) => s + i.product.preco * i.quantity, 0);

  if (currentCart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <ShoppingBag className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-black text-slate-700 mb-2">Carrinho vazio</h2>
        <p className="text-slate-500 mb-6">Adicione itens antes de finalizar</p>
        <button
          onClick={() => navigate("/home")}
          className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-700 transition-all"
        >
          Ver Cardápio
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!endereco.trim()) return setError("O endereço de entrega é obrigatório");
    if (!pagamento) return setError("Selecione uma forma de pagamento");
    if (pagamento === "DINHEIRO" && !troco.trim()) return setError("Informe o valor para troco");
    if (!telefone.trim()) return setError("O telefone de contato é obrigatório");

    setLoading(true);
    try {
      // 1. Criar pedido
      const { data: pedido } = await api.post("/pedidos/criar_pedido");

      // 2. Adicionar itens
      for (const item of currentCart) {
        await api.post(`/pedidos/adicionar_item/${pedido.id}`, {
          item_id: item.product.id,
          quantidade: item.quantity,
        });
      }

      // 3. Finalizar com dados de checkout
      const body: FinalizarPedidoData = {
        endereco_entrega: endereco.trim(),
        forma_pagamento: pagamento,
        observacao: observacao.trim() || undefined,
        telefone_contato: telefone.trim(),
      };
      if (pagamento === "DINHEIRO") {
        body.troco_para = parseFloat(troco.replace(",", "."));
      }

      await api.post(`/pedidos/finalizar/${pedido.id}`, body);

      clearCart();
      navigate("/pedido-sucesso", { state: { pedidoId: pedido.id } });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erro ao finalizar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="font-black text-lg uppercase">Checkout</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
        {/* Resumo do carrinho */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h2 className="font-black text-sm uppercase text-slate-400 mb-3">Itens do pedido</h2>
          <div className="space-y-2">
            {currentCart.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-slate-700">
                  {item.quantity}x {item.product.nome}
                </span>
                <span className="font-bold">R$ {(item.product.preco * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between font-black text-base">
            <span>Total</span>
            <span className="text-orange-600">R$ {total.toFixed(2)}</span>
          </div>
        </section>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Endereço */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <h2 className="font-black text-sm uppercase text-slate-400 mb-3">Endereço de entrega</h2>
            <input
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, número, bairro, complemento..."
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
            />
          </section>

          {/* Telefone */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <h2 className="font-black text-sm uppercase text-slate-400 mb-3">Telefone de contato</h2>
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
            />
          </section>

          {/* Forma de pagamento */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <h2 className="font-black text-sm uppercase text-slate-400 mb-3">Forma de pagamento</h2>
            <div className="grid grid-cols-2 gap-2">
              {formasPagamento.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setPagamento(f.value)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                    pagamento === f.value
                      ? "border-orange-600 bg-orange-50 text-orange-700"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {f.icon}
                  <span className="truncate">{f.label}</span>
                  {pagamento === f.value && <Check className="w-4 h-4 ml-auto shrink-0" />}
                </button>
              ))}
            </div>

            {/* Troco (só se dinheiro) */}
            <AnimatePresence>
              {pagamento === "DINHEIRO" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Troco para quanto?</label>
                    <input
                      value={troco}
                      onChange={(e) => setTroco(e.target.value)}
                      placeholder="R$ 0,00"
                      type="text"
                      inputMode="decimal"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Observação */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <h2 className="font-black text-sm uppercase text-slate-400 mb-3">Observação</h2>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Alguma observação? Ex: sem cebola, ponto da carne..."
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm resize-none"
            />
          </section>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium"
              >
                <X className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botão finalizar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Finalizando...
              </>
            ) : (
              `Finalizar Pedido • R$ ${total.toFixed(2)}`
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
