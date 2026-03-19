import { ArrowRight, Hamburger, Lock, Mail } from "lucide-react";
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //FUNÇÃO PARA O SUBMIT DO FORMULARIO DE LOGIN
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const credentials = { email, password };
    console.log("Enviando:", credentials);
  };

  return (
    // DIV PRINCIPAL
    <div className="min-h-screen flex font-sans bg-white">
      {/* LADO ESQUERDA DA TELA */}
      <div className="hidden md:flex md:w-1/2 bg-orange-500 flex-col justify-between p-16 relative overflow-hidden">
        <div className="flex items-center gap-3 z-10 relative">
          <div className="p-3 bg-white rounded-2xl shadow-lg transform -rotate-6">
            <Hamburger className="text-orange-500 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
            Menuu Deliver
          </h1>
        </div>

        <div className="z-10 relative">
          <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tight">
            O sabor que <br /> você ama, <br /> num click!!!
          </h2>
          <p className="text-orange-100 text-lg mt-8 max-w-sm font-medium opacity-90">
            Acesse sua conta e peça os melhores pratos da região agora mesmo.
          </p>
        </div>

        <div className="text-orange-200 text-sm z-10 relative">
          © 2026 Menuu Deliver.
        </div>
      </div>

      {/* LADO DIREITO DA TELA */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="md:hidden flex flex-col items-center mb-10">
            <div className="p-4 bg-orange-500 rounded-3xl shadow-xl mb-4">
              <Hamburger className="text-white w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-orange-600 uppercase tracking-tighter">
              OrangeFood
            </h2>
          </div>

          <div className="text-left">
            <h3 className="text-4xl font-black text-gray-900 tracking-tight">
              Login
            </h3>
            <p className="text-gray-500 mt-2 font-medium">
              Bom ver você de novo! Por favor, entre com seus dados.
            </p>
          </div>

          {/* FORMULARIO DE LOGIN */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {/*EMAIL*/}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  E-mail
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors w-5 h-5" />
                  <input
                    type="email"
                    placeholder="email@exemplo.com"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all duration-300 font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/*SENHA*/}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Senha
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors w-5 h-5" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all duration-300 font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* RECUPERAR SENHA */}
            <div className="flex items-center justify-between text-sm px-1">
              <button
                type="button"
                className="text-orange-600 font-bold hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* BOTÃO ENTRAR */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
            >
              ENTRAR
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
