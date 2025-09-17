import React from 'react';
import Svg, { Rect, Circle, Polyline } from 'react-native-svg';

interface UploadIconProps {
  size?: number;
  color?: string;
}

export default function UploadIcon({ 
  size = 24, 
  color = 'currentColor'
}: UploadIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="上传">
      <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="8.5" cy="8.5" r="1.5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Polyline points="21,15 16,10 5,21" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
