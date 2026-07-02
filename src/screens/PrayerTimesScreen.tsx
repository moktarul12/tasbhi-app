import React, { useMemo, useState } from 'react';
import { FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSettings } from '../context/SettingsContext';
import { useLocation } from '../context/LocationContext';
import {
  DayPrayerTimes,
  addDays,
  computePrayerTimes,
  formatTime,
  getCurrentPrayer,
  getNextPrayer,
} from '../utils/prayerTimes';
import { palette } from '../theme/colors';
import PrimaryButton from '../components/PrimaryButton';
import { MainTabParamList, RootStackParamList } from '../navigation/types';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

type RangeKey = 'today' | 'sevenDays' | 'oneMonth' | 'custom';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(d: Date, start: Date, end: Date) {
  const t = d.getTime();
  return t >= start.getTime() && t <= end.getTime();
}

function daysBetween(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
}

const PRAYER_ROWS: { key: keyof Pick<DayPrayerTimes, 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'>; labelKey: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'fajr', labelKey: 'fajr', icon: 'partly-sunny' },
  { key: 'sunrise', labelKey: 'sunrise', icon: 'sunny' },
  { key: 'dhuhr', labelKey: 'dhuhr', icon: 'sunny' },
  { key: 'asr', labelKey: 'asr', icon: 'cloudy-night' },
  { key: 'maghrib', labelKey: 'maghrib', icon: 'moon' },
  { key: 'isha', labelKey: 'isha', icon: 'moon' },
];

const PrayerTimesScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { theme, t } = useSettings();
  const { location } = useLocation();
  const [range, setRange] = useState<RangeKey>('today');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [customStart, setCustomStart] = useState<Date>(new Date());
  const [customEnd, setCustomEnd] = useState<Date>(addDays(new Date(), 6));
  const [pickingStart, setPickingStart] = useState(true);

  const todayTimes = useMemo(
    () => computePrayerTimes(location.latitude, location.longitude, new Date()),
    [location.latitude, location.longitude]
  );

  const nextPrayer = getNextPrayer(todayTimes);
  const currentPrayer = getCurrentPrayer(todayTimes);

  const listDays = useMemo(() => {
    if (range === 'today') return [];
    let start: Date, count: number;
    if (range === 'sevenDays') { start = new Date(); count = 7; }
    else if (range === 'oneMonth') { start = new Date(); count = 30; }
    else if (range === 'custom') {
      start = customStart;
      count = Math.min(90, Math.max(1, daysBetween(customStart, customEnd)));
    } else return [];
    return Array.from({ length: count }, (_, i) =>
      computePrayerTimes(location.latitude, location.longitude, addDays(start, i))
    );
  }, [range, customStart, customEnd, location.latitude, location.longitude]);

  const RANGE_TABS: { key: RangeKey; label: string }[] = [
    { key: 'today', label: t('today') },
    { key: 'sevenDays', label: t('sevenDays') },
    { key: 'oneMonth', label: t('oneMonth') },
    { key: 'custom', label: t('custom') },
  ];

  const onSelectRange = (key: RangeKey) => {
    if (key === 'custom') {
      setCalendarMonth(customStart.getMonth());
      setCalendarYear(customStart.getFullYear());
      setPickingStart(true);
      setShowCustomModal(true);
    }
    setRange(key);
  };

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(calendarYear, calendarMonth, d));
    return cells;
  }, [calendarYear, calendarMonth]);

  const onCalendarDayPress = (d: Date) => {
    if (pickingStart) {
      setCustomStart(d);
      if (d.getTime() > customEnd.getTime()) setCustomEnd(d);
      setPickingStart(false);
    } else {
      if (d.getTime() < customStart.getTime()) {
        setCustomStart(d);
      } else {
        setCustomEnd(d);
      }
      setPickingStart(true);
    }
  };

  const goPrevMonth = () => {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1); }
    else setCalendarMonth(calendarMonth - 1);
  };
  const goNextMonth = () => {
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1); }
    else setCalendarMonth(calendarMonth + 1);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={{ width: 26 }} />
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('prayerTimes')}</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.banner}>
        <Image source={require('../../assets/images/mosque.jpg')} style={styles.bannerImage} />
        <View style={styles.bannerOverlay} />
      </View>

      <TouchableOpacity
        style={[styles.locationRow, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => navigation.navigate('LocationPicker')}
      >
        <Ionicons name="location" size={16} color={theme.primary} />
        <Text style={[styles.locationText, { color: theme.text }]} numberOfLines={1}>
          {location.city}
          {location.country ? `, ${location.country}` : ''}
        </Text>
        <Text style={[styles.changeText, { color: theme.primary }]}>{t('changeLocation')}</Text>
      </TouchableOpacity>

      <View style={[styles.tabRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {RANGE_TABS.map((r) => (
          <TouchableOpacity
            key={r.key}
            style={[styles.tab, range === r.key && { backgroundColor: theme.primary }]}
            onPress={() => onSelectRange(r.key)}
          >
            <Text style={[styles.tabText, { color: range === r.key ? '#fff' : theme.textMuted }]}>{r.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {range === 'today' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {nextPrayer && (
            <View style={[styles.nextCard, { backgroundColor: palette.deepGreen }]}>
              <Text style={styles.nextLabel}>{t('nextPrayer')}</Text>
              <Text style={styles.nextName}>{t(nextPrayer.key)}</Text>
              <Text style={styles.nextTime}>{formatTime(nextPrayer.time)}</Text>
            </View>
          )}

          <View style={{ gap: 10, marginTop: 16 }}>
            {PRAYER_ROWS.map((row) => {
              const active = currentPrayer === row.key;
              return (
                <View
                  key={row.key}
                  style={[
                    styles.row,
                    { backgroundColor: theme.card, borderColor: active ? theme.primary : theme.border },
                  ]}
                >
                  <View style={styles.rowLeft}>
                    <Ionicons name={row.icon} size={18} color={theme.primary} />
                    <Text style={[styles.rowLabel, { color: theme.text }]}>{t(row.labelKey)}</Text>
                  </View>
                  <Text style={[styles.rowTime, { color: active ? theme.primary : theme.text }]}>
                    {formatTime(todayTimes[row.key])}
                  </Text>
                </View>
              );
            })}
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('ramadanTimes')}</Text>
          <View style={styles.ramadanRow}>
            <View style={[styles.ramadanCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Ionicons name="cafe" size={20} color={theme.primary} />
              <Text style={[styles.ramadanLabel, { color: theme.textMuted }]}>{t('sehri')}</Text>
              <Text style={[styles.ramadanTime, { color: theme.text }]}>{formatTime(todayTimes.sehriEnds)}</Text>
            </View>
            <View style={[styles.ramadanCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Ionicons name="restaurant" size={20} color={theme.primary} />
              <Text style={[styles.ramadanLabel, { color: theme.textMuted }]}>{t('iftar')}</Text>
              <Text style={[styles.ramadanTime, { color: theme.text }]}>{formatTime(todayTimes.iftar)}</Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={listDays}
          keyExtractor={(d) => d.date.toISOString()}
          contentContainerStyle={{ paddingBottom: 40, gap: 10 }}
          renderItem={({ item }) => (
            <View style={[styles.dayCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.dayDate, { color: theme.text }]}>
                {item.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </Text>
              <View style={styles.dayTimesRow}>
                {PRAYER_ROWS.map((row) => (
                  <View key={row.key} style={styles.dayTimeItem}>
                    <Text style={[styles.dayTimeLabel, { color: theme.textMuted }]}>{t(row.labelKey)}</Text>
                    <Text style={[styles.dayTimeValue, { color: theme.text }]}>{formatTime(item[row.key])}</Text>
                  </View>
                ))}
              </View>
              <View style={[styles.dayRamadanRow, { borderTopColor: theme.border }]}>
                <Text style={[styles.dayRamadanText, { color: theme.primary }]}>
                  {t('sehri')}: {formatTime(item.sehriEnds)}
                </Text>
                <Text style={[styles.dayRamadanText, { color: theme.primary }]}>
                  {t('iftar')}: {formatTime(item.iftar)}
                </Text>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={showCustomModal} transparent animationType="fade" onRequestClose={() => setShowCustomModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{t('selectDateRange')}</Text>

            <View style={styles.datePillRow}>
              <TouchableOpacity
                style={[styles.datePill, { borderColor: pickingStart ? theme.primary : theme.border, backgroundColor: pickingStart ? theme.primary + '15' : 'transparent' }]}
                onPress={() => setPickingStart(true)}
              >
                <Text style={[styles.datePillLabel, { color: theme.textMuted }]}>{t('startDate')}</Text>
                <Text style={[styles.datePillValue, { color: theme.text }]}>
                  {customStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
              </TouchableOpacity>
              <Ionicons name="arrow-forward" size={16} color={theme.textMuted} />
              <TouchableOpacity
                style={[styles.datePill, { borderColor: !pickingStart ? theme.primary : theme.border, backgroundColor: !pickingStart ? theme.primary + '15' : 'transparent' }]}
                onPress={() => setPickingStart(false)}
              >
                <Text style={[styles.datePillLabel, { color: theme.textMuted }]}>{t('endDate')}</Text>
                <Text style={[styles.datePillValue, { color: theme.text }]}>
                  {customEnd.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.calNavRow}>
              <TouchableOpacity onPress={goPrevMonth} style={styles.calNavBtn}>
                <Ionicons name="chevron-back" size={20} color={theme.text} />
              </TouchableOpacity>
              <Text style={[styles.calMonthLabel, { color: theme.text }]}>{MONTH_NAMES[calendarMonth]} {calendarYear}</Text>
              <TouchableOpacity onPress={goNextMonth} style={styles.calNavBtn}>
                <Ionicons name="chevron-forward" size={20} color={theme.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.calWeekRow}>
              {WEEKDAY_LABELS.map((w) => (
                <Text key={w} style={[styles.calWeekLabel, { color: theme.textMuted }]}>{w}</Text>
              ))}
            </View>

            <View style={styles.calGrid}>
              {calendarDays.map((d, i) => {
                if (!d) return <View key={`e${i}`} style={styles.calCell} />;
                const isStart = isSameDay(d, customStart);
                const isEnd = isSameDay(d, customEnd);
                const inRange = isInRange(d, customStart, customEnd);
                const isToday = isSameDay(d, new Date());
                return (
                  <TouchableOpacity
                    key={`d${i}`}
                    style={styles.calCell}
                    onPress={() => onCalendarDayPress(d)}
                  >
                    <View style={[
                      styles.calDayInner,
                      isStart && { backgroundColor: theme.primary },
                      isEnd && { backgroundColor: theme.primary },
                      inRange && !isStart && !isEnd && { backgroundColor: theme.primary + '20' },
                    ]}>
                      <Text style={[
                        styles.calDayText,
                        { color: isStart || isEnd ? '#fff' : inRange ? theme.primary : theme.text },
                        isToday && !isStart && !isEnd && { fontWeight: '800' },
                      ]}>
                        {d.getDate()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.calRangeInfo, { color: theme.textMuted }]}>
              {daysBetween(customStart, customEnd)} day{daysBetween(customStart, customEnd) !== 1 ? 's' : ''} selected
            </Text>

            <PrimaryButton title={t('apply')} onPress={() => setShowCustomModal(false)} />
          </View>
        </View>
      </Modal>
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
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  banner: {
    height: 100,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15,42,29,0.3)',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 14,
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  changeText: {
    fontSize: 12,
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
    fontSize: 11,
    fontWeight: '700',
  },
  nextCard: {
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  nextLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  nextName: {
    color: palette.gold,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 6,
  },
  nextTime: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
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
  rowTime: {
    fontSize: 15,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
  },
  ramadanRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ramadanCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  ramadanLabel: {
    fontSize: 12,
  },
  ramadanTime: {
    fontSize: 17,
    fontWeight: '800',
  },
  dayCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  dayDate: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  dayTimesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dayTimeItem: {
    minWidth: 70,
  },
  dayTimeLabel: {
    fontSize: 10,
  },
  dayTimeValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  dayRamadanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  dayRamadanText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalLabel: {
    fontSize: 12,
  },
  modalInput: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  datePillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  datePill: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  datePillLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  datePillValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  calNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  calNavBtn: {
    padding: 6,
  },
  calMonthLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  calWeekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  calWeekLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayText: {
    fontSize: 13,
    fontWeight: '600',
  },
  calRangeInfo: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
});

export default PrayerTimesScreen;
