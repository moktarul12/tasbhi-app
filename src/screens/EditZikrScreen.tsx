import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSettings } from '../context/SettingsContext';
import { useZikr } from '../context/ZikrContext';
import { RootStackParamList } from '../navigation/types';
import PrimaryButton from '../components/PrimaryButton';
import ZikrIcon, { ZIKR_ICON_OPTIONS } from '../components/ZikrIcon';

type Props = NativeStackScreenProps<RootStackParamList, 'EditZikr'>;

const EditZikrScreen: React.FC<Props> = ({ route, navigation }) => {
  const { zikrId } = route.params;
  const { theme, t } = useSettings();
  const { categories, getZikr, updateZikr, deleteZikr } = useZikr();
  const zikr = getZikr(zikrId);

  const [nameEn, setNameEn] = useState(zikr?.nameEn ?? '');
  const [nameAr, setNameAr] = useState(zikr?.nameAr ?? '');
  const [meaning, setMeaning] = useState(zikr?.meaning ?? '');
  const [category, setCategory] = useState(zikr?.category ?? categories[0] ?? 'Praise');
  const [defaultCount, setDefaultCount] = useState(String(zikr?.defaultCount ?? 33));
  const [icon, setIcon] = useState(zikr?.icon ?? ZIKR_ICON_OPTIONS[0]);

  if (!zikr) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Zikr not found</Text>
      </View>
    );
  }

  const onSave = () => {
    updateZikr(zikr.id, {
      nameEn: nameEn.trim() || zikr.nameEn,
      nameAr: nameAr.trim() || undefined,
      meaning: meaning.trim() || undefined,
      category,
      defaultCount: Number(defaultCount) || zikr.defaultCount,
      icon,
    });
    navigation.goBack();
  };

  const onDelete = () => {
    Alert.alert(t('confirmDeleteTitle'), t('confirmDeleteMsg'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: () => {
          deleteZikr(zikr.id);
          navigation.navigate('MainTabs');
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('editZikr')}</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 20 }}>
        <Field label={t('zikrNameEn')} value={nameEn} onChangeText={setNameEn} theme={theme} />
        <Field label={t('zikrNameAr')} value={nameAr} onChangeText={setNameAr} theme={theme} />
        <Field label={t('meaningOptional')} value={meaning} onChangeText={setMeaning} theme={theme} />

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

        <Field label={t('defaultCount')} value={defaultCount} onChangeText={setDefaultCount} theme={theme} keyboardType="number-pad" />

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

      <PrimaryButton title={t('updateZikr')} onPress={onSave} style={{ marginBottom: 12 }} />
      <TouchableOpacity onPress={onDelete} style={{ marginBottom: 20, alignItems: 'center' }}>
        <Text style={{ color: theme.danger, fontWeight: '700', fontSize: 14 }}>{t('deleteZikr')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const Field: React.FC<{
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  theme: any;
  keyboardType?: 'default' | 'number-pad';
}> = ({ label, value, onChangeText, theme, keyboardType }) => (
  <View>
    <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      placeholderTextColor={theme.textMuted}
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

export default EditZikrScreen;
