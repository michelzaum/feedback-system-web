import { Route, Routes } from "react-router";
import Dashboard from "./pages/dashboard";

export const RoutesComponent = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
    </Routes>
  );
};
