import { CheckCircle, Home } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROTAS } from "../routes/paths";

export default function PedidoSucessoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const pedidoId = (location.state as { pedidoId?: number })?.pedidoId;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 max-w-sm w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <div>
          <h1 className="text-xl font-black text-slate-800 mb-1">
            Pedido realizado!
          </h1>
          <p className="text-slate-500 text-sm">
            Seu pedido foi enviado para a cozinha.
          </p>
        </div>

        {pedidoId && (
          <p className="text-xs text-slate-400 font-medium">
            Pedido #{pedidoId}
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate(ROTAS.cardapio)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-all"
          >
            <Home className="w-4 h-4" />
            Voltar ao Cardápio
          </button>
        </div>
      </div>
    </div>
  );
}
