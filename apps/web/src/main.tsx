import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/instrument-sans/400.css';
import '@fontsource/instrument-sans/500.css';
import '@fontsource/instrument-sans/600.css';
import '@fontsource/instrument-serif/400.css';
import './styles.css';
import { applyTextSize } from './store/textSize';
import { applyTheme } from './store/theme';
import { finishConnect } from './assistant/openrouter';
import { openAssistant } from './assistant/Assistant';

applyTextSize();
applyTheme();
// returning from OpenRouter: swap the one-time code for the student's key, then open the assistant
finishConnect().then(back => { if (back) { if (location.hash !== back) location.hash = back; setTimeout(() => openAssistant(), 50); } });

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
