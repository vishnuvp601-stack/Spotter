import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SpotterDataProvider } from './state/SpotterDataContext'
import { AuthGate } from './components/AuthGate'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpotterDataProvider>
      <AuthGate>
        <App />
      </AuthGate>
    </SpotterDataProvider>
  </StrictMode>,
)
