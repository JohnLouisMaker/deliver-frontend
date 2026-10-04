import { AxiosError } from "axios";
import {
  AlertCircle,
  ArrowRight,
  Hamburger,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import api from "../api/api";
import AuthSidebar from "../components/auth/AuthSidebar";
import { ROTAS } from "../routes/paths";
import useAuthStore from "../store/authStore";

export default function SignUpPage() {
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

  async function criarConta(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    const form = e.currentTarget;
    const nome = (form.querySelector('[name="nome"]') as HTMLInputElement)
      .value;
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)
      .value;
    const password = (
      form.querySelector('[name="password"]') as HTMLInputElement
    ).value;
    const confirmPassword = (
      form.querySelector('[name="confirmPassword"]') as HTMLInputElement
    ).value;

    /* ponytail: validação extra de senhas no frontend */
    if (password !== confirmPassword) {
      setServerError("As senhas não coincidem.");
      return;
    }

    try {
      const response = await api.post("/auth/signup", {
        nome,
        email,
        senha: password,
      });

      const { access_token, refresh_token } = response.data;
      await login(access_token, refresh_token);
    } catch (err) {
      const axiosError = err as AxiosError<{ detail?: string }>;
      const message =
        axiosError.response?.data?.detail ||
        "Erro ao criar conta. Tente novamente.";
      setServerError(message);
    }
  }

  return (
    <div className="min-h-screen flex font-sans bg-slate-50">
      <AuthSidebar title="CRIE SUA" highlight="CONTA" subtitle="E PEÇA JÁ." />

      <div className="w-full lg:w-2/5 bg-white flex items-center justify-center p-6 sm:p-8 lg:p-24">
        <div className="w-full max-w-md">
          {/* LOGO MOBILE */}
          <div className="flex lg:hidden justify-center items-center gap-4 z-10 mb-8">
            <div className="p-3 bg-white rounded-2xl shadow-lg border border-slate-100 -rotate-12 hover:rotate-0 transition-transform duration-500">
              <Hamburger className="text-orange-600 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-widest uppercase">
              Menuu DELIVER<span className="text-orange-600">.</span>
            </h1>
          </div>

          <header className="mb-5 text-center lg:text-left">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
              Criar conta
            </h3>
            <p className="text-slate-500 text-lg">
              Preencha os dados abaixo para começar
            </p>
          </header>

          <form onSubmit={criarConta} className="space-y-6">
            {serverError && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-600 w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium">
                  {serverError}
                </p>
              </div>
            )}

            <div className="space-y-5">
              {/* Nome Completo */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="nome"
                    type="text"
                    required
                    minLength={3}
                    placeholder="João Silva"
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none transition-all text-slate-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                    disabled={isLoading}
                  />
                </div>
              </div>

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

              {/* Confirmar Senha */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Confirmar senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="confirmPassword"
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
                  Criar minha conta
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-slate-500">
              Já tem uma conta?{" "}
              <Link
                to={ROTAS.login}
                className="text-orange-600 font-bold hover:underline"
              >
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
