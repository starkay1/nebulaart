import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface ExploreIconProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

export default function ExploreIcon({ 
  size = 24, 
  color = 'currentColor',
  filled = false
}: ExploreIconProps) {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={filled ? color : "none"} 
      accessibilityLabel="探索"
    >
      <Circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke={filled ? "none" : color} 
        strokeWidth={filled ? 0 : 2} 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill={filled ? color : "none"}
      />
      <Path 
        d="m8 14 4-4 6 2-2-6-4 4-2 4z" 
        stroke={filled ? "none" : color} 
        strokeWidth={filled ? 0 : 2} 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill={filled ? color : "none"}
      />
    </Svg>
  );
}
