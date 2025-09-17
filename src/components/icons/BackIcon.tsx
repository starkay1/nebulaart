import React from 'react';
import Svg, { Polyline } from 'react-native-svg';

interface BackIconProps {
  size?: number;
  color?: string;
}

export default function BackIcon({ 
  size = 24, 
  color = 'currentColor'
}: BackIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="返回">
      <Polyline points="15,18 9,12 15,6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
