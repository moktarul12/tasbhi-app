import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSettings } from '../context/SettingsContext';
import { useZikr } from '../context/ZikrContext';
import { RootStackParamList } from '../navigation/types';
import PrimaryButton from '../components/PrimaryButton';
import ZikrIcon, { ZIKR_ICON_OPTIONS } from '../components/ZikrIcon';

type Props = NativeStackScreenProps<RootStackParamList, 'AddZikr'>;

const AddZikrScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, t } = useSettings();
  const { categories, addZikr, setLastZikrId } = useZikr();

  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [meaning, setMeaning] = useState('');
  const [category, setCategory] = useState(categories[0] ?? 'Praise');
  const [defaultCount, setDefaultCount] = useState('33');
  const [icon, setIcon] = useState(ZIKR_ICON_OPTIONS[0]);

  const canSave = nameEn.trim().length > 0;

  const onSave = () => {
    if (!canSave) return;
    const zikr = addZikr({
      nameEn: nameEn.trim(),
      nameAr: nameAr.trim() || undefined,
      meaning: meaning.trim() || undefined,
      category,
      defaultCount: Number(defaultCount) || 33,
      icon,
    });
    setLastZikrId(zikr.id);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('addNewZikr')}</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 20 }}>
        <Field label={t('zikrNameEn')} value={nameEn} onChangeText={setNameEn} theme={theme} placeholder="Alhamdulillah" />
        <Field label={t('zikrNameAr')} value={nameAr} onChangeText={setNameAr} theme={theme} placeholder="الْحَمْدُ لِلَّهِ" />
        <Field label={t('meaningOptional')} value={meaning} onChangeText={setMeaning} theme={theme} placeholder="All praise is due to Allah" />

        <View>
          <Text style={[styles.label, { color: theme.textMuted }]}>{t('category')}</Text>
          <View style={styles.chipRow}>
            {categories.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setCategory(c)}
                style={[
                  styles.chip,
                  { borderColor: theme.border },
                  category === c && { backgroundColor: theme.primary, borderColor: theme.primary },
                ]}
              >
                <Text style={[styles.chipText, { color: category === c ? '#fff' : theme.text }]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Field
          label={t('defaultCount')}
          value={defaultCount}
          onChangeText={setDefaultCount}
          theme={theme}
          keyboardType="number-pad"
          placeholder="33"
        />

        <View>
          <Text style={[styles.label, { color: theme.textMuted }]}>{t('icon')}</Text>
          <View style={styles.chipRow}>
            {ZIKR_ICON_OPTIONS.map((ic) => (
              <TouchableOpacity
                key={ic}
                onPress={() => setIcon(ic)}
                style={[
                  styles.iconChip,
                  { borderColor: theme.border },
                  icon === ic && { backgroundColor: theme.primary, borderColor: theme.primary },
                ]}
              >
                <ZikrIcon name={ic} size={18} color={icon === ic ? '#fff' : theme.text} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <PrimaryButton title={t('saveZikr')} onPress={onSave} disabled={!canSave} style={{ marginBottom: 16 }} />
    </View>
  );
};

const Field: React.FC<{
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  theme: any;
  placeholder?: string;
  keyboardType?: 'default' | 'number-pad';
}> = ({ label, value, onChangeText, theme, placeholder, keyboardType }) => (
  <View>
    <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.textMuted}
      keyboardType={keyboardType}
      style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  iconChip: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddZikrScreen;
