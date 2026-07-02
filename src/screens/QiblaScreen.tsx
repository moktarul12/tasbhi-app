import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Magnetometer } from 'expo-sensors';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { useSettings } from '../context/SettingsContext';
import { useLocation } from '../context/LocationContext';
import { computeQiblaBearing } from '../utils/prayerTimes';
import { palette } from '../theme/colors';
import { MainTabParamList, RootStackParamList } from '../navigation/types';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

function angleDiff(a: number): number {
  let d = a % 360;
  if (d < 0) d += 360;
  return d;
}

const QiblaScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { theme, t } = useSettings();
  const { location } = useLocation();
  const [heading, setHeading] = useState<number | null>(null);
  const rotation = useRef(new Animated.Value(0)).current;
  const dialRotation = useRef(new Animated.Value(0)).current;

  const qiblaBearing = computeQiblaBearing(location.latitude, location.longitude);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    Magnetometer.isAvailableAsync()
      .then((available) => {
        if (!available) return;
        Magnetometer.setUpdateInterval(200);
        subscription = Magnetometer.addListener((data) => {
          let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
          angle = angleDiff(90 - angle);
          setHeading(angle);
        });
      })
      .catch(() => {});
    return () => subscription?.remove();
  }, []);

  const deviceHeading = heading ?? 0;
  const needleRotation = angleDiff(qiblaBearing - deviceHeading);
  const dialAngle = angleDiff(-deviceHeading);

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: needleRotation,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [needleRotation]);

  useEffect(() => {
    Animated.timing(dialRotation, {
      toValue: dialAngle,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [dialAngle]);

  const rotateStyle = {
    transform: [
      {
        rotate: rotation.interpolate({
          inputRange: [0, 360],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  const dialRotateStyle = {
    transform: [
      {
        rotate: dialRotation.interpolate({
          inputRange: [0, 360],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={{ width: 26 }} />
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('qibla')}</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.banner}>
        <Image source={require('../../assets/images/kaaba.jpg')} style={styles.bannerImage} />
        <View style={styles.bannerOverlay} />
      </View>

      <TouchableOpacity
        style={[styles.locationRow, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => navigation.navigate('LocationPicker')}
      >
        <Ionicons name="location" size={16} color={theme.primary} />
        <Text style={[styles.locationText, { color: theme.text }]}>
          {location.city}
          {location.country ? `, ${location.country}` : ''}
        </Text>
        <Text style={[styles.changeText, { color: theme.primary }]}>{t('changeLocation')}</Text>
      </TouchableOpacity>

      <View style={styles.compassWrap}>
        <Animated.View style={[styles.dialWrap, dialRotateStyle]}>
          <Svg width={260} height={260}>
            <Circle cx={130} cy={130} r={124} stroke={palette.gold} strokeWidth={2} fill={theme.card} />
            <Circle cx={130} cy={130} r={100} stroke={theme.border} strokeWidth={1} fill="none" />
            <SvgText x={130} y={22} fontSize={14} fontWeight="bold" fill={theme.text} textAnchor="middle">N</SvgText>
            <SvgText x={130} y={246} fontSize={14} fill={theme.textMuted} textAnchor="middle">S</SvgText>
            <SvgText x={16} y={135} fontSize={14} fill={theme.textMuted} textAnchor="middle">W</SvgText>
            <SvgText x={244} y={135} fontSize={14} fill={theme.textMuted} textAnchor="middle">E</SvgText>
            <Line x1={130} y1={130} x2={130} y2={30} stroke={theme.border} strokeWidth={1} />
            <Line x1={130} y1={130} x2={130} y2={230} stroke={theme.border} strokeWidth={1} />
            <Line x1={30} y1={130} x2={230} y2={130} stroke={theme.border} strokeWidth={1} />
          </Svg>
        </Animated.View>

        <Animated.View style={[styles.needleWrap, rotateStyle]}>
          <View style={styles.needleTop}>
            <Ionicons name="triangle" size={28} color={palette.gold} />
          </View>
          <View style={[styles.kaabaIcon, { borderColor: palette.gold }]}>
            <Image source={require('../../assets/images/kaaba.jpg')} style={styles.kaabaImage} />
          </View>
        </Animated.View>
      </View>

      <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.infoLabel, { color: theme.textMuted }]}>{t('qiblaDegrees')}</Text>
        <Text style={[styles.infoValue, { color: theme.primary }]}>{Math.round(qiblaBearing)}°</Text>
      </View>

      <Text style={[styles.hint, { color: theme.textMuted }]}>{t('faceQiblaMsg')}</Text>
      {heading === null && (
        <Text style={[styles.hint, { color: theme.danger, marginTop: 6 }]}>
          Compass sensor unavailable on this device/browser — showing static bearing from North.
        </Text>
      )}
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
    height: 110,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
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
    backgroundColor: 'rgba(15,42,29,0.25)',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 20,
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
  compassWrap: {
    alignSelf: 'center',
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dialWrap: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  needleWrap: {
    position: 'absolute',
    width: 260,
    height: 260,
    alignItems: 'center',
  },
  needleTop: {
    marginTop: 6,
  },
  kaabaIcon: {
    marginTop: 84,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  kaabaImage: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    alignSelf: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
  },
  hint: {
    textAlign: 'center',
    fontSize: 12,
    paddingHorizontal: 20,
  },
});

export default QiblaScreen;
