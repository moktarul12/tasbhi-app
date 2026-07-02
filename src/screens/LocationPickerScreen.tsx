import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSettings } from '../context/SettingsContext';
import { useLocation } from '../context/LocationContext';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationPicker'>;

interface Result {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

const LocationPickerScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, t } = useSettings();
  const { requestCurrentLocation, setManualLocation, searchCity, permissionDenied } = useLocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);

  const onSearch = async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const found = await searchCity(text);
    setResults(found);
    setSearching(false);
  };

  const onUseCurrent = async () => {
    setLocating(true);
    const ok = await requestCurrentLocation();
    setLocating(false);
    if (ok) navigation.goBack();
  };

  const onSelect = (result: Result) => {
    setManualLocation(result);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('changeLocation')}</Text>
        <View style={{ width: 26 }} />
      </View>

      <TouchableOpacity
        style={[styles.currentBtn, { backgroundColor: theme.primary }]}
        onPress={onUseCurrent}
        disabled={locating}
      >
        {locating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="locate" size={18} color={theme.mode === 'dark' ? theme.primaryDark : '#fff'} />
            <Text style={[styles.currentBtnText, { color: theme.mode === 'dark' ? theme.primaryDark : '#fff' }]}>
              {t('useCurrentLocation')}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {permissionDenied && (
        <Text style={[styles.permissionText, { color: theme.danger }]}>{t('locationPermissionDenied')}</Text>
      )}

      <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Ionicons name="search" size={18} color={theme.textMuted} />
        <TextInput
          value={query}
          onChangeText={onSearch}
          placeholder={t('searchCity')}
          placeholderTextColor={theme.textMuted}
          style={[styles.searchInput, { color: theme.text }]}
        />
        {searching && <ActivityIndicator size="small" color={theme.primary} />}
      </View>

      <FlatList
        data={results}
        keyExtractor={(r, idx) => `${r.city}-${idx}`}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.resultRow, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => onSelect(item)}
          >
            <Ionicons name="location-outline" size={18} color={theme.primary} />
            <View>
              <Text style={[styles.resultCity, { color: theme.text }]}>{item.city}</Text>
              {!!item.country && <Text style={[styles.resultCountry, { color: theme.textMuted }]}>{item.country}</Text>}
            </View>
          </TouchableOpacity>
        )}
      />
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
  currentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 14,
    marginBottom: 12,
  },
  currentBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  permissionText: {
    fontSize: 12,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  resultCity: {
    fontSize: 14,
    fontWeight: '700',
  },
  resultCountry: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default LocationPickerScreen;
