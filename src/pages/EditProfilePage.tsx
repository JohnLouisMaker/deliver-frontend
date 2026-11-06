import { AxiosError } from "axios";
import {
  ArrowLeft,
  ChevronRight,
  LogOut,
  Mail,
  Package,
  Pencil,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/api";
import SiteFooter from "../components/footer/SiteFooter";
import { ROTAS } from "../routes/paths";
import useAuthStore, { type User } from "../store/authStore";

const cardClass =
  "rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6";
const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500 disabled:opacity-60";

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className={`${cardClass} flex items-center gap-3`}>
      <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
        {icon}
      </div>
      <div>
        <p className="text-xl font-black">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-500">{label}</p>
        <p className="mt-1 truncate text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function FormField({
  id,
  label,
  icon,
  value,
  onChange,
  disabled,
  type = "text",
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  type?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-slate-700"
      >
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={type === "email" ? "email" : "name"}
          required
          maxLength={type === "email" ? 150 : 100}
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          disabled={disabled}
          placeholder={type === "email" ? "seu@email.com" : "Seu nome completo"}
          className={inputClass}
        />
      </div>
    </div>
  );
}

export default function EditProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [nome, setNome] = useState(user?.nome ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [pedidoCount, setPedidoCount] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "auto";
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    let active = true;
    api
      .get<Array<{ id: number }>>("/pedidos/meus_pedidos")
      .then(({ data }) => active && setPedidoCount(data.length))
      .catch(() => active && setPedidoCount(null));
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isEditing) return;
    setError(null);
    setIsSaved(false);
    const nomeAtualizado = nome.trim();
    const emailAtualizado = email.trim();
    if (!nomeAtualizado || !emailAtualizado) {
      setError("Preencha seu nome e e-mail.");
      return;
    }

    setIsSaving(true);
    try {
      const { data } = await api.patch<User>("/auth/me", {
        nome: nomeAtualizado,
        email: emailAtualizado,
      });
      setUser(data);
      setNome(data.nome);
      setEmail(data.email);
      setIsSaved(true);
      setIsEditing(false);
    } catch (err) {
      const axiosError = err as AxiosError<{
        detail?: string;
        message?: string;
      }>;
      setError(
        axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          "Não foi possível salvar suas alterações. Tente novamente.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setNome(user?.nome ?? "");
    setEmail(user?.email ?? "");
    setError(null);
    setIsSaved(false);
    setIsEditing(false);
  }

  function handleStartEditing() {
    if (isSaving) return;
    setIsEditing(true);
    setError(null);
    setIsSaved(false);
    requestAnimationFrame(() => {
      document.getElementById("profile-name")?.focus({ preventScroll: true });
    });
  }

  function handleLogout() {
    logout();
    navigate(ROTAS.login, { replace: true });
  }

  function scrollToSection(sectionId: string) {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const initials = nome.trim().charAt(0).toUpperCase();
  const navItems = [{ label: "Meu perfil", id: "perfil", icon: UserRound }];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-10 sm:px-6">
        <div className="flex items-center gap-2 py-5 text-sm text-slate-500">
          <Link
            to={ROTAS.cardapio}
            className="transition-colors hover:text-orange-600"
          >
            Início
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-semibold text-slate-700">Meu perfil</span>
        </div>

        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-600">
              Minha conta
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Meu perfil
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Seus dados e preferências de entrega.
            </p>
          </div>
          <Link
            to={ROTAS.cardapio}
            className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-orange-50 hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao cardápio
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <section className={cardClass}>
              <p className="mb-3 px-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                Minha conta
              </p>
              <nav className="space-y-1">
                {navItems.map(({ label, id, icon: Icon }, index) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => scrollToSection(id)}
                    aria-current={index === 0 ? "page" : undefined}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-colors ${index === 0 ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"}`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </button>
                ))}
              </nav>
              <div className="mt-5 rounded-2xl bg-orange-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-orange-600">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-black">Sua conta Menuu</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  Mantenha seus dados atualizados para agilizar seus próximos
                  pedidos.
                </p>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
                >
                  <LogOut className="h-4 w-4" />
                  Sair do sistema
                </button>
              </div>
            </section>
          </aside>
          <div className="min-w-0 space-y-5">
            <section
              id="perfil"
              className="overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-r from-white via-white to-orange-50 p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-orange-600 text-2xl font-black text-white shadow-lg shadow-orange-200">
                    {initials || <UserRound className="h-8 w-8" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-2xl font-black">
                        {nome || "Seu nome"}
                      </h2>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${user?.ativo ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {user?.ativo ? "Conta ativa" : "Conta"}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {email || "seu@email.com"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard
                icon={<Package className="h-5 w-5" />}
                value={pedidoCount === null ? "—" : pedidoCount.toString()}
                label="Pedidos realizados"
              />
              <StatCard
                icon={<ShieldCheck className="h-5 w-5" />}
                value={user?.ativo ? "Ativa" : "—"}
                label="Situação da conta"
              />
            </div>

            <section id="editar-conta" className={cardClass}>
              <div className="mb-5 flex items-start gap-3">
                <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-black">Informações pessoais</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Dados associados à sua conta Menuu.
                  </p>
                </div>
                <span
                  className={`ml-auto inline-flex w-36 shrink-0 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${isEditing ? "bg-orange-50 text-orange-700" : "bg-slate-100 text-slate-500"}`}
                >
                  {isEditing ? (
                    <Pencil className="h-3.5 w-3.5" />
                  ) : (
                    <ShieldCheck className="h-3.5 w-3.5" />
                  )}
                  {isEditing ? "Edição habilitada" : "Somente leitura"}
                </span>
              </div>
              <form onSubmit={handleSubmit}>
                {error && (
                  <p
                    role="alert"
                    className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                  >
                    {error}
                  </p>
                )}
                {isSaved && (
                  <p
                    role="status"
                    className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
                  >
                    Perfil atualizado com sucesso.
                  </p>
                )}
                <div className="grid">
                  <div
                    aria-hidden={!isEditing}
                    className={`col-start-1 row-start-1 ${isEditing ? "" : "invisible"}`}
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        id="profile-name"
                        label="Nome completo"
                        icon={<UserRound className="h-4 w-4" />}
                        value={nome}
                        onChange={setNome}
                        disabled={!isEditing || isSaving}
                      />
                      <FormField
                        id="profile-email"
                        label="E-mail"
                        icon={<Mail className="h-4 w-4" />}
                        value={email}
                        onChange={setEmail}
                        disabled={!isEditing || isSaving}
                        type="email"
                      />
                    </div>
                    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={!isEditing || isSaving}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-60"
                      >
                        <X className="h-4 w-4" />
                        Descartar
                      </button>
                      <button
                        type="submit"
                        disabled={!isEditing || isSaving}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60"
                      >
                        {isSaving ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {isSaving ? "Salvando..." : "Salvar alterações"}
                      </button>
                    </div>
                  </div>
                  <div
                    aria-hidden={isEditing}
                    className={`col-start-1 row-start-1 ${isEditing ? "invisible" : ""}`}
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <InfoBox
                        label="Nome completo"
                        value={nome || "Não informado"}
                      />
                      <InfoBox
                        label="E-mail"
                        value={email || "Não informado"}
                      />
                    </div>
                    <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
                      <button
                        type="button"
                        onClick={handleStartEditing}
                        disabled={isEditing}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
                      >
                        <Pencil className="h-4 w-4" />
                        Editar informações
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter rota={ROTAS.cardapio} />
    </div>
  );
}
