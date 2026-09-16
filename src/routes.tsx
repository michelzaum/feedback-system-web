import { Route, Routes } from "react-router";
import Dashboard from "./pages/dashboard";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import { AppLayout, AuthLayout } from "./layouts";

export const RoutesComponent = () => {
  return (
    <Routes>
      {/* Auth routes without sidebar */}
      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Route>

      {/* Authenticated app routes with sidebar */}
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
};
