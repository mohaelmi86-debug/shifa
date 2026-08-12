'use client';

import React, { memo } from 'react';
import AppImage from './AppImage';

// ============================================================
// SHIFA BRAND SYSTEM — Single Source of Truth
// Official logo asset: blue/white SHIFA Health OS logo (PNG)
// Two human figures forming a heart + SHIFA wordmark + HEALTH OS
// ============================================================

const SHIFA_LOGO_SRC = '/assets/images/file_00000000594071f4b27d19b03582b884-1786375501710.png';

export type ShifaBrandVariant =
  | 'full'        // Full logo image (desktop sidebar expanded) — 140×44px
  | 'compact'     // Compact logo image (tablet / mobile) — 110×36px
  | 'symbol'      // Symbol only (collapsed sidebar / favicon context) — 32×32px
  | 'auth'        // Centered, larger for auth pages — 180×72px
  | 'topnav'      // Compact for top navigation bar — 110×36px
  | 'card'        // For SHIFA Card front/back — premium sizing
  | 'watermark';  // Low-opacity background watermark — 120×48px

export type ShifaBrandTheme = 'light' | 'dark' | 'auto';

interface ShifaBrandProps {
  variant?: ShifaBrandVariant;
  theme?: ShifaBrandTheme;
  className?: string;
  onClick?: () => void;
  /** Override symbol size in px */
  symbolSize?: number;
}

const ShifaBrand = memo(function ShifaBrand({
  variant = 'full',
  theme = 'auto',
  className = '',
  onClick,
  symbolSize,
}: ShifaBrandProps) {
  const isClickable = !!onClick;

  const wrapperClass = [
    'flex items-center justify-center',
    variant === 'auth' ? 'flex-col' : '',
    isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : '',
    variant === 'watermark' ? 'pointer-events-none select-none' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Symbol-only: show just the icon portion at small size
  // Used in: collapsed sidebar, compact contexts
  if (variant === 'symbol') {
    const size = symbolSize ?? 40;
    return (
      <div className={wrapperClass} onClick={onClick}>
        <AppImage
          src={SHIFA_LOGO_SRC}
          alt="SHIFA"
          width={size}
          height={size}
          className="flex-shrink-0 object-contain"
          style={{
            minWidth: size,
            minHeight: size,
            maxWidth: size,
            maxHeight: size,
          }}
        />
      </div>
    );
  }

  // Watermark: large, very low opacity
  // Used in: card backgrounds, page watermarks
  if (variant === 'watermark') {
    const size = symbolSize ?? 120;
    return (
      <div className={wrapperClass} onClick={onClick}>
        <AppImage
          src={SHIFA_LOGO_SRC}
          alt="SHIFA watermark"
          width={size}
          height={size}
          className="object-contain"
          style={{
            opacity: 0.12,
            maxWidth: size,
            maxHeight: size,
          }}
        />
      </div>
    );
  }

  // Auth: large centered logo — the image already contains full wordmark
  // Used in: login/signup pages, authentication screens
  if (variant === 'auth') {
    return (
      <div className={wrapperClass} onClick={onClick}>
        <AppImage
          src={SHIFA_LOGO_SRC}
          alt="SHIFA Health OS"
          width={220}
          height={88}
          className="object-contain"
          priority
          style={{
            maxWidth: '220px',
            height: 'auto',
            aspectRatio: '220 / 88',
          }}
        />
      </div>
    );
  }

  // Full: sidebar expanded — logo at comfortable width
  // Used in: expanded sidebar (desktop), full-width contexts
  if (variant === 'full') {
    return (
      <div className={wrapperClass} onClick={onClick}>
        <AppImage
          src={SHIFA_LOGO_SRC}
          alt="SHIFA Health OS"
          width={180}
          height={56}
          className="object-contain flex-shrink-0"
          priority
          style={{
            maxWidth: '180px',
            height: 'auto',
            aspectRatio: '180 / 56',
          }}
        />
      </div>
    );
  }

  // Compact / topnav: medium width
  // Used in: top navigation, tablet views, compact layouts
  if (variant === 'compact' || variant === 'topnav') {
    return (
      <div className={wrapperClass} onClick={onClick}>
        <AppImage
          src={SHIFA_LOGO_SRC}
          alt="SHIFA Health OS"
          width={140}
          height={44}
          className="object-contain flex-shrink-0"
          priority={variant === 'topnav'}
          style={{
            maxWidth: '140px',
            height: 'auto',
            aspectRatio: '140 / 44',
          }}
        />
      </div>
    );
  }

  // Card: on dark gradient background — white logo works perfectly
  // Used in: SHIFA Card front/back, premium card displays
  if (variant === 'card') {
    const size = symbolSize ?? 36;
    return (
      <div className={wrapperClass} onClick={onClick}>
        <AppImage
          src={SHIFA_LOGO_SRC}
          alt="SHIFA Health OS"
          width={size * 3}
          height={size}
          className="object-contain flex-shrink-0"
          style={{
            maxWidth: `${size * 3}px`,
            height: 'auto',
            aspectRatio: `${size * 3} / ${size}`,
          }}
        />
      </div>
    );
  }

  // Fallback — full
  return (
    <div className={wrapperClass} onClick={onClick}>
      <AppImage
        src={SHIFA_LOGO_SRC}
        alt="SHIFA Health OS"
        width={140}
        height={44}
        className="object-contain flex-shrink-0"
        style={{
          maxWidth: '140px',
          height: 'auto',
          aspectRatio: '140 / 44',
        }}
      />
    </div>
  );
});

export default ShifaBrand;
export { SHIFA_LOGO_SRC };
