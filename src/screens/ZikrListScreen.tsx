import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSettings } from '../context/SettingsContext';
import { useZikr } from '../context/ZikrContext';
import ZikrIcon from '../components/ZikrIcon';
import { Zikr } from '../types';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { palette } from '../theme/colors';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const ZikrListScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { theme, t } = useSettings();
  const { zikrs, setLastZikrId } = useZikr();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return zikrs;
    const q = query.toLowerCase();
    return zikrs.filter(
      (z) => z.nameEn.toLowerCase().includes(q) || (z.meaning ?? '').toLowerCase().includes(q)
    );
  }, [zikrs, query]);

  const openDetail = (z: Zikr) => {
    setLastZikrId(z.id);
    navigation.navigate('HomeTab');
  };

  const renderItem = ({ item }: { item: Zikr }) => (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => openDetail(item)}
    >
      <View style={styles.iconWrap}>
        <ZikrIcon name={item.icon} size={18} color={palette.deepGreen} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.itemTitle, { color: theme.text }]}>{item.nameEn}</Text>
        {!!item.meaning && (
          <Text style={[styles.itemSub, { color: theme.textMuted }]} numberOfLines={1}>
            {item.meaning}
          </Text>
        )}
      </View>
      <View style={styles.countBadge}>
        <Text style={styles.countBadgeText}>{item.todayCount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={{ width: 26 }} />
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('myZikrList')}</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Ionicons name="search" size={18} color={theme.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('searchZikr')}
          placeholderTextColor={theme.textMuted}
          style={[styles.searchInput, { color: theme.text }]}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(z) => z.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20, gap: 12 }}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('AddZikr')}
      >
        <Ionicons name="add" size={18} color={theme.mode === 'dark' ? theme.primaryDark : '#fff'} />
        <Text style={[styles.addButtonText, { color: theme.mode === 'dark' ? theme.primaryDark : '#fff' }]}>
          {t('addNewZikr')}
        </Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemSub: {
    fontSize: 12,
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: palette.green,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  countBadgeText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: '800',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ZikrListScreen;
