import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'pwa_banner_dismissed_date';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallBanner() {
  const [visible, setVisible]     = useState(false);
  const deferredPrompt             = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Already installed as PWA → don't show
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Dismissed today → don't show
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === new Date().toDateString()) return;

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      // Show banner after 1.2 s so the page loads first
      setTimeout(() => setVisible(true), 1200);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Clean up after successful install
    window.addEventListener('appinstalled', () => setVisible(false));

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt.current) return;
    await deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === 'accepted') setVisible(false);
    deferredPrompt.current = null;
  };

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toDateString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="تثبيت التطبيق"
      style={{
        position: 'fixed',
        bottom: visible ? 20 : -160,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(430px, calc(100% - 32px))',
        zIndex: 9999,
        transition: 'bottom 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div style={{
        background: 'linear-gradient(135deg, #111009 0%, #1a1505 100%)',
        border: '1px solid rgba(245,200,0,0.28)',
        borderRadius: 20,
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset',
      }}>
        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          overflow: 'hidden', background: '#f5c800',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img
            src="/favicon-32.png"
            alt="بروستو"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.textContent = '🍔';
            }}
          />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ display: 'block', color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 3 }}>
            أضف بروستو للشاشة الرئيسية
          </strong>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12.5, lineHeight: 1.4 }}>
            تجربة أسرع وأسهل بدون متصفح
          </span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0 }}>
          <button
            onClick={handleInstall}
            style={{
              background: '#f5c800', color: '#000', border: 'none',
              borderRadius: 10, padding: '8px 16px', fontSize: 13,
              fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 16px rgba(245,200,0,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            تثبيت الآن
          </button>
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)',
              border: 'none', borderRadius: 10, padding: '6px 16px',
              fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
