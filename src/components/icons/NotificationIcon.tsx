import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface NotificationIconProps {
  size?: number;
  color?: string;
}

export default function NotificationIcon({ 
  size = 24, 
  color = 'currentColor'
}: NotificationIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="通知">
      <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="m13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
