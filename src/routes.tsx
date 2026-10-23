import { Navigate, Route, Routes, useLocation } from "react-router";
import Overview from "./pages/overview";
import Feedback from "./pages/feedback";
import Feedbacks from "./pages/feedbacks";
import Members from "./pages/members";
import ProjectManagement from "./pages/projects";
import ProjectFeedbacks from "./pages/project-feedbacks";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import Profile from "./pages/profile";
import SelectOrg from "./pages/select-org";
import NoOrganization from "./pages/no-organization";
import NoAccess from "./pages/no-access";
import { AppLayout, AuthLayout } from "./layouts";
import { ProtectedRoute } from "./components/protected-route";
import { PublicRoute } from "./components/public-route";
import { HasOrganization } from "./components/has-organization";
import { NoOrganizationRoute } from "./components/no-organization-route";
import { AdminRoute } from "./components/admin-route";
import { useAuthStore } from "./store/auth";

export const RoutesComponent = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  return (
    <Routes>
      {/* Public routes without sidebar */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route index path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>

      </Route>

      {/* Feedback page - accessible to everyone */}
      <Route path="/feedback/:organizationSlug/:projectSlug" element={<Feedback />} />

      {/* Authenticated app routes with sidebar */}
      <Route element={<ProtectedRoute />}>
        <Route path="/select-org" element={<SelectOrg />} />
        <Route element={<NoOrganizationRoute />}>
          <Route path="/no-organization" element={<NoOrganization />} />
        </Route>
        <Route element={<HasOrganization />}>
          <Route element={<AppLayout />}>
            <Route path="/overview" element={<Overview />} />
            <Route path="/feedbacks" element={<Feedbacks />} />
            <Route path="/profile" element={<Profile />} />
            <Route element={<AdminRoute />}>
              <Route path="/members" element={<Members />} />
            </Route>
            <Route path="/projects/:slug" element={<ProjectManagement />} />
            <Route path="/projects/:slug/feedbacks" element={<ProjectFeedbacks />} />
          </Route>
        </Route>
      </Route>

      <Route path="/no-access" element={<NoAccess />} />

      {/* Catch-all: non-public resources redirect to /sign-in if unauthenticated, or / if authenticated */}
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? "/overview" : "/sign-in"}
            replace
            state={!isAuthenticated ? { from: location } : undefined}
          />
        }
      />
    </Routes>
  );
};
