import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useSettings } from '../context/SettingsContext';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  variant?: 'primary' | 'outline' | 'danger';
}

const PrimaryButton: React.FC<Props> = ({ title, onPress, disabled, loading, style, variant = 'primary' }) => {
  const { theme } = useSettings();

  const backgroundColor =
    variant === 'primary' ? theme.primary : variant === 'danger' ? theme.danger : 'transparent';
  const borderColor = variant === 'outline' ? theme.primary : 'transparent';
  const textColor = variant === 'outline' ? theme.primary : theme.mode === 'dark' ? theme.primaryDark : '#FFFFFF';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.base,
        { backgroundColor, borderColor, borderWidth: variant === 'outline' ? 1.5 : 0, opacity: disabled ? 0.6 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PrimaryButton;
