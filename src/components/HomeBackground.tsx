import React from 'react';
import { Dimensions, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

const { width } = Dimensions.get('window');
const HEIGHT = 620;

const HomeBackground: React.FC = () => {
  const w = width;
  const mid = w / 2;

  const orbs = [
    { cx: w * 0.12, cy: 140, r: 70, color: '#E1F0F3' },
    { cx: w * 0.88, cy: 180, r: 90, color: '#E9F3E6' },
    { cx: w * 0.22, cy: 320, r: 40, color: '#D4E8E4' },
    { cx: w * 0.78, cy: 360, r: 55, color: '#DDECE0' },
    { cx: w * 0.5, cy: 80, r: 120, color: '#EDF5F7' },
  ];

  const stars = [
    { cx: w * 0.15, cy: 210, r: 3 },
    { cx: w * 0.85, cy: 250, r: 4 },
    { cx: w * 0.28, cy: 120, r: 2.5 },
    { cx: w * 0.72, cy: 140, r: 3 },
    { cx: w * 0.1, cy: 380, r: 2 },
    { cx: w * 0.9, cy: 420, r: 3.5 },
    { cx: w * 0.35, cy: 450, r: 2 },
    { cx: w * 0.65, cy: 470, r: 2.5 },
  ];

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: HEIGHT }} pointerEvents="none">
      <Svg width={w} height={HEIGHT} viewBox={`0 0 ${w} ${HEIGHT}`}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#EDF4F6" />
            <Stop offset="0.45" stopColor="#F7F5F0" />
            <Stop offset="1" stopColor="#FFFFFF" />
          </LinearGradient>
          <RadialGradient id="glow" cx="50%" cy="35%" r="50%">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.9} />
            <Stop offset="0.5" stopColor="#F5F0E8" stopOpacity={0.6} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id="wave1" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.7} />
            <Stop offset="1" stopColor="#EDF4F6" stopOpacity={0.3} />
          </LinearGradient>
          <LinearGradient id="wave2" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.5} />
            <Stop offset="1" stopColor="#E9F3E6" stopOpacity={0.2} />
          </LinearGradient>
          <LinearGradient id="stem" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#A8C9D8" />
            <Stop offset="1" stopColor="#B8D4C8" />
          </LinearGradient>
        </Defs>

        <Rect x={0} y={0} width={w} height={HEIGHT} fill="url(#sky)" />

        <Circle cx={mid} cy={HEIGHT * 0.28} r={160} fill="url(#glow)" />

        {orbs.map((o, i) => (
          <Circle key={i} cx={o.cx} cy={o.cy} r={o.r} fill={o.color} opacity={0.55} />
        ))}

        {stars.map((s, i) => (
          <G key={i} transform={`translate(${s.cx}, ${s.cy})`}>
            <Circle cx={0} cy={0} r={s.r} fill="#D4AF37" opacity={0.6} />
            <Circle cx={0} cy={0} r={s.r + 2} fill="#D4AF37" opacity={0.15} />
          </G>
        ))}

        <G opacity={0.18}>
          <Circle cx={mid} cy={HEIGHT * 0.28} r={140} stroke="#4A8FA3" strokeWidth={0.8} fill="none" />
          <Circle cx={mid} cy={HEIGHT * 0.28} r={110} stroke="#4A8FA3" strokeWidth={0.8} fill="none" />
          <Circle cx={mid} cy={HEIGHT * 0.28} r={80} stroke="#4A8FA3" strokeWidth={0.8} fill="none" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
            const r1 = 80;
            const r2 = 140;
            const a = (deg * Math.PI) / 180;
            return (
              <Path
                key={i}
                d={`M ${mid + r1 * Math.cos(a)} ${HEIGHT * 0.28 + r1 * Math.sin(a)}
                    L ${mid + r2 * Math.cos(a)} ${HEIGHT * 0.28 + r2 * Math.sin(a)}`}
                stroke="#4A8FA3"
                strokeWidth={0.6}
              />
            );
          })}
        </G>

        <Path
          d={`M -20 ${HEIGHT - 60}
              Q ${w * 0.25} ${HEIGHT - 120} ${w * 0.5} ${HEIGHT - 90}
              Q ${w * 0.75} ${HEIGHT - 60} ${w + 20} ${HEIGHT - 110}
              L ${w + 20} ${HEIGHT} L -20 ${HEIGHT} Z`}
          fill="url(#wave1)"
        />
        <Path
          d={`M -20 ${HEIGHT - 40}
              Q ${w * 0.3} ${HEIGHT - 90} ${w * 0.5} ${HEIGHT - 70}
              Q ${w * 0.7} ${HEIGHT - 50} ${w + 20} ${HEIGHT - 80}
              L ${w + 20} ${HEIGHT} L -20 ${HEIGHT} Z`}
          fill="url(#wave2)"
        />

        <G transform={`translate(${w * 0.08}, ${HEIGHT - 180})`} opacity={0.75}>
          <Path d="M0 80 Q8 40 25 10 Q15 45 18 80" fill="url(#stem)" />
          <Path d="M18 80 Q22 45 45 20 Q30 55 32 80" fill="url(#stem)" />
          <Path d="M32 80 Q35 50 55 30 Q40 60 42 80" fill="url(#stem)" />
          <Circle cx={25} cy={10} r={2.5} fill="#D4AF37" />
          <Circle cx={45} cy={20} r={2.5} fill="#D4AF37" />
          <Circle cx={55} cy={30} r={2.5} fill="#D4AF37" />
        </G>

        <G transform={`translate(${w * 0.92}, ${HEIGHT - 180}) scale(-1, 1)`} opacity={0.75}>
          <Path d="M0 80 Q8 40 25 10 Q15 45 18 80" fill="url(#stem)" />
          <Path d="M18 80 Q22 45 45 20 Q30 55 32 80" fill="url(#stem)" />
          <Path d="M32 80 Q35 50 55 30 Q40 60 42 80" fill="url(#stem)" />
          <Circle cx={25} cy={10} r={2.5} fill="#D4AF37" />
          <Circle cx={45} cy={20} r={2.5} fill="#D4AF37" />
          <Circle cx={55} cy={30} r={2.5} fill="#D4AF37" />
        </G>
      </Svg>
    </View>
  );
};

export default HomeBackground;
