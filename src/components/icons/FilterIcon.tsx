import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface FilterIconProps {
  size?: number;
  color?: string;
}

const FilterIcon: React.FC<FilterIconProps> = ({ 
  size = 24, 
  color = '#000000' 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default FilterIcon;
