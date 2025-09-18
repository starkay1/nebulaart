import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface ProfileIconProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

export default function ProfileIcon({ 
  size = 24, 
  color = 'currentColor',
  filled = false
}: ProfileIconProps) {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={filled ? color : "none"} 
      accessibilityLabel="个人资料"
    >
      <Path 
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" 
        stroke={filled ? "none" : color} 
        strokeWidth={filled ? 0 : 2} 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill={filled ? color : "none"}
      />
      <Circle 
        cx="12" 
        cy="7" 
        r="4" 
        stroke={filled ? "none" : color} 
        strokeWidth={filled ? 0 : 2} 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill={filled ? color : "none"}
      />
    </Svg>
  );
}
