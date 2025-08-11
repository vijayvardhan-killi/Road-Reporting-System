import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/auth/AuthProvider'
import './index.css'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css';
import { Toaster } from './components/ui/sonner'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster />
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
