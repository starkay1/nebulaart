import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface ArtistIconProps {
  size?: number;
  color?: string;
}

export default function ArtistIcon({ 
  size = 24, 
  color = 'currentColor'
}: ArtistIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="艺术家">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={2} />
    </Svg>
  );
}
