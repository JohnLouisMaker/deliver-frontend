import { Hamburger } from "lucide-react";

interface AuthSidebarProps {
  title: string;
  highlight: string;
  subtitle: string;
}

export default function AuthSidebar({
  title,
  highlight,
  subtitle,
}: AuthSidebarProps) {
  return (
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
          {title} <br />
          <span className="bg-linear-to-r from-orange-100 to-orange-300 bg-clip-text text-transparent">
            {highlight}
          </span>
          <br />
          {subtitle}
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
  );
}