import { ArrowRight, Hamburger, Lock, Mail } from "lucide-react";
import React, { useState } from "react";

import "../index.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Enviando:", { email, password });
  };

  return (
    <div className="min-h-screen flex font-sans bg-slate-50">
      {/* LADO ESQUERDO - DESKTOP */}
      <div className="hidden lg:flex lg:w-3/5 bg-orange-600 flex-col justify-between p-20 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="flex items-center gap-4 z-10">
          <div className="p-3 bg-white backdrop-blur-md rounded-2xl shadow-2xl transform hover:rotate-0 -rotate-12 transition-transform duration-500">
            <Hamburger className="text-orange-600 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-heading font-black text-white tracking-widest uppercase">
            Menuu DELIVER<span className="text-orange-200">.</span>
          </h1>
        </div>

        <div className="z-10 max-w-xl">
          <h2 className="text-8xl font-heading font-black text-white leading-[0.85] tracking-tighter uppercase mb-6">
            MATE SUA <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-100 to-orange-300">
              FOME
            </span>
            <br />
            EM UM CLIQUE.
          </h2>
          <div className="h-2 w-24 bg-white mb-8 rounded-full"></div>
          <p className="text-orange-50 text-xl font-medium opacity-80 leading-relaxed">
            A plataforma definitiva para quem busca rapidez, sabor e os melhores
            restaurantes da cidade em um só lugar.
          </p>
        </div>

        <div className="flex justify-between items-center z-10 border-t border-white/10 pt-8">
          <span className="text-orange-200 text-sm font-semibold tracking-widest uppercase">
            © 2026 Menuu Deliver
          </span>
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
            <div className="w-2 h-2 rounded-full bg-white opacity-20"></div>
            <div className="w-2 h-2 rounded-full bg-white opacity-20"></div>
          </div>
        </div>
      </div>

      {/* LADO DIREITO: FORMULÁRIO */}
      <div className="w-full lg:w-2/5 bg-white flex items-center justify-center p-8 lg:p-24 relative">
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <div className="lg:hidden flex flex-col items-center mb-12">
            <div className="p-4 bg-orange-600 rounded-3xl shadow-2xl mb-4 rotate-3">
              <Hamburger className="text-white w-10 h-10" />
            </div>
            <h2 className="text-3xl font-heading font-black text-orange-600 uppercase tracking-tighter">
              Menuu
            </h2>
          </div>

          <header className="mb-10">
            <h3 className="text-4xl text-center lg:text-left font-heading font-extrabold text-slate-900 tracking-tight mb-3">
              Bem-vindo de volta
            </h3>
            <p className="text-slate-500 font-medium text-lg text-center lg:text-left">
              Insira suas credenciais para acessar sua mesa.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* EMAIL */}
              <div className="group">
                <label 
                htmlFor="email"
                className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 group-focus-within:text-orange-600 transition-colors">
                  Endereço de E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    placeholder="nome@exemplo.com"
                    className="w-full pl-12 pr-4 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-[6px] focus:ring-orange-50 outline-none transition-all duration-300 font-semibold text-slate-700 placeholder:text-slate-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* SENHA */}
              <div className="group">
                <div className="flex justify-between items-end mb-2">
                  <label
                  htmlFor="login-password"
                  className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-orange-600 transition-colors">
                    Senha
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors w-5 h-5" />
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-[6px] focus:ring-orange-50 outline-none transition-all duration-300 font-semibold text-slate-700 placeholder:text-slate-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="text-xs font-bold text-slate-400 hover:text-orange-700 transition-colors"
                >
                  Esqueceu a Senha?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-orange-600 text-white font-bold py-5 rounded-2xl shadow-2xl shadow-slate-200 hover:shadow-orange-200 active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-3 group overflow-hidden relative"
            >
              <span className="z-10 flex items-center gap-2 uppercase tracking-widest">
                Entrar na Conta
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
          </form>

          <footer className="mt-12 text-center">
            <p className="text-slate-500 font-medium">
              Não tem uma conta?
              <button className="text-orange-600 font-bold hover:underline underline-offset-4 ml-1">
                Criar conta grátis
              </button>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
