import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { palette } from '../theme/colors';

interface Props {
  count: number;
  target: number;
  nameAr?: string;
  nameEn: string;
  onPress: () => void;
  size?: number;
  variant?: 'dark' | 'light' | 'modern';
  maxCount?: number;
}

const CounterCircle: React.FC<Props> = ({ count, target, nameAr, nameEn, onPress, size = 260, variant = 'dark', maxCount = 100 }) => {
  const isLight = variant === 'light';
  const isModern = variant === 'modern';
  const scale = useRef(new Animated.Value(1)).current;
  const strokeWidth = isModern ? 8 : isLight ? 6 : 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const ringMax = maxCount > 0 ? maxCount : target > 0 ? target : 100;
  const progress = ringMax > 0 ? Math.min(count / ringMax, 1) : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  const trackColor = isModern ? 'rgba(74,143,163,0.12)' : isLight ? 'rgba(20,67,44,0.08)' : 'rgba(212,175,55,0.25)';
  const progressColor = isModern ? '#4A8FA3' : isLight ? palette.green : palette.gold;
  const textColor = isModern ? '#1E3A4D' : isLight ? palette.deepGreen : '#FFFFFF';
  const subTextColor = isModern ? '#4A8FA3' : isLight ? palette.green : 'rgba(255,255,255,0.7)';
  const knobSize = isModern ? 14 : 0;
  const angle = progress * 2 * Math.PI - Math.PI / 2;
  const knobX = size / 2 + radius * Math.cos(angle);
  const knobY = size / 2 + radius * Math.sin(angle);

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.wrapper,
          { width: size, height: size, transform: [{ scale }] },
          (isLight || isModern) && styles.wrapperLight,
          isModern && styles.wrapperModern,
        ]}
      >
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          {!isLight && !isModern && (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius + strokeWidth / 2}
              fill={palette.deepGreen}
              stroke={palette.gold}
              strokeWidth={2}
            />
          )}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={progressColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
          {isModern && knobSize > 0 && (
            <Circle cx={knobX} cy={knobY} r={knobSize / 2} fill={progressColor} />
          )}
        </Svg>
        <View style={styles.center}>
          {!!nameAr && <Text style={[styles.arabic, { color: progressColor }]}>{nameAr}</Text>}
          {!!nameEn && <Text style={[styles.name, { color: textColor }]}>{nameEn}</Text>}
          <Text style={[styles.count, { color: textColor }]}>{count}</Text>
          <Text style={[styles.times, { color: subTextColor }]}>{isModern ? 'TIMES' : 'Times'}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  wrapperLight: {
    backgroundColor: palette.white,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  wrapperModern: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    shadowColor: '#4A90A4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arabic: {
    fontSize: 20,
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  count: {
    fontSize: 56,
    fontWeight: '800',
  },
  times: {
    fontSize: 13,
    marginTop: 2,
  },
});

export default CounterCircle;
