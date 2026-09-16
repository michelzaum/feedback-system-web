import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="w-xl">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
