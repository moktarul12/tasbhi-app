import React from 'react';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';
import { palette } from '../../theme/colors';

interface Props {
  width?: number;
  height?: number;
  domeColor?: string;
  accentColor?: string;
}

const MosqueIllustration: React.FC<Props> = ({
  width = 220,
  height = 180,
  domeColor = palette.gold,
  accentColor = palette.cream,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 180">
      <Ellipse cx={110} cy={168} rx={95} ry={8} fill="rgba(0,0,0,0.15)" />

      <Path d="M20 150 Q30 60 55 40 Q60 70 55 150 Z" fill="#1B4A30" opacity={0.6} />
      <Path d="M200 150 Q190 60 165 40 Q160 70 165 150 Z" fill="#1B4A30" opacity={0.6} />

      <Rect x={35} y={95} width={16} height={55} fill={accentColor} opacity={0.9} />
      <Path d="M35 95 Q43 78 51 95 Z" fill={domeColor} />
      <Circle cx={43} cy={72} r={4} fill={domeColor} />

      <Rect x={169} y={95} width={16} height={55} fill={accentColor} opacity={0.9} />
      <Path d="M169 95 Q177 78 185 95 Z" fill={domeColor} />
      <Circle cx={177} cy={72} r={4} fill={domeColor} />

      <Rect x={65} y={110} width={90} height={40} rx={4} fill={accentColor} opacity={0.95} />

      <Path d="M65 110 Q110 30 155 110 Z" fill={accentColor} opacity={0.95} />
      <Path d="M78 110 Q110 55 142 110 Z" fill={domeColor} opacity={0.5} />

      <Circle cx={110} cy={38} r={6} fill={domeColor} />
      <Line x1={110} y1={44} x2={110} y2={30} stroke={domeColor} strokeWidth={2} />
      <Path d="M104 26 a6 6 0 1 0 12 0 a6 5 0 1 1 -12 0" fill={domeColor} />

      <Path d="M95 150 Q95 120 110 118 Q125 120 125 150 Z" fill="#0F2A1D" opacity={0.85} />

      <Rect x={70} y={128} width={14} height={22} rx={2} fill="#0F2A1D" opacity={0.5} />
      <Rect x={136} y={128} width={14} height={22} rx={2} fill="#0F2A1D" opacity={0.5} />
    </Svg>
  );
};

export default MosqueIllustration;
