import {
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api, { type PedidoResponse } from "../api/api";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDENTE: {
    label: "Pendente",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    icon: <Clock className="w-4 h-4" />,
  },
  FINALIZADO: {
    label: "Finalizado",
    color: "text-green-600 bg-green-50 border-green-200",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  CANCELADO: {
    label: "Cancelado",
    color: "text-red-600 bg-red-50 border-red-200",
    icon: <XCircle className="w-4 h-4" />,
  },
};

const pagamentoLabels: Record<string, string> = {
  DINHEIRO: "Dinheiro",
  CARTAO_CREDITO: "Cartão de Crédito",
  CARTAO_DEBITO: "Cartão de Débito",
  PIX: "Pix",
  VALE_ALIMENTACAO: "Vale Alimentação",
};

export default function MeusPedidosPage() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    api.get<PedidoResponse[]>("/pedidos/meus_pedidos")
      .then((res) => setPedidos(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="font-black text-lg uppercase">Meus Pedidos</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-3">
        {pedidos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Nenhum pedido ainda</p>
            <button
              onClick={() => navigate("/home")}
              className="mt-4 text-orange-600 font-bold text-sm hover:underline"
            >
              Fazer primeiro pedido
            </button>
          </div>
        ) : (
          pedidos.map((pedido) => {
            const status = statusConfig[pedido.status] || statusConfig.PENDENTE;
            const isExpanded = expandedId === pedido.id;

            return (
              <div
                key={pedido.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : pedido.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="space-y-1">
                    <p className="font-black text-sm">Pedido #{pedido.id}</p>
                    <p className="text-xs text-slate-400">
                      {pedido.created_at
                        ? new Date(pedido.created_at).toLocaleString("pt-BR")
                        : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </span>
                    <span className="font-black text-sm text-orange-600">
                      R$ {pedido.preco.toFixed(2)}
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
                    <div className="text-xs text-slate-500 space-y-1">
                      <p><span className="font-bold text-slate-700">Endereço:</span> {pedido.endereco_entrega || "—"}</p>
                      <p><span className="font-bold text-slate-700">Pagamento:</span> {pagamentoLabels[pedido.forma_pagamento || ""] || pedido.forma_pagamento || "—"}</p>
                      {pedido.troco_para && (
                        <p><span className="font-bold text-slate-700">Troco:</span> R$ {pedido.troco_para.toFixed(2)}</p>
                      )}
                      {pedido.observacao && (
                        <p><span className="font-bold text-slate-700">Obs:</span> {pedido.observacao}</p>
                      )}
                      <p><span className="font-bold text-slate-700">Tel:</span> {pedido.telefone_contato || "—"}</p>
                    </div>

                    <div className="text-xs space-y-1.5">
                      <p className="font-bold text-slate-700 uppercase tracking-wider">Itens</p>
                      {pedido.itens?.map((item) => (
                        <div key={item.id} className="flex justify-between text-slate-600">
                          <span>{item.quantidade}x item #{item.item_id}</span>
                          <span>R$ {(item.preco_unitario * item.quantidade).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
