import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  width,
  height,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
    onError?.();
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 rounded" />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
          Failed to load
        </div>
      )}
    </div>
  );
};
