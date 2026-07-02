import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSettings } from '../context/SettingsContext';
import { useZikr } from '../context/ZikrContext';
import { RootStackParamList } from '../navigation/types';
import PrimaryButton from '../components/PrimaryButton';
import ZikrIcon, { ZIKR_ICON_OPTIONS } from '../components/ZikrIcon';
import { searchSuggestions, ZikrSuggestion } from '../data/zikrSuggestions';

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
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => searchSuggestions(nameEn), [nameEn]);

  const canSave = nameEn.trim().length > 0;

  const applySuggestion = (s: ZikrSuggestion) => {
    setNameEn(s.nameEn);
    setNameAr(s.nameAr);
    setMeaning(s.meaning);
    setCategory(s.category);
    setDefaultCount(String(s.defaultCount));
    setIcon(s.icon);
    setShowSuggestions(false);
  };

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
        <View>
          <Text style={[styles.label, { color: theme.textMuted }]}>{t('zikrNameEn')}</Text>
          <TextInput
            value={nameEn}
            onChangeText={(v) => { setNameEn(v); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Alhamdulillah"
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
          />
          {showSuggestions && suggestions.length > 0 && (
            <View style={[styles.suggestionList, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.suggestionHeader, { color: theme.textMuted }]}>{t('suggestions')} · {t('tapToFill')}</Text>
              <FlatList
                data={suggestions.slice(0, 8)}
                keyExtractor={(item) => item.nameEn}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.suggestionItem, { borderColor: theme.border }]}
                    onPress={() => applySuggestion(item)}
                  >
                    <View style={[styles.suggestionIcon, { backgroundColor: theme.primary + '15' }]}>
                      <ZikrIcon name={item.icon} size={16} color={theme.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.suggestionName, { color: theme.text }]}>{item.nameEn}</Text>
                      <Text style={[styles.suggestionAr, { color: theme.textMuted }]} numberOfLines={1}>{item.nameAr}</Text>
                    </View>
                    <View style={[styles.suggestionBadge, { backgroundColor: theme.primary + '20' }]}>
                      <Text style={[styles.suggestionBadgeText, { color: theme.primary }]}>{item.category}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
          {showSuggestions && suggestions.length === 0 && nameEn.trim().length > 0 && (
            <View style={[styles.suggestionList, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.suggestionHeader, { color: theme.textMuted }]}>{t('noSuggestions')}</Text>
            </View>
          )}
        </View>
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
  suggestionList: {
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    gap: 4,
  },
  suggestionHeader: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  suggestionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionName: {
    fontSize: 13,
    fontWeight: '700',
  },
  suggestionAr: {
    fontSize: 11,
    marginTop: 2,
  },
  suggestionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  suggestionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});

export default AddZikrScreen;
