import Image from 'next/image';
import { useState, useEffect } from 'react';

interface MDXImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function MDXImage({ src, alt, width, height, className }: MDXImageProps) {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Check if the image is an external URL
  const isExternal = src.startsWith('http') || src.startsWith('https');

  // If it's a relative path, prepend the content path
  const imageSrc = isExternal ? src : `/content/blog/${src}`;

  useEffect(() => {
    // Only run this for images where width/height aren't specified
    if (width && height) {
      setImageDimensions({ width, height });
      setIsLoading(false);
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      setImageDimensions({
        width: img.width,
        height: img.height,
      });
      setIsLoading(false);
    };
    img.onerror = () => {
      // Fallback dimensions if image fails to load
      setImageDimensions({ width: 800, height: 500 });
      setIsLoading(false);
    };
    img.src = imageSrc;
  }, [imageSrc, width, height]);

  if (isLoading) {
    return <div className="w-full aspect-w-16 aspect-h-9 bg-muted animate-pulse rounded-md"></div>;
  }

  // For external images, we need to use next/image's loader option
  if (isExternal) {
    return (
      <div className="my-6 overflow-hidden rounded-md">
        <Image
          src={imageSrc}
          alt={alt}
          width={imageDimensions.width}
          height={imageDimensions.height}
          className={`w-full h-auto object-cover ${className || ''}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
          quality={80}
          unoptimized={isExternal} // For external images
        />
      </div>
    );
  }

  return (
    <div className="my-6 overflow-hidden rounded-md">
      <Image
        src={imageSrc}
        alt={alt}
        width={imageDimensions.width}
        height={imageDimensions.height}
        className={`w-full h-auto object-cover ${className || ''}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
        quality={80}
      />
    </div>
  );
} 