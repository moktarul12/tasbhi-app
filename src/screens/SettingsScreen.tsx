import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from '../context/SettingsContext';
import { RootStackParamList } from '../navigation/types';
import { languages } from '../i18n/translations';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { theme, t, settings, setLanguage } = useSettings();
  const [showLangModal, setShowLangModal] = useState(false);

  const currentLangLabel = languages.find((l) => l.code === settings.language)?.native ?? 'English';

  const onReset = () => {
    Alert.alert('Reset App Data', 'This will clear all your zikr, stats and settings. Continue?', [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Onboarding' }],
          });
        },
      },
    ]);
  };

  const items: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; danger?: boolean; right?: string }[] = [
    { icon: 'language', label: t('language'), onPress: () => setShowLangModal(true), right: currentLangLabel },
    { icon: 'notifications', label: t('reminderSettings'), onPress: () => navigation.navigate('Reminders') },
    { icon: 'pricetags', label: t('categories'), onPress: () => navigation.navigate('Categories') },
    { icon: 'lock-closed', label: t('privacy'), onPress: () => Alert.alert(t('privacy'), 'Your data stays on your device.') },
    { icon: 'cloud-upload', label: t('backupRestore'), onPress: onReset },
    { icon: 'help-circle', label: t('helpSupport'), onPress: () => Alert.alert(t('helpSupport'), 'Contact us at support@zikrntashbi.app') },
    { icon: 'information-circle', label: t('aboutApp'), onPress: () => Alert.alert(t('appName'), t('tagline')) },
  ];

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
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('settings')}</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={{ height: 12 }} />

      {items.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border, marginBottom: 10 }]}
          onPress={item.onPress}
        >
          <View style={styles.rowLeft}>
            <Ionicons name={item.icon} size={18} color={theme.primary} />
            <Text style={[styles.rowLabel, { color: theme.text }]}>{item.label}</Text>
          </View>
          <View style={styles.rowLeft}>
            {!!item.right && <Text style={{ color: theme.textMuted, fontSize: 12 }}>{item.right}</Text>}
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.row, { borderColor: theme.danger, marginTop: 8 }]}
        onPress={onReset}
      >
        <View style={styles.rowLeft}>
          <Ionicons name="log-out" size={18} color={theme.danger} />
          <Text style={[styles.rowLabel, { color: theme.danger }]}>{t('logout')}</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={showLangModal} transparent animationType="fade" onRequestClose={() => setShowLangModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{t('chooseLanguage')}</Text>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={styles.modalItem}
                onPress={() => {
                  setLanguage(lang.code);
                  setShowLangModal(false);
                }}
              >
                <Text style={{ color: theme.text, fontSize: 15 }}>{lang.native}</Text>
                {settings.language === lang.code && <Ionicons name="checkmark" size={18} color={theme.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
});

export default SettingsScreen;
