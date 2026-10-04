import { AxiosError } from "axios";
import { AlertCircle, ArrowRight, Hamburger, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import api from "../api/api";
import AuthSidebar from "../components/auth/AuthSidebar";
import { ROTAS } from "../routes/paths";
import useAuthStore from "../store/authStore";

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname || ROTAS.cardapio;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnTo, { replace: true });
    }
  }, [isAuthenticated, navigate, returnTo]);

  async function entrarNaConta(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    const form = e.currentTarget;
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)
      .value;
    const password = (
      form.querySelector('[name="password"]') as HTMLInputElement
    ).value;

    try {
      const response = await api.post("/auth/login", {
        email,
        senha: password,
      });

      const { access_token, refresh_token } = response.data;
      await login(access_token, refresh_token);
    } catch (err) {
      const axiosError = err as AxiosError<{ detail?: string }>;
      const message =
        axiosError.response?.data?.detail || "E-mail ou senha incorretos.";
      setServerError(message);
    }
  }

  return (
    <div className="min-h-screen flex font-sans bg-slate-50">
      <AuthSidebar title="MATE SUA" highlight="FOME" subtitle="EM UM CLIQUE." />

      <div className="w-full lg:w-2/5 bg-white flex items-center justify-center p-6 sm:p-8 lg:p-24">
        <div className="w-full max-w-md">
          {/* Cabeçalho Mobile */}
          <div className="flex lg:hidden justify-center items-center gap-3 z-10 mb-8">
            <div className="p-2.5 bg-white border border-orange-100 rounded-2xl shadow-lg -rotate-12 hover:rotate-0 transition-transform duration-500">
              <Hamburger className="text-orange-600 w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-widest uppercase">
              Menuu DELIVER<span className="text-orange-600">.</span>
            </h1>
          </div>

          <header className="mb-10 text-center lg:text-left">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Bem-vindo de volta
            </h3>
            <p className="text-slate-500 text-lg">
              Insira suas credenciais para continuar
            </p>
          </header>

          <form onSubmit={entrarNaConta} className="space-y-6">
            {serverError && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-600 w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium">
                  {serverError}
                </p>
              </div>
            )}

            <div className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none transition-all text-slate-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none transition-all text-slate-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-orange-600 disabled:bg-slate-400 text-white font-black py-4 rounded-2xl shadow-lg active:scale-[0.985] transition-all duration-200 flex items-center justify-center gap-3 group uppercase tracking-widest"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Entrar na Conta
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div>
            <div className="flex mt-10 justify-center items-center gap-1">
              <p className="text-slate-500">Esqueceu a senha?{""}</p>
              <Link
                to={ROTAS.recuperarSenha}
                className="text-orange-600 font-bold hover:underline"
              >
                Resete aqui
              </Link>
            </div>
            <div className="flex justify-center items-center">
              <p className="text-slate-500">
                Não tem uma conta?{" "}
                <Link
                  to={ROTAS.cadastro}
                  className="text-orange-600 font-bold hover:underline"
                >
                  Criar conta grátis
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
