import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import './index.css'
import './i18n'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AuthProvider>
  </StrictMode>,
)
