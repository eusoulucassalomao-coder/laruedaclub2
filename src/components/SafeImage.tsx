import React, { useState } from 'react';
import { Coffee } from 'lucide-react';

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel,
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#EAEFE5] via-[#F3EDE0] to-[#E7DFCC] text-[#4A5D3F] p-4 text-center"
        role="img"
        aria-label={alt}
      >
        <Coffee className="w-7 h-7 opacity-75" strokeWidth={1.6} />
        {fallbackLabel && (
          <span className="font-display text-sm font-medium text-[#293622] line-clamp-2">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
    />
  );
};
