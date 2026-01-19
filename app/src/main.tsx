import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/shared/ErrorBoundary';
import './index.css';

// Force light mode on initial load
document.documentElement.classList.remove('dark');
if (localStorage.getItem('theme') === 'dark') {
  localStorage.setItem('theme', 'light');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
