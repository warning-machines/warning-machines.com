'use client';
import { useState } from 'react';

type Props = {
  src: string;
  alt: string;
  className?: string;
  placeholderLabel?: string;
};

export function FallbackImg({ src, alt, className, placeholderLabel = 'Photo coming soon' }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="about-placeholder">
        <span className="about-placeholder__icon">📷</span>
        <span className="about-placeholder__text">{placeholderLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
