import { Route, Routes, Navigate } from "react-router";
import { useAuth } from "@clerk/react";
import Dashboard from "./pages/dashboard";
import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }
  return <>{children}</>;
}

export const RoutesComponent = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
    </Routes>
  );
};
