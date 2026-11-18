import React from 'react';

interface BrandLogoProps {
  variant?: 'default' | 'inverted' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'default',
  size = 'md',
}) => {
  const iconDimensions =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-9 h-9';
  const textClass =
    size === 'sm'
      ? 'text-lg'
      : size === 'lg'
        ? 'text-2xl sm:text-3xl'
        : 'text-xl';

  const ringColor = variant === 'inverted' ? '#FAF7F0' : '#4A5D3F';
  const bgColor = variant === 'inverted' ? '#38492F' : '#4A5D3F';
  const spokeColor = '#FAF7F0';

  const emblem = (
    <span
      className={`${iconDimensions} inline-flex items-center justify-center rounded-xl shrink-0 shadow-xs`}
      style={{ backgroundColor: bgColor }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="w-[82%] h-[82%]" fill="none">
        <circle cx="32" cy="32" r="22" stroke={spokeColor} strokeWidth="3.2" />
        <circle
          cx="32"
          cy="32"
          r="14.5"
          stroke="#EAB308"
          strokeWidth="1.5"
          strokeDasharray="2.5 3.2"
        />
        <circle cx="32" cy="32" r="6" fill={spokeColor} />
        <circle cx="32" cy="32" r="2.5" fill={ringColor} />
        <g stroke={spokeColor} strokeWidth="2.4" strokeLinecap="round">
          <line x1="32" y1="11.5" x2="32" y2="25" />
          <line x1="32" y1="39" x2="32" y2="52.5" />
          <line x1="11.5" y1="32" x2="25" y2="32" />
          <line x1="39" y1="32" x2="52.5" y2="32" />
          <line x1="17.5" y1="17.5" x2="27" y2="27" />
          <line x1="37" y1="37" x2="46.5" y2="46.5" />
          <line x1="46.5" y1="17.5" x2="37" y2="27" />
          <line x1="27" y1="37" x2="17.5" y2="46.5" />
        </g>
      </svg>
    </span>
  );

  if (variant === 'icon-only') {
    return emblem;
  }

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
      {emblem}
      <span
        className={`font-display font-semibold tracking-tight ${textClass} ${
          variant === 'inverted' ? 'text-[#FAF7F0]' : 'text-[#293622]'
        }`}
      >
        Club La Ruedita
      </span>
    </span>
  );
};
