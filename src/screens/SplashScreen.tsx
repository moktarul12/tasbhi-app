import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { palette } from '../theme/colors';
import { useSettings } from '../context/SettingsContext';
import MosqueIllustration from '../components/illustrations/MosqueIllustration';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { settings, loading } = useSettings();

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      if (!settings.onboardingDone) {
        navigation.replace('Onboarding');
      } else if (!settings.languageSelected) {
        navigation.replace('Language');
      } else {
        navigation.replace('MainTabs');
      }
    }, 1600);
    return () => clearTimeout(timer);
  }, [loading, settings.languageSelected, settings.onboardingDone]);

  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <MosqueIllustration width={44} height={36} domeColor={palette.gold} accentColor={palette.cream} />
      </View>
      <Text style={styles.title}>Zikr-n-Tashbi</Text>
      <Text style={styles.subtitle}>Remember Allah, Find Peace</Text>
      <View style={styles.divider} />
      <View style={styles.card}>
        <MosqueIllustration width={130} height={106} />
        <Text style={styles.cardTitle}>Zikr-n-Tashbi</Text>
        <Text style={styles.cardSubtitle}>Remember Allah, Find Peace</Text>
        <Animated.View style={[styles.spinner, { transform: [{ rotate }] }]}>
          <Svg width={28} height={28}>
            <Circle cx={14} cy={14} r={11} stroke="rgba(212,175,55,0.25)" strokeWidth={3} fill="none" />
            <Circle
              cx={14}
              cy={14}
              r={11}
              stroke={palette.gold}
              strokeWidth={3}
              fill="none"
              strokeDasharray={`${2 * Math.PI * 11 * 0.28} ${2 * Math.PI * 11}`}
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.cream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: palette.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: palette.deepGreen,
  },
  subtitle: {
    fontSize: 13,
    color: palette.textMuted,
    marginTop: 4,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: palette.gold,
    marginTop: 16,
    marginBottom: 40,
  },
  card: {
    width: '100%',
    height: 260,
    borderRadius: 24,
    backgroundColor: palette.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: palette.gold,
    fontSize: 22,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
    fontSize: 12,
  },
  spinner: {
    marginTop: 28,
  },
});

export default SplashScreen;
