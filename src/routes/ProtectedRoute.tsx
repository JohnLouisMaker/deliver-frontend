import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { ROTAS } from "./paths";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-medium text-lg">
            Validando acesso...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROTAS.login} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
