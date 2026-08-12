'use client';
/**
 * CurrencyDisplay — Legacy wrapper around SmartAmount.
 * Kept for backward compatibility. New code should use SmartAmount directly.
 */
import SmartAmount, { SmartAmountProps } from './SmartAmount';

export type CurrencyDisplayProps = SmartAmountProps;

export default function CurrencyDisplay(props: CurrencyDisplayProps) {
  return <SmartAmount {...props} />;
}

// Re-export SmartAmount as the canonical component
export { SmartAmount };
