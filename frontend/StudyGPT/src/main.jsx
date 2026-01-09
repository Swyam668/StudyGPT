// for development purposes to find bugs -- uses mutliple techniques (you can look into it)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// for toast notfications
import {Toaster} from 'react-hot-toast';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* the function we created to wrap and provide values to all children */}
    <AuthProvider>
      {/* wrapping it aorund app so that it is available to all components and everyone can pop notification up (like toast notifications) */}
    <Toaster position="top-right" toastOptions={{duration: 3000}} /> 
      <App />
    </AuthProvider>
  </StrictMode>,
)
