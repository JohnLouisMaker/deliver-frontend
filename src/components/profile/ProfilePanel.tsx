import { LogOut, Pencil, Settings, User, X } from "lucide-react";

interface ProfilePanelProps {
  user: { nome: string; email: string } | null;
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfilePanel({
  user,
  onClose,
  onLogout,
}: ProfilePanelProps) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-lg font-black uppercase">Minha conta</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar perfil"
          className="rounded-full bg-slate-100 p-1.5 transition-all hover:bg-orange-600 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-600 font-bold uppercase text-white">
          {user?.nome?.charAt(0) || <User className="h-5 w-5" />}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-700">
            {user?.nome || "Usuário"}
          </p>
          <p className="break-all text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>

      <div className="mb-3 space-y-1">
        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-500 opacity-75"
        >
          <Pencil className="h-4 w-4" />
          <span className="flex-1">Editar perfil</span>
        </button>
        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-500 opacity-75"
        >
          <Settings className="h-4 w-4" />
          <span className="flex-1">Preferências</span>
        </button>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
      >
        <LogOut className="h-4 w-4" />
        Sair da conta
      </button>
    </>
  );
}
