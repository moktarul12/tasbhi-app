import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { palette } from '../../theme/colors';

interface Props {
  width?: number;
  height?: number;
  color?: string;
  flip?: boolean;
}

const PlantIllustration: React.FC<Props> = ({ width = 70, height = 90, color = palette.green, flip = false }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 70 90" style={flip ? { transform: [{ scaleX: -1 }] } : undefined}>
      <Path d="M10 90 C6 60 14 30 34 8" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d="M34 8 C24 18 14 22 4 20" stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Path d="M28 24 C18 30 10 30 2 26" stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Path d="M22 42 C12 46 4 44 -2 38" stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Path d="M18 60 C10 62 4 60 -2 54" stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Path d="M34 8 C40 20 46 26 56 28" stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Path d="M26 30 C34 34 42 34 50 30" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M18 50 C28 54 38 52 46 46" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
    </Svg>
  );
};

export default PlantIllustration;
