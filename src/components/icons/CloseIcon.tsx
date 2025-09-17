import React from 'react';
import Svg, { Line } from 'react-native-svg';

interface CloseIconProps {
  size?: number;
  color?: string;
}

export default function CloseIcon({ 
  size = 24, 
  color = 'currentColor'
}: CloseIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="关闭">
      <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
