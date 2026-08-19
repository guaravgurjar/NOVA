import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root')!;

if (container.hasChildNodes()) {
  hydrateRoot(
    container,
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// Reveal the page now that styles (imported above) and React are loaded
document.body.classList.add('ready');
