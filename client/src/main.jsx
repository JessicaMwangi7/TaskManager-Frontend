import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';  // ✅ add here

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>   {/* ✅ router OUTSIDE */}
      <AuthProvider>  {/* ✅ provider INSIDE router */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
