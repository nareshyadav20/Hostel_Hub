import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { NotificationProvider } from './context/NotificationContext.jsx'

// Render backend warmup ping
(function warmupBackend() {
  const API_URL = import.meta.env.VITE_API_URL || 'https://livora-hostel-hub-1.onrender.com/api';
  const healthEndpoint = API_URL.endsWith('/api') ? `${API_URL}/health` : `${API_URL}/api/health`;
  console.log(`📡 Warming up Render backend: ${healthEndpoint}`);
  fetch(healthEndpoint)
    .then(res => res.json())
    .then(data => console.log('✅ Render backend warmed up successfully:', data))
    .catch(err => console.warn('⚠️ Render backend warmup ping failed:', err));
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </StrictMode>,
)

