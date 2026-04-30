import React from 'react';

/**
 * FairSlot logo mark with optional wordmark.
 * Uses FairSlot_LogoWithBG.svg which has its own background.
 * No extra shell/background is applied — the SVG is rendered as-is.
 */
export default function Logo({
  size = 32,
  showText = false,
  className = '',
  textColor = '#1e293b',
  style = {},
}) {
  const markSize = Math.round(size * 1.2);

  return (
    <span
      className={`fairslot-logo ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, ...style }}
    >
      <img
        src="/FairSlot_LogoWithBG.svg"
        alt="FairSlot logo"
        width={markSize}
        height={markSize}
        className="fairslot-logo-mark"
        style={{ objectFit: 'contain', display: 'block', flexShrink: 0 }}
      />

      {showText && (
        <span style={{
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 700,
          fontSize: size * 0.65,
          letterSpacing: '-0.01em',
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
