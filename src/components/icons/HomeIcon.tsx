import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface HomeIconProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

export default function HomeIcon({ 
  size = 24, 
  color = 'currentColor',
  filled = false
}: HomeIconProps) {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={filled ? color : "none"}
      accessibilityLabel="首页"
    >
      <Path 
        d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" 
        stroke={filled ? "none" : color} 
        strokeWidth={filled ? 0 : 2} 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill={filled ? color : "none"}
      />
    </Svg>
  );
}
