import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../theme/colors';

interface Props {
  onReset: () => void;
  onIncrement: () => void;
  onStats?: () => void;
  variant?: 'default' | 'modern';
}

const CounterActions: React.FC<Props> = ({
  onReset,
  onIncrement,
  onStats,
  variant = 'default',
}) => {
  const isModern = variant === 'modern';
  const actionColor = isModern ? '#4A8FA3' : palette.white;
  const actionBg = isModern ? '#FFFFFF' : palette.deepGreen;
  const actionBorder = isModern ? '#E0E0E0' : palette.gold;
  const increaseColor = isModern ? '#4A904A' : palette.white;
  const increaseBg = isModern ? '#FFFFFF' : palette.green;

  const ActionItem = ({
    label,
    onPress,
    bg,
    border,
    children,
  }: {
    label: string;
    onPress: () => void;
    bg: string;
    border: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: bg, borderColor: border }]}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
      {isModern && <Text style={styles.label}>{label}</Text>}
    </View>
  );

  return (
    <View style={[styles.row, isModern && styles.rowModern]}>
      <ActionItem label="Reset" onPress={onReset} bg={actionBg} border={actionBorder}>
        <Ionicons name="refresh" size={22} color={actionColor} />
      </ActionItem>
      {isModern && onStats && (
        <>
          <View style={styles.divider} />
          <ActionItem label="Stats" onPress={onStats} bg={actionBg} border={actionBorder}>
            <Ionicons name="bar-chart" size={22} color={actionColor} />
          </ActionItem>
        </>
      )}
      {isModern && <View style={styles.divider} />}
      <ActionItem label="Increase" onPress={onIncrement} bg={increaseBg} border={actionBorder}>
        <Text style={[styles.plusText, { color: increaseColor }]}>+1</Text>
      </ActionItem>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 18,
    marginTop: 28,
  },
  rowModern: {
    gap: 32,
  },
  item: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#5A6B7B',
    marginTop: 6,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 6,
  },
  actionBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  plusText: {
    fontWeight: '800',
    fontSize: 18,
  },
});

export default CounterActions;
