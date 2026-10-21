import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CurrencyProvider } from './context/CurrencyContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CurrencyProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
