import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useLocation } from "react-router";
import { ClerkProvider } from '@clerk/react';

import './index.css';
import { RoutesComponent } from './routes.tsx';
import App from './App.tsx';
import { Toaster } from './components/ui/sonner.tsx';

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/sign-in" || location.pathname === "/sign-up";
  return isAuthPage ? <>{children}</> : <App>{children}</App>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <LayoutWrapper>
          <RoutesComponent />
          <Toaster richColors />
        </LayoutWrapper>
      </BrowserRouter>,
    </ClerkProvider>
  </StrictMode>,
)
