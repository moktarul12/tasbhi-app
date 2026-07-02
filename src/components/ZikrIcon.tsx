import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  leaf: 'leaf',
  flower: 'flower',
  star: 'star',
  moon: 'moon',
  rain: 'rainy',
  sparkle: 'sparkles',
  heart: 'heart',
  book: 'book',
  sun: 'sunny',
  water: 'water',
};

export const ZIKR_ICON_OPTIONS = Object.keys(ICON_MAP);

interface Props {
  name: string;
  size?: number;
  color?: string;
}

const ZikrIcon: React.FC<Props> = ({ name, size = 20, color = '#14432C' }) => {
  const iconName = ICON_MAP[name] ?? 'sparkles';
  return <Ionicons name={iconName} size={size} color={color} />;
};

export default ZikrIcon;
