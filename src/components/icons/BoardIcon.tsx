import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface BoardIconProps {
  size?: number;
  color?: string;
}

export default function BoardIcon({ 
  size = 24, 
  color = 'currentColor'
}: BoardIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="收藏夹">
      <Path d="M9 2v20l3-2 3 2V2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
