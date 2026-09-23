import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RentalProvider } from './context/RentalContext';
import ErrorBoundary from './shared/ErrorBoundary';
import '../style.css';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <RentalProvider>
          <App />
        </RentalProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error("Target container #root not found in document.");
}
