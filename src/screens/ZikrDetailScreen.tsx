import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { palette } from '../theme/colors';
import { useSettings } from '../context/SettingsContext';
import { useZikr } from '../context/ZikrContext';
import CounterCircle from '../components/CounterCircle';
import CounterActions from '../components/CounterActions';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ZikrDetail'>;

const ZikrDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { zikrId } = route.params;
  const { theme, t, settings, toggleHaptic } = useSettings();
  const { getZikr, incrementZikr, resetZikrToday } = useZikr();
  const zikr = getZikr(zikrId);

  if (!zikr) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Zikr not found</Text>
      </View>
    );
  }

  const handleIncrement = () => {
    if (settings.hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    incrementZikr(zikr.id, 1);
  };

  const progress = zikr.defaultCount > 0 ? Math.min(zikr.todayCount / zikr.defaultCount, 1) : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{zikr.nameEn}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditZikr', { zikrId: zikr.id })}>
          <Ionicons name="create-outline" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.counterWrap}>
        <CounterCircle
          count={zikr.todayCount}
          target={zikr.defaultCount}
          nameAr={zikr.nameAr}
          nameEn={zikr.meaning ?? zikr.nameEn}
          onPress={handleIncrement}
          variant="light"
        />
        <Text style={[styles.tapHint, { color: theme.textMuted }]}>Tap anywhere to increase</Text>
        <CounterActions
          onReset={() => resetZikrToday(zikr.id)}
          onIncrement={handleIncrement}
        />
      </View>

      <View style={[styles.goalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.goalRow}>
          <Text style={[styles.goalLabel, { color: theme.textMuted }]}>{t('todaysGoal')}</Text>
          <Text style={[styles.goalValue, { color: theme.text }]}>
            {zikr.todayCount} / {zikr.defaultCount}
          </Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
          <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: palette.green }]} />
        </View>
      </View>
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  counterWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tapHint: {
    fontSize: 13,
    marginTop: 16,
  },
  goalCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  goalLabel: {
    fontSize: 13,
  },
  goalValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default ZikrDetailScreen;
