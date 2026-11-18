import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { I18nProvider } from './i18n/index.jsx';
import { initAnalytics } from './lib/analytics.js';
import { initGameBoy } from './lib/gameboy.js';
import './index.css';

initAnalytics();
initGameBoy();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>,
);
