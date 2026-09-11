import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";

import './index.css'
import { RoutesComponent } from './routes.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <RoutesComponent />
    </BrowserRouter>,
  </StrictMode>,
)
