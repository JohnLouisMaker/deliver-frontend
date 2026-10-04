import { AxiosError } from "axios";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Hamburger,
  Key,
  Lock,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/api";
import AuthSidebar from "../components/auth/AuthSidebar";
import { ROTAS } from "../routes/paths";

type Step = 1 | 2 | 3;

export default function RecoverPasswordPage() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleRequestCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setResetToken(res.data.reset_token);
      setStep(2);
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail?: string }>;
      setError(
        axiosErr.response?.data?.detail ||
          "Erro ao enviar código. Verifique o e-mail.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await api.post("/auth/verify-reset-code", {
        email,
        code,
        reset_token: resetToken,
      });
      setStep(3);
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail?: string }>;
      setError(
        axiosErr.response?.data?.detail ||
          "Código inválido ou expirado.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        code,
        reset_token: resetToken,
        new_password: newPassword,
      });
      setTimeout(() => navigate(ROTAS.login, { replace: true }), 2500);
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail?: string }>;
      setError(
        axiosErr.response?.data?.detail ||
          "Erro ao redefinir senha. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex font-sans bg-slate-50">
      <AuthSidebar
        title="RECUPERE"
        highlight="SUA SENHA"
        subtitle="EM SEGUNDOS."
      />

      <div className="w-full lg:w-2/5 bg-white flex items-center justify-center p-6 sm:p-8 lg:p-24">
        <div className="w-full max-w-md">
          {/* LOGO MOBILE */}
          <div className="flex lg:hidden justify-center items-center gap-4 z-10 mb-6">
            <div className="p-3 bg-white rounded-2xl shadow-lg border border-slate-100 -rotate-12 hover:rotate-0 transition-transform duration-500">
              <Hamburger className="text-orange-600 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-widest uppercase">
              Menuu DELIVER<span className="text-orange-600">.</span>
            </h1>
          </div>

          {step === 1 && (
            <>
              <header className="mb-6 text-center lg:text-left">
                <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
                  Esqueceu sua senha?
                </h3>
                <p className="text-slate-500 text-lg">
                  Digite seu e-mail para receber um código
                </p>
              </header>

              <form onSubmit={handleRequestCode} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start gap-3">
                    <AlertCircle className="text-red-600 w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

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
                      value={email}
                      onChange={(e) => setEmail(e.currentTarget.value)}
                      placeholder="seu@email.com"
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none transition-all text-slate-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                      disabled={isLoading}
                    />
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
                      Enviar código
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <header className="mb-6 text-center lg:text-left">
                <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
                  Código de verificação
                </h3>
                <p className="text-slate-500 text-lg">
                  Insira o código de 6 dígitos enviado para <strong>{email}</strong>
                </p>
              </header>

              <form onSubmit={handleVerifyCode} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start gap-3">
                    <AlertCircle className="text-red-600 w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Código
                  </label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      name="code"
                      type="text"
                      required
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.currentTarget.value)}
                      placeholder="000000"
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none transition-all text-slate-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                      disabled={isLoading}
                    />
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
                      Verificar código
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Alterar e-mail
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <header className="mb-6 text-center lg:text-left">
                <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
                  Redefinir senha
                </h3>
                <p className="text-slate-500 text-lg">
                  Escolha uma nova senha para sua conta
                </p>
              </header>

              <form onSubmit={handleResetPassword} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start gap-3">
                    <AlertCircle className="text-red-600 w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Nova senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      name="newPassword"
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.currentTarget.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none transition-all text-slate-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                      disabled={isLoading}
                    />
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
                      Redefinir senha
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </button>
              </form>
            </>
          )}

          <div className="mt-5 text-center">
            <p className="text-slate-500">
              Lembrou sua senha?{" "}
              <Link
                to={ROTAS.login}
                className="text-orange-600 font-bold hover:underline"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}