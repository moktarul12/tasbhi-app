import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../context/SettingsContext';
import { useZikr } from '../context/ZikrContext';
import { RootStackParamList } from '../navigation/types';
import PrimaryButton from '../components/PrimaryButton';

const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme, t } = useSettings();
  const { categories, zikrs, addCategory, deleteCategory } = useZikr();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');

  const countsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    zikrs.forEach((z) => {
      map[z.category] = (map[z.category] ?? 0) + 1;
    });
    return map;
  }, [zikrs]);

  const totalCount = zikrs.length;

  const onAdd = () => {
    if (!name.trim()) return;
    addCategory(name.trim());
    setName('');
    setShowForm(false);
  };

  const onLongPressDelete = (cat: string) => {
    Alert.alert(cat, 'Delete this category?', [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: () => deleteCategory(cat) },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('categories')}</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={{ gap: 10 }}>
        <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.rowLeft}>
            <Ionicons name="apps" size={18} color={theme.primary} />
            <Text style={[styles.rowLabel, { color: theme.text }]}>{t('allZikr')}</Text>
          </View>
          <Text style={[styles.rowCount, { color: theme.textMuted }]}>{totalCount}</Text>
        </View>

        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}
            onLongPress={() => onLongPressDelete(c)}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="pricetag" size={18} color={theme.primary} />
              <Text style={[styles.rowLabel, { color: theme.text }]}>{c}</Text>
            </View>
            <Text style={[styles.rowCount, { color: theme.textMuted }]}>{countsByCategory[c] ?? 0}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {showForm && (
        <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TextInput
            placeholder="Category name"
            placeholderTextColor={theme.textMuted}
            value={name}
            onChangeText={setName}
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          />
          <PrimaryButton title={t('save')} onPress={onAdd} />
        </View>
      )}

      <PrimaryButton
        title={t('addCategory')}
        onPress={() => setShowForm((s) => !s)}
        style={{ marginTop: 16, backgroundColor: theme.primary }}
      />
    </ScrollView>
  );
};

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
    fontSize: 17,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowCount: {
    fontSize: 13,
    fontWeight: '700',
  },
  formCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginTop: 16,
    gap: 10,
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
});

export default CategoriesScreen;
