import { useEffect, useState } from 'react';

export const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    script.onload = () => {
      if (window.Telegram?.WebApp) {
        const twa = window.Telegram.WebApp;
        twa.ready();
        setWebApp(twa);
        setIsReady(true);
      }
    };
    document.body.appendChild(script);
  }, []);

  return { webApp, isReady };
};

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}
