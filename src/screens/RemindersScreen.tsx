import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../context/SettingsContext';
import { useZikr } from '../context/ZikrContext';
import { RootStackParamList } from '../navigation/types';
import { palette } from '../theme/colors';
import PrimaryButton from '../components/PrimaryButton';

const RemindersScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme, t } = useSettings();
  const { reminders, toggleReminder, addReminder, deleteReminder } = useZikr();
  const [enabledAll, setEnabledAll] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState('');
  const [time, setTime] = useState('');

  const onAdd = () => {
    if (!label.trim() || !time.trim()) return;
    addReminder({ label: label.trim(), time: time.trim(), enabled: true });
    setLabel('');
    setTime('');
    setShowForm(false);
  };

  const onLongPressDelete = (id: string, name: string) => {
    Alert.alert(name, 'Delete this reminder?', [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: () => deleteReminder(id) },
    ]);
  };

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
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('reminders')}</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={[styles.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.rowLabel, { color: theme.text }]}>{t('enableReminders')}</Text>
        <Switch
          value={enabledAll}
          onValueChange={setEnabledAll}
          trackColor={{ true: palette.gold, false: theme.border }}
        />
      </View>

      <View style={{ gap: 10, marginTop: 16 }}>
        {reminders.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={[styles.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onLongPress={() => onLongPressDelete(r.id, r.label)}
          >
            <View>
              <Text style={[styles.timeText, { color: theme.text }]}>{r.time}</Text>
              <Text style={[styles.labelText, { color: theme.textMuted }]}>{r.label}</Text>
            </View>
            <Switch
              value={r.enabled && enabledAll}
              onValueChange={(v) => toggleReminder(r.id, v)}
              trackColor={{ true: palette.gold, false: theme.border }}
            />
          </TouchableOpacity>
        ))}
      </View>

      {showForm && (
        <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TextInput
            placeholder="Reminder label"
            placeholderTextColor={theme.textMuted}
            value={label}
            onChangeText={setLabel}
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          />
          <TextInput
            placeholder="e.g. 07:30 AM"
            placeholderTextColor={theme.textMuted}
            value={time}
            onChangeText={setTime}
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          />
          <PrimaryButton title={t('save')} onPress={onAdd} />
        </View>
      )}

      <PrimaryButton
        title={t('addReminder')}
        onPress={() => setShowForm((s) => !s)}
        style={{ marginTop: 16, backgroundColor: theme.primary }}
      />
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
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 15,
    fontWeight: '700',
  },
  labelText: {
    fontSize: 12,
    marginTop: 2,
  },
  formCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginTop: 16,
    gap: 10,
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
});

export default RemindersScreen;
