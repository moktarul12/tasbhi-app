import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSettings } from '../context/SettingsContext';
import { palette } from '../theme/colors';

const ITEMS: { key: string; icon: keyof typeof Ionicons.glyphMap; labelKey: string; route: string }[] = [
  { key: 'home', icon: 'home', labelKey: 'home', route: 'MainTabs' },
  { key: 'prayer', icon: 'time', labelKey: 'prayerTimes', route: 'PrayerTimes' },
  { key: 'qibla', icon: 'compass', labelKey: 'qibla', route: 'Qibla' },
  { key: 'stats', icon: 'stats-chart', labelKey: 'statistics', route: 'Statistics' },
  { key: 'reminders', icon: 'notifications', labelKey: 'reminders', route: 'Reminders' },
  { key: 'categories', icon: 'pricetags', labelKey: 'categories', route: 'Categories' },
  { key: 'settings', icon: 'settings', labelKey: 'settings', route: 'Settings' },
];

const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { theme, t } = useSettings();
  const activeRoute = props.state.routeNames[props.state.index];

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.brand}>
        <View style={styles.brandIcon}>
          <Ionicons name="moon" size={22} color={palette.gold} />
        </View>
        <Text style={[styles.brandTitle, { color: theme.headerText }]}>{t('appName')}</Text>
        <Text style={[styles.brandSub, { color: theme.textMuted }]}>{t('tagline')}</Text>
      </View>

      <View style={{ marginTop: 20 }}>
        {ITEMS.map((item) => {
          const active = activeRoute === item.route;
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.item, active && { backgroundColor: theme.mode === 'dark' ? palette.deepGreenDark : theme.background }]}
              onPress={() => props.navigation.navigate(item.route)}
            >
              <Ionicons name={item.icon} size={20} color={active ? palette.gold : theme.textMuted} />
              <Text style={[styles.itemText, { color: active ? theme.headerText : theme.textMuted }]}>
                {t(item.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
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
  brand: {
    marginBottom: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212,175,55,0.2)',
  },
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.deepGreenDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  brandSub: {
    fontSize: 12,
    marginTop: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DrawerContent;
