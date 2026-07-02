import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { palette } from '../theme/colors';
import PrimaryButton from '../components/PrimaryButton';
import { useSettings } from '../context/SettingsContext';
import { languages } from '../i18n/translations';
import { LanguageCode } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Language'>;

const LanguageScreen: React.FC<Props> = ({ navigation }) => {
  const { settings, setLanguage, completeLanguageSelection } = useSettings();
  const [selected, setSelected] = useState<LanguageCode>(settings.language);

  const onContinue = () => {
    setLanguage(selected);
    completeLanguageSelection();
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Language</Text>
      <Text style={styles.subtitle}>Select your preferred language</Text>

      <View style={styles.list}>
        {languages.map((lang) => {
          const active = selected === lang.code;
          return (
            <TouchableOpacity
              key={lang.code}
              style={[styles.item, active && styles.itemActive]}
              onPress={() => setSelected(lang.code)}
            >
              <Text style={[styles.itemText, active && styles.itemTextActive]}>
                {lang.native}
              </Text>
              <View style={[styles.radio, active && styles.radioActive]}>
                {active && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <PrimaryButton title="Continue" onPress={onContinue} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.cream,
    paddingTop: 90,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: palette.deepGreen,
  },
  subtitle: {
    fontSize: 13,
    color: palette.textMuted,
    marginTop: 6,
    marginBottom: 32,
  },
  list: {
    gap: 14,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1.5,
    borderColor: palette.creamDark,
  },
  itemActive: {
    borderColor: palette.deepGreen,
  },
  itemText: {
    fontSize: 16,
    color: palette.textDark,
    fontWeight: '600',
  },
  itemTextActive: {
    color: palette.deepGreen,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: palette.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    backgroundColor: palette.deepGreen,
    borderColor: palette.deepGreen,
  },
  button: {
    marginTop: 'auto',
    marginBottom: 40,
    backgroundColor: palette.deepGreen,
  },
});

export default LanguageScreen;
