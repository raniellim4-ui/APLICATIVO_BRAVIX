import { Image, ImageStyle, StyleProp } from 'react-native';

interface BrandLogoProps {
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
}

export function BrandLogo({ width = 140, height = 48, style }: BrandLogoProps) {
  return (
    <Image
      source={require('../../assets/logo-bravix.png')}
      style={[{ width, height, resizeMode: 'contain' }, style]}
      accessibilityLabel="BRAVIX Fleet"
    />
  );
}
