import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { palette } from '../../theme/colors';

interface Props {
  width?: number;
  height?: number;
  color?: string;
}

const LanternIllustration: React.FC<Props> = ({ width = 90, height = 140, color = palette.gold }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 90 140">
      <Line x1={45} y1={0} x2={45} y2={22} stroke={color} strokeWidth={2} />
      <Circle cx={45} cy={4} r={3} fill={color} />

      <Path d="M30 22 L60 22 L54 34 L36 34 Z" fill={color} />

      <Rect x={26} y={34} width={38} height={58} rx={10} fill={color} opacity={0.18} stroke={color} strokeWidth={2} />
      <Line x1={45} y1={34} x2={45} y2={92} stroke={color} strokeWidth={1.5} opacity={0.6} />
      <Line x1={30} y1={45} x2={60} y2={45} stroke={color} strokeWidth={1.2} opacity={0.5} />
      <Line x1={30} y1={80} x2={60} y2={80} stroke={color} strokeWidth={1.2} opacity={0.5} />
      <Circle cx={45} cy={63} r={9} fill={color} opacity={0.55} />

      <Path d="M32 92 L58 92 L52 104 L38 104 Z" fill={color} />
      <Rect x={40} y={104} width={10} height={10} rx={2} fill={color} />
      <Circle cx={45} cy={120} r={4} fill={color} />
    </Svg>
  );
};

export default LanternIllustration;
