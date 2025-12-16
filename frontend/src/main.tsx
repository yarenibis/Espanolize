import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HelmetProvider } from 'react-helmet-async'
import React from 'react'

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
)
