import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../context/SettingsContext';
import { useZikr, StatsRange } from '../context/ZikrContext';
import ZikrIcon from '../components/ZikrIcon';
import { RootStackParamList } from '../navigation/types';

const RANGES: { key: StatsRange; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
];

const StatisticsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme, t } = useSettings();
  const { getStats } = useZikr();
  const [range, setRange] = useState<StatsRange>('daily');

  const { total, topZikrs } = getStats(range);
  const today = new Date();
  const dateLabel = today.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

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
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('statistics')}</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={[styles.tabRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {RANGES.map((r) => (
          <TouchableOpacity
            key={r.key}
            style={[styles.tab, range === r.key && { backgroundColor: theme.primary }]}
            onPress={() => setRange(r.key)}
          >
            <Text style={[styles.tabText, { color: range === r.key ? '#fff' : theme.textMuted }]}>{r.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.dateLabel, { color: theme.textMuted }]}>{dateLabel}</Text>

      <View style={[styles.totalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.totalLabel, { color: theme.textMuted }]}>{t('totalZikr')}</Text>
        <Text style={[styles.totalValue, { color: theme.primary }]}>{total}</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('topZikr')}</Text>
      <View style={{ gap: 10 }}>
        {topZikrs.length === 0 && (
          <Text style={{ color: theme.textMuted, fontSize: 13 }}>No zikr recorded for this period yet.</Text>
        )}
        {topZikrs.map(({ zikr, count }) => (
          <View key={zikr.id} style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.iconWrap, { backgroundColor: theme.background }]}>
              <ZikrIcon name={zikr.icon} size={16} color={theme.primary} />
            </View>
            <Text style={[styles.rowLabel, { color: theme.text }]}>{zikr.nameEn}</Text>
            <Text style={[styles.rowValue, { color: theme.primary }]}>{count}</Text>
          </View>
        ))}
      </View>
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
  tabRow: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dateLabel: {
    fontSize: 12,
    marginBottom: 16,
  },
  totalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 13,
    marginBottom: 6,
  },
  totalValue: {
    fontSize: 40,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '800',
  },
});

export default StatisticsScreen;
