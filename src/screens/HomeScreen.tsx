import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useSettings } from '../context/SettingsContext';
import { useZikr } from '../context/ZikrContext';
import CounterCircle from '../components/CounterCircle';
import CounterActions from '../components/CounterActions';
import HomeBackground from '../components/HomeBackground';
import { MainTabParamList, RootStackParamList } from '../navigation/types';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { theme, t, settings, toggleHaptic } = useSettings();
  const { zikrs, lastZikrId, incrementZikr, resetZikrToday } = useZikr();

  const activeZikr = zikrs.find((z) => z.id === lastZikrId) ?? zikrs[0];

  const handleIncrement = () => {
    if (!activeZikr) return;
    if (settings.hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    incrementZikr(activeZikr.id, 1);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#F8F5F0' }]}>
      <HomeBackground />

      <View style={styles.header}>
        <View style={{ width: 26 }} />
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>{t('appName')}</Text>
          <Text style={styles.headerSub}>{t('assalamuAlaikum')}</Text>
        </View>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.glassCard}>
          <View style={styles.zikrTitles}>
            <Text style={styles.arabicName}>{activeZikr?.nameAr ?? ''}</Text>
            <Text style={styles.englishName}>{activeZikr?.nameEn ?? 'No zikr yet'}</Text>
          </View>

          {activeZikr && (
            <>
              <CounterCircle
                count={activeZikr.todayCount}
                target={activeZikr.defaultCount}
                nameAr={undefined}
                nameEn=""
                onPress={handleIncrement}
                size={260}
                variant="modern"
              />
              <Text style={styles.tapHint}>Tap anywhere to increase</Text>
              <CounterActions
                variant="modern"
                onReset={() => resetZikrToday(activeZikr.id)}
                onIncrement={handleIncrement}
                onStats={() => navigation.navigate('Statistics')}
              />
            </>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddZikr')}
      >
        <LinearGradient
          colors={['#5A9FB0', '#4A8FA3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.addButtonGradient}
        >
          <View style={styles.addIconCircle}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.addButtonText}>{t('addNewZikr')}</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </LinearGradient>
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
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E3A4D',
  },
  headerSub: {
    fontSize: 13,
    marginTop: 2,
    color: '#6A7B8A',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 44,
    paddingHorizontal: 16,
  },
  glassCard: {
    width: '100%',
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.72)',
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#4A8FA3',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  zikrTitles: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 12,
  },
  arabicName: {
    fontSize: 26,
    color: '#4A8FA3',
    fontWeight: '700',
    marginBottom: 4,
  },
  englishName: {
    fontSize: 16,
    color: '#1E3A4D',
    fontWeight: '600',
  },
  tapHint: {
    color: '#6A7B8A',
    fontSize: 13,
    marginTop: 18,
    fontWeight: '500',
  },
  addButton: {
    height: 58,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: '#4A8FA3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 5,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 58,
    borderRadius: 30,
    paddingHorizontal: 6,
  },
  addIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
});

export default HomeScreen;
