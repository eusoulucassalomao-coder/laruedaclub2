import React from 'react';

interface BrandLogoProps {
  variant?: 'default' | 'inverted' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
}

const LOGO_SRC = '/assets/aistudio/image_65c7880b.png';

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'default',
  size = 'md',
}) => {
  const iconDimensions =
    size === 'sm'
      ? 'w-9 h-9'
      : size === 'lg'
        ? 'w-16 h-16'
        : 'w-11 h-11';
  const textClass =
    size === 'sm'
      ? 'text-lg'
      : size === 'lg'
        ? 'text-2xl sm:text-3xl'
        : 'text-xl';

  const emblem = (
    <img
      src={LOGO_SRC}
      alt="Club La Ruedita"
      className={`${iconDimensions} rounded-full object-contain shrink-0 select-none ${
        variant === 'inverted' ? 'shadow-sm ring-1 ring-[#FAF7F0]/30' : ''
      }`}
    />
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
