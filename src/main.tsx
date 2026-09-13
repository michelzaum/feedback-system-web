import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";

import './index.css'
import { RoutesComponent } from './routes.tsx';
import App from './App.tsx';
import { Toaster } from './components/ui/sonner.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App>
        <RoutesComponent />
        <Toaster richColors />
      </App>
    </BrowserRouter>,
  </StrictMode>,
)
