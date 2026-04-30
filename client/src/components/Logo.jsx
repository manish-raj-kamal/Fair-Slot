import React from 'react';

/**
 * FairSlot logo mark with optional wordmark.
 */
export default function Logo({
  size = 32,
  showText = false,
  className = '',
  textColor = '#1e293b',
  style = {},
  surface = 'light'
}) {
  const logoScale = 1.18;
  const markSize = size * logoScale;
  const darkSurface = surface === 'dark';
  const shellStyle = darkSurface
    ? {
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(247, 250, 255, 0.92) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.72)',
        boxShadow: '0 14px 30px rgba(15, 23, 42, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.92)'
      }
    : {
        background: 'rgba(255, 255, 255, 0.92)',
        border: '1px solid rgba(226, 232, 240, 0.92)',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)'
      };

  return (
    <span
      className={`fairslot-logo ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, ...style }}
    >
      <span
        style={{
          width: size,
          height: size,
          display: 'inline-grid',
          placeItems: 'center',
          flexShrink: 0,
          overflow: 'visible',
          borderRadius: 10,
          padding: 2,
          background: 'transparent',
        }}
      >
        <img
          src="/FairSlot_LogoWithBG.svg"
          alt="FairSlot logo"
          width={markSize}
          height={markSize}
          className="fairslot-logo-mark"
          style={{ objectFit: 'contain', objectPosition: 'center center', display: 'block' }}
        />
      </span>

      {showText && (
        <span style={{
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 600,
          fontSize: size * 0.65,
          letterSpacing: '-0.02em',
          color: textColor,
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}>
          FairSlot
        </span>
      )}
    </span>
  );
}
