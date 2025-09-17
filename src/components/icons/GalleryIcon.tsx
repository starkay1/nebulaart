import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface GalleryIconProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

const GalleryIcon: React.FC<GalleryIconProps> = ({ 
  size = 24, 
  color = '#000000',
  filled = false 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={filled ? 0 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default GalleryIcon;
