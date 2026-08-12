'use client';

import React, { memo } from 'react';
import ShifaBrand from './ShifaBrand';

// AppLogo is kept for backward compatibility.
// It now delegates to the centralized ShifaBrand component.
interface AppLogoProps {
  src?: string;
  iconName?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

const AppLogo = memo(function AppLogo({
  size = 32,
  className = '',
  onClick,
}: AppLogoProps) {
  return (
    <ShifaBrand
      variant="symbol"
      symbolSize={size}
      className={className}
      onClick={onClick}
    />
  );
});

export default AppLogo;
