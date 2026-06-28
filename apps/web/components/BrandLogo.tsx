import Image from 'next/image';

interface BrandLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function BrandLogo({ width = 140, height = 48, className }: BrandLogoProps) {
  return (
    <Image
      src="/logo-bravix.png"
      alt="BRAVIX Fleet"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
