import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const footerGroups = [
  {
    title: "Descobrir",
    items: ["Sabores da cidade", "Novos favoritos"],
  },
  {
    title: "Nossa ideia",
    items: ["Bons momentos", "Comida que aproxima"],
  },
  {
    title: "Menuu",
    items: ["Para dividir", "Para deixar o dia melhor"],
  },
];

interface SiteFooterProps {
  rota?: string;
}

export default function SiteFooter({ rota }: SiteFooterProps) {
  return (
    <footer className="mt-8 border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-8">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <p className="text-base font-black uppercase tracking-tight text-slate-800">
              Menuu<span className="text-orange-600">.</span>
            </p>

            <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-500">
              Um jeito gostoso de encontrar sabores para cada momento.
            </p>

            {rota && (
              <Link
                to={rota}
                className="group mt-4 inline-flex items-center gap-1 text-xs font-semibold text-orange-600 transition-colors hover:text-orange-500"
              >
                Explorar o cardápio
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-xs font-bold text-slate-700">
                {group.title}
              </h2>

              <ul className="mt-2 space-y-1.5">
                {group.items.map((item) => (
                  <li key={item} className="text-xs text-slate-500">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
