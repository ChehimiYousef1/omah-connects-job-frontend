import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';
import './styles/global.css';
const container = document.getElementById('root');

if (!container) throw new Error('Root container missing in index.html');

createRoot(container).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GlobalErrorBoundary>
  </React.StrictMode>
);
