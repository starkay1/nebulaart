import React from 'react';
import Svg, { Circle } from 'react-native-svg';

interface MoreIconProps {
  size?: number;
  color?: string;
}

export default function MoreIcon({ 
  size = 24, 
  color = 'currentColor'
}: MoreIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="更多">
      <Circle cx="12" cy="12" r="1" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="19" cy="12" r="1" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="5" cy="12" r="1" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
