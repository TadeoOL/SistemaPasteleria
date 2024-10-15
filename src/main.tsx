import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ThemeCustomization from './themes/index.tsx';
import Locales from './components/Locales.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeCustomization>
      <Locales>
        <App />
      </Locales>
    </ThemeCustomization>
  </StrictMode>
);
