'use client';
import React from 'react';
import { formatCurrency, convertToEUR, convertToUSD } from '@/lib/i18n';

export interface SmartAmountProps {
  /** The numeric amount to display */
  amount: number;
  /** ISO currency code (e.g. 'KMF', 'EUR', 'USD', 'MAD') */
  currency: string;
  /** Show ≈ EUR / ≈ USD reference line. Default: true */
  showReference?: boolean;
  /** Only show EUR reference (not USD). Default: false */
  eurOnly?: boolean;
  /** Only show USD reference (not EUR). Default: false */
  usdOnly?: boolean;
  /** Visual size preset */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Light text mode (for dark backgrounds) */
  lightMode?: boolean;
  /** Inline layout (reference on same line, separated by ·) */
  inline?: boolean;
  /** Custom label shown before the reference block */
  referenceLabel?: string;
  /** Additional CSS classes */
  className?: string;
  /** Override main amount text color */
  color?: string;
}

const SIZE_MAP: Record<string, { main: string; ref: string; badge: string }> = {
  xs: { main: 'text-xs font-semibold', ref: 'text-[10px]', badge: 'text-[9px]' },
  sm: { main: 'text-sm font-semibold', ref: 'text-xs', badge: 'text-[10px]' },
  md: { main: 'text-base font-bold', ref: 'text-xs', badge: 'text-[10px]' },
  lg: { main: 'text-xl font-bold', ref: 'text-sm', badge: 'text-xs' },
  xl: { main: 'text-3xl font-bold', ref: 'text-sm', badge: 'text-xs' },
};

/**
 * SmartAmount — Universal financial amount display component.
 *
 * Replaces all per-screen CurrencyDisplay manual integrations.
 * Shows local transaction currency first, then optional ≈ EUR / ≈ USD reference.
 *
 * Usage:
 *   <SmartAmount amount={10000} currency="KMF" />
 *   → 10 000 CF
 *   → ≈ €20.34 · ≈ $21.97 (réf.)
 *
 *   <SmartAmount amount={250} currency="EUR" size="lg" />
 *   → €250,00  (no reference since already EUR)
 *
 *   <SmartAmount amount={5000} currency="MAD" inline size="sm" />
 *   → 5 000 DH  ≈ €462 · ≈ $499 (réf.)
 */
export default function SmartAmount({
  amount,
  currency,
  showReference = true,
  eurOnly = false,
  usdOnly = false,
  size = 'md',
  lightMode = false,
  inline = false,
  referenceLabel,
  className = '',
  color,
}: SmartAmountProps) {
  const cls = SIZE_MAP[size] || SIZE_MAP.md;

  const mainColor = color || (lightMode ? 'rgba(255,255,255,0.95)' : 'var(--foreground)');
  const refColor = lightMode ? 'rgba(255,255,255,0.6)' : 'var(--muted-foreground, #6b7280)';
  const badgeColor = lightMode ? 'rgba(255,255,255,0.4)' : 'rgba(107,114,128,0.6)';

  const isEUR = currency === 'EUR';
  const isUSD = currency === 'USD';

  const eurAmount = convertToEUR(amount, currency);
  const usdAmount = convertToUSD(amount, currency);

  const shouldShowEUR = showReference && !isEUR && !usdOnly && eurAmount > 0;
  const shouldShowUSD = showReference && !isUSD && !eurOnly && usdAmount > 0;
  const hasReference = shouldShowEUR || shouldShowUSD;

  const formattedMain = formatCurrency(amount, currency);
  const formattedEUR = shouldShowEUR ? formatCurrency(Math.round(eurAmount * 100) / 100, 'EUR') : '';
  const formattedUSD = shouldShowUSD ? formatCurrency(Math.round(usdAmount * 100) / 100, 'USD') : '';

  const refLabel = referenceLabel ?? 'réf.';

  if (inline) {
    return (
      <span className={`inline-flex items-baseline gap-1.5 flex-wrap ${className}`}>
        <span className={cls.main} style={{ color: mainColor }}>{formattedMain}</span>
        {hasReference && (
          <span className={`${cls.ref} flex items-center gap-1`} style={{ color: refColor }}>
            {shouldShowEUR && <span>≈ {formattedEUR}</span>}
            {shouldShowEUR && shouldShowUSD && <span>·</span>}
            {shouldShowUSD && <span>≈ {formattedUSD}</span>}
            <span className={cls.badge} style={{ color: badgeColor }}>({refLabel})</span>
          </span>
        )}
      </span>
    );
  }

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <span className={cls.main} style={{ color: mainColor }}>{formattedMain}</span>
      {hasReference && (
        <span className={`${cls.ref} flex items-center gap-1 flex-wrap mt-0.5`} style={{ color: refColor }}>
          {shouldShowEUR && <span>≈ {formattedEUR}</span>}
          {shouldShowEUR && shouldShowUSD && <span>·</span>}
          {shouldShowUSD && <span>≈ {formattedUSD}</span>}
          <span className={cls.badge} style={{ color: badgeColor }}>({refLabel})</span>
        </span>
      )}
    </div>
  );
}
