import { Navigate, Route, Routes, useLocation } from "react-router";
import Dashboard from "./pages/dashboard";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import { AppLayout, AuthLayout } from "./layouts";
import { ProtectedRoute } from "./components/protected-route";
import { PublicRoute } from "./components/public-route";
import { useAuthStore } from "./store/auth";

export const RoutesComponent = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  return (
    <Routes>
      {/* Public routes without sidebar */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
      </Route>

      {/* Authenticated app routes with sidebar */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>

      {/* Catch-all: non-public resources redirect to /sign-in if unauthenticated, or / if authenticated */}
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? "/" : "/sign-in"}
            replace
            state={!isAuthenticated ? { from: location } : undefined}
          />
        }
      />
    </Routes>
  );
};
