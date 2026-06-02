import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { AlertCircle, ArrowRight, Hamburger, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/api";
import { type LoginData, loginSchema } from "../schemas/authSchema";
import useAuthStore from "../store/authStore";

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // React Hook Form com Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  // Redireciona se já estiver autenticado (Segurança extra)
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function onSubmit(data: LoginData) {
    setServerError(null);

    try {
      // 1. Faz a chamada de login para obter os tokens
      const response = await api.post("/auth/auth/login", {
        email: data.email,
        senha: data.password,
      });

      const { access_token, refresh_token } = response.data;

      // 2. Chama a função login da store que configuramos (ela busca o /me e salva tokens)
      await login(access_token, refresh_token);

      // O redirecionamento acontece via o useEffect de isAuthenticated
    } catch (err) {
      const axiosError = err as AxiosError<{ detail?: string }>;
      const message =
        axiosError.response?.data?.detail || "E-mail ou senha incorretos.";
      setServerError(message);
    }
  }

  return (
    <div className="min-h-screen flex font-sans bg-slate-50">
      {/* LADO ESQUERDO - DESKTOP (Mantive seu design incrível) */}
      <div className="hidden lg:flex lg:w-3/5 bg-orange-600 flex-col justify-between p-20 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />

        <div className="flex items-center gap-4 z-10">
          <div className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl -rotate-12 hover:rotate-0 transition-transform duration-500">
            <Hamburger className="text-orange-600 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">
            Menuu DELIVER<span className="text-orange-200">.</span>
          </h1>
        </div>

        <div className="z-10 max-w-xl">
          <h2 className="text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase mb-6">
            MATE SUA <br />
            <span className="bg-linear-to-r  from-orange-100 to-orange-300 bg-clip-text display  text-transparent ">
              FOME
            </span>
            <br />
            EM UM CLIQUE.
          </h2>
          <div className="h-2 w-24 bg-white mb-8 rounded-full" />
          <p className="text-orange-50 text-xl font-medium opacity-80 leading-relaxed">
            A plataforma definitiva para quem busca rapidez, sabor e os melhores
            restaurantes da cidade em um só lugar.
          </p>
        </div>

        <div className="flex justify-between items-center z-10 border-t border-white/10 pt-8">
          <span className="text-orange-200 text-sm font-semibold tracking-widest uppercase">
            © 2026 Menuu Deliver
          </span>
        </div>
      </div>

      {/* LADO DIREITO - FORMULÁRIO */}
      <div className="w-full lg:w-2/5 bg-white flex items-center justify-center p-8 lg:p-24">
        <div className="w-full max-w-md">
          <header className="mb-10 text-center lg:text-left">
            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Bem-vindo de volta
            </h3>
            <p className="text-slate-500 text-lg">
              Insira suas credenciais para continuar
            </p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  <Mail
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.email ? "text-red-400" : "text-slate-400"}`}
                  />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="seu@email.com"
                    className={`w-full pl-12 pr-5 py-4 bg-slate-50 border rounded-2xl focus:bg-white outline-none transition-all text-slate-700 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 font-bold">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Senha */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.password ? "text-red-400" : "text-slate-400"}`}
                  />
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-5 py-4 bg-slate-50 border rounded-2xl focus:bg-white outline-none transition-all text-slate-700 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 font-bold">
                    {errors.password.message}
                  </p>
                )}
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

          <div className="mt-10 text-center">
            <p className="text-slate-500">
              Não tem uma conta?{" "}
              <Link
                to="/signup"
                className="text-orange-600 font-bold hover:underline"
              >
                Criar conta grátis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
