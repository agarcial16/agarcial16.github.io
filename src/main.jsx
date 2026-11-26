import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import BootScreen from './components/BootScreen.jsx';
import { I18nProvider } from './i18n/index.jsx';
import { initAnalytics } from './lib/visitas.js';
import { initGameBoy } from './lib/gameboy.js';
import { initDevMode } from './lib/devmode.js';
import './index.css';

initAnalytics();
initGameBoy();
initDevMode();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nProvider>
      <BootScreen />
      <App />
    </I18nProvider>
  </React.StrictMode>,
);
