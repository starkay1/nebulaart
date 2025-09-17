import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface UserIconProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

const UserIcon: React.FC<UserIconProps> = ({ 
  size = 24, 
  color = '#000000',
  filled = false 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="12"
        cy="7"
        r="4"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={2}
      />
    </Svg>
  );
};

export default UserIcon;
