import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#f8d7da', color: '#721c24', borderRadius: '8px', margin: '2rem'  }}>
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap'  }}>{this.state.error?.toString()}</pre>
          <button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1rem', marginTop: '1rem', cursor: 'pointer'  }}>Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}


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

import { NotificationProvider } from './context/NotificationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ErrorBoundary>
  </StrictMode>,
)


