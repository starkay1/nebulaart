import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CurationIconProps {
  size?: number;
  color?: string;
}

export default function CurationIcon({ 
  size = 24, 
  color = 'currentColor'
}: CurationIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="策展">
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
