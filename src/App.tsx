import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Páginas
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage"; // Importe sua nova página

// Store e Componentes de Proteção
import useAuthStore from "./store/authStore";

export default function App() {
  const { isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Tenta recuperar a sessão (refresh token, etc) ao carregar o app
    initializeAuth();
  }, [initializeAuth]);

  // Enquanto verifica se o usuário está logado, mostra o loader global
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-medium text-lg">
            Validando acesso...
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* --- ROTAS PÚBLICAS --- */}
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/signup" element={<SignupPage />} /> */}

        {/* --- ROTAS PROTEGIDAS --- */}
        <Route path="/home" element={<HomePage />} />

        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
              <h1 className="font-black text-orange-600 text-6xl mb-4">404</h1>
              <p className="text-slate-600 text-xl font-bold mb-6">
                OPS! PÁGINA NÃO ENCONTRADA
              </p>
              <button
                onClick={() => window.history.back()}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors"
              >
                VOLTAR
              </button>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
