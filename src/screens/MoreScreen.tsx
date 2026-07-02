import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useSettings } from '../context/SettingsContext';
import { palette } from '../theme/colors';
import { RootStackParamList, MainTabParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route?: keyof RootStackParamList | keyof MainTabParamList;
  right?: string;
  danger?: boolean;
  onPress?: () => void;
};

type MenuSection = {
  title?: string;
  items: MenuItem[];
};

const MoreScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { theme, t, settings } = useSettings();

  const isDark = theme.mode === 'dark';
  const currentLangLabel =
    settings.language === 'bn'
      ? 'বাংলা'
      : settings.language === 'hi'
      ? 'हिंदी'
      : settings.language === 'ur'
      ? 'اردو'
      : 'English';

  const sections: MenuSection[] = [
    {
      items: [
        { icon: 'stats-chart', label: t('statistics'), route: 'Statistics' },
        { icon: 'notifications', label: t('reminders'), route: 'Reminders' },
        { icon: 'pricetags', label: t('categories'), route: 'Categories' },
      ],
    },
    {
      items: [
        { icon: 'time', label: t('prayerTimes'), route: 'PrayerTab' },
        { icon: 'compass', label: t('qibla'), route: 'QiblaTab' },
        { icon: 'language', label: t('language'), right: currentLangLabel },
      ],
    },
    {
      items: [
        { icon: 'settings', label: t('settings'), route: 'Settings' },
        { icon: 'help-circle', label: t('aboutApp'), onPress: () => Alert.alert(t('appName'), t('tagline')) },
        { icon: 'lock-closed', label: t('privacy'), onPress: () => Alert.alert(t('privacy'), 'Your data stays on your device.') },
      ],
    },
  ];

  const onLanguage = () => Alert.alert('Language', 'Use the Settings screen to change language.');

  const renderItem = (item: MenuItem, index: number, total: number) => {
    const isLast = index === total - 1;
    const handlePress = () => {
      if (item.onPress) return item.onPress();
      if (item.route) return navigation.navigate(item.route as any);
      if (item.label === t('language')) return onLanguage();
    };

    return (
      <TouchableOpacity
        key={item.label}
        style={[styles.row, isLast && styles.rowLast]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconBox,
            { backgroundColor: isDark ? palette.deepGreen : palette.deepGreen },
          ]}
        >
          <Ionicons name={item.icon} size={18} color={palette.white} />
        </View>
        <Text style={[styles.rowLabel, item.danger && { color: theme.danger }]}>{item.label}</Text>
        {item.right ? (
          <Text style={[styles.rowValue, { color: theme.textMuted }]}>{item.right}</Text>
        ) : null}
        <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: theme.text }]}>{t('more')}</Text>

      <LinearGradient
        colors={isDark ? [palette.green, palette.deepGreen] : [palette.deepGreen, palette.green]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileCard}
      >
        <View style={styles.avatarRing}>
          <Ionicons name="person" size={28} color={palette.gold} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>Guest</Text>
          <Text style={styles.profileSub}>{t('assalamuAlaikum')}</Text>
        </View>
      </LinearGradient>

      {sections.map((section, sIndex) => (
        <View key={sIndex} style={styles.card}>
          {section.items.map((item, i) => renderItem(item, i, section.items.length))}
        </View>
      ))}

      <Text style={[styles.footer, { color: theme.textMuted }]}>{t('appName')} v1.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 22,
    textAlign: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  avatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: palette.gold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  profileName: {
    color: palette.white,
    fontSize: 18,
    fontWeight: '700',
  },
  profileSub: {
    color: palette.goldLight,
    fontSize: 13,
    marginTop: 2,
  },
  proBadge: {
    backgroundColor: palette.gold,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  proBadgeText: {
    color: palette.deepGreen,
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFE9',
    gap: 12,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 14,
    marginRight: 4,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
  },
});

export default MoreScreen;
