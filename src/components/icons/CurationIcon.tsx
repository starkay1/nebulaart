import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CurationIconProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

export default function CurationIcon({ 
  size = 24, 
  color = 'currentColor',
  filled = false
}: CurationIconProps) {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={filled ? color : "none"} 
      accessibilityLabel="策展"
    >
      <Path 
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" 
        stroke={filled ? "none" : color} 
        strokeWidth={filled ? 0 : 2} 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill={filled ? color : "none"}
      />
      <Path 
        d="M14 2l6 6" 
        stroke={filled ? "none" : color} 
        strokeWidth={filled ? 0 : 2} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <Path 
        d="M14 8h6" 
        stroke={filled ? "none" : color} 
        strokeWidth={filled ? 0 : 2} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
}
