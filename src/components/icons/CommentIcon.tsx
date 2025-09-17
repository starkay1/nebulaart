import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CommentIconProps {
  size?: number;
  color?: string;
}

export default function CommentIcon({ 
  size = 24, 
  color = 'currentColor'
}: CommentIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="评论">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
