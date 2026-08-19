import { AxiosError } from "axios";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  Hamburger,
  Key,
  Lock,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/api";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/authSchema";

type Step = 1 | 2 | 3;

export default function RecoverPasswordPage() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  /* ── Step 1: Enviar código para o email ── */
  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setFieldError(null);

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setFieldError(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setResetToken(res.data.reset_token);
      setStep(2);
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail?: string }>;
      setServerError(
        axiosErr.response?.data?.detail || "Erro ao enviar código",
      );
    } finally {
      setIsLoading(false);
    }
  }

  /* ── Step 2: Verificar código ── */
  function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setFieldError(null);

    if (!/^\d{6}$/.test(code)) {
      setFieldError("O código deve ter exatamente 6 dígitos numéricos");
      return;
    }
    setStep(3);
  }

  /* ── Step 3: Redefinir senha ── */
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setFieldError(null);

    const result = resetPasswordSchema.safeParse({
      code,
      password: newPassword,
      confirmPassword,
    });
    if (!result.success) {
      setFieldError(result.error.issues[0].message);
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
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail?: string }>;
      setServerError(
        axiosErr.response?.data?.detail || "Erro ao redefinir senha",
      );
    } finally {
      setIsLoading(false);
    }
  }

  /* ── Helpers de UI ── */
  function renderSteps() {
    return (
      <div className="flex items-center gap-2 mb-8">
        {([1, 2, 3] as Step[]).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= s
                  ? "bg-orange-600 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-8 h-0.5 ${
                  step > s ? "bg-orange-600" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  function renderError(msg: string | null) {
    if (!msg) return null;
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start gap-3">
        <AlertCircle className="text-red-600 w-5 h-5 shrink-0 mt-0.5" />
        <p className="text-red-700 text-sm font-medium">{msg}</p>
      </div>
    );
  }

  /* ── Render principal ── */
  return (
    <div className="min-h-screen flex font-sans bg-slate-50">
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
            ESQUECEU
            <br />
            <span className="bg-linear-to-r from-orange-100 to-orange-300 bg-clip-text text-transparent">
              SUA SENHA
            </span>
            <br />
            SEM PROBLEMAS.
          </h2>
          <div className="h-2 w-24 bg-white mb-8 rounded-full" />
          <p className="text-orange-50 text-xl font-medium opacity-80 leading-relaxed">
            Recupere o acesso à sua conta em poucos passos.
          </p>
        </div>

        <div className="flex justify-between items-center z-10 border-t border-white/10 pt-8">
          <span className="text-orange-200 text-sm font-semibold tracking-widest uppercase">
            © 2026 Menuu Deliver
          </span>
        </div>
      </div>

      <div className="w-full lg:w-2/5 bg-white flex items-center justify-center p-8 lg:p-24">
        <div className="w-full max-w-md">
          {success ? (
            <>
              <header className="mb-8 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Senha redefinida!
                </h3>
                <p className="text-slate-500">
                  Sua senha foi alterada com sucesso. Redirecionando para o
                  login...
                </p>
              </header>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
              </div>
            </>
          ) : step === 1 ? (
            <>
              {renderSteps()}
              <header className="mb-8 text-center lg:text-left">
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Recuperar senha
                </h3>
                <p className="text-slate-500">
                  Digite seu e-mail para receber um código de verificação.
                </p>
              </header>

              <form onSubmit={handleSendCode} className="space-y-6">
                {renderError(fieldError || serverError)}

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-slate-700"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 hover:bg-orange-600 disabled:bg-slate-400 text-white font-black py-4 rounded-2xl shadow-lg active:scale-[0.985] transition-all duration-200 flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Enviar código
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link
                  to="/login"
                  className="text-slate-500 hover:text-orange-600 font-medium transition-colors"
                >
                  ← Voltar ao login
                </Link>
              </div>
            </>
          ) : step === 2 ? (
            <>
              {renderSteps()}
              <header className="mb-8 text-center lg:text-left">
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Código enviado!
                </h3>
                <p className="text-slate-500">
                  Enviamos um código de 6 dígitos para{" "}
                  <span className="font-bold text-slate-700">{email}</span>
                </p>
              </header>

              <form onSubmit={handleVerifyCode} className="space-y-6">
                {renderError(fieldError || serverError)}

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Código de verificação
                  </label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="000000"
                      maxLength={6}
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      disabled={isLoading}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-slate-700 text-center text-2xl font-bold tracking-[0.5em]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 hover:bg-orange-600 disabled:bg-slate-400 text-white font-black py-4 rounded-2xl shadow-lg active:scale-[0.985] transition-all duration-200 flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Verificar código
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="w-full text-slate-500 hover:text-orange-600 font-medium text-sm py-2 transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Alterar e-mail
                </button>
              </form>
            </>
          ) : (
            <>
              {renderSteps()}
              <header className="mb-8 text-center lg:text-left">
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Redefinir senha
                </h3>
                <p className="text-slate-500">
                  Escolha uma nova senha para{" "}
                  <span className="font-bold text-slate-700">{email}</span>
                </p>
              </header>

              <form onSubmit={handleResetPassword} className="space-y-6">
                {renderError(fieldError || serverError)}

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Nova senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isLoading}
                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-slate-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Confirmar senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 hover:bg-orange-600 disabled:bg-slate-400 text-white font-black py-4 rounded-2xl shadow-lg active:scale-[0.985] transition-all duration-200 flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Redefinir senha
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={isLoading}
                  className="w-full text-slate-500 hover:text-orange-600 font-medium text-sm py-2 transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
