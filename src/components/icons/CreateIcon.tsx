import React from 'react';
import Svg, { Line } from 'react-native-svg';

interface CreateIconProps {
  size?: number;
  color?: string;
}

export default function CreateIcon({ 
  size = 24, 
  color = 'currentColor'
}: CreateIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="创建">
      <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
