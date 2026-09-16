import { Route, Routes } from "react-router";
import Dashboard from "./pages/dashboard";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";

export const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route index element={<Dashboard />} />
    </Routes>
  );
};
