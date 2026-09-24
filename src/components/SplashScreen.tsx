'use client';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const duration = 3500;
    const interval = 50;
    const step = (interval / duration) * 100;
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      setProgress(Math.min(current, 100));
      if (current >= 100) {
        clearInterval(timer);
        setFadeOut(true);
        setTimeout(onComplete, 600);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#080808',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        transition: 'opacity 0.6s ease',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* Radial glow */}
      <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -60%)' }} />

      {/* Coin-flip logo */}
      <div style={{ perspective: 800, marginBottom: 48 }}>
        <div style={{ width: 180, height: 180, position: 'relative', transformStyle: 'preserve-3d', animation: 'coinFlip 2.5s linear infinite' }}>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/branding/elit-logo.png" alt="Elit Detailing" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.5))' }} />
          </div>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/branding/elit-logo.png" alt="Elit Detailing" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scaleX(-1)', filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.5)) brightness(0.75) sepia(0.4)' }} />
          </div>
        </div>
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '0.18em', marginBottom: 8, textAlign: 'center', background: 'linear-gradient(135deg, #E8C96A 0%, #C9A84C 40%, #9A7420 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: 'var(--font-display, "Barlow Condensed", sans-serif)' }}>ELIT DETAILING</h1>
      <p style={{ fontSize: 11, letterSpacing: '0.35em', color: 'rgba(201,168,76,0.6)', marginBottom: 48, textTransform: 'uppercase', fontFamily: 'var(--font-display, "Barlow Condensed", sans-serif)', fontWeight: 600 }}>Premium Automotive Care</p>

      <div style={{ width: 220 }}>
        <div style={{ height: 1, background: 'rgba(201,168,76,0.15)', borderRadius: 1, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #8B6914, #C9A84C, #E8C96A)', transition: 'width 0.05s linear' }} />
        </div>
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 10, letterSpacing: '0.25em', color: 'rgba(201,168,76,0.4)', fontFamily: 'Inter, sans-serif' }}>LOADING...</p>
      </div>

      <style>{`
        @keyframes coinFlip { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
      `}</style>
    </div>
  );
}
