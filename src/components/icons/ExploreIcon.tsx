import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface ExploreIconProps {
  size?: number;
  color?: string;
}

export default function ExploreIcon({ 
  size = 24, 
  color = 'currentColor'
}: ExploreIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="探索">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
