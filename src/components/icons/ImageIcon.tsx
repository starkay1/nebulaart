import React from 'react';
import Svg, { Rect, Circle, Polyline } from 'react-native-svg';

interface ImageIconProps {
  size?: number;
  color?: string;
}

export default function ImageIcon({ 
  size = 24, 
  color = 'currentColor'
}: ImageIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="图片">
      <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth={2} />
      <Circle cx="8.5" cy="8.5" r="1.5" stroke={color} strokeWidth={2} />
      <Polyline points="21 15 16 10 5 21" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
