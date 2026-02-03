import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './Context/AuthContext.jsx'
import { GoalProvider } from './Context/GoalContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <GoalProvider>
        <App/>
      </GoalProvider>
    </AuthProvider>
  </StrictMode>,
)
