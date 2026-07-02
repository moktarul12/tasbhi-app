import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppSettings, LanguageCode } from '../types';
import { KEYS, loadJSON, saveJSON } from '../utils/storage';
import { translate } from '../i18n/translations';
import { AppTheme, lightTheme } from '../theme/colors';

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  themeMode: 'light',
  hapticEnabled: true,
  onboardingDone: false,
  languageSelected: false,
  dailyGoal: 100,
};

interface SettingsContextValue {
  settings: AppSettings;
  loading: boolean;
  theme: AppTheme;
  t: (key: string) => string;
  setLanguage: (lang: LanguageCode) => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
  toggleHaptic: (enabled: boolean) => void;
  completeOnboarding: () => void;
  completeLanguageSelection: () => void;
  setDailyGoal: (goal: number) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await loadJSON<AppSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
      setSettings(stored);
      setLoading(false);
    })();
  }, []);

  const persist = (next: AppSettings) => {
    setSettings(next);
    saveJSON(KEYS.SETTINGS, next);
  };

  const value = useMemo<SettingsContextValue>(() => ({
    settings,
    loading,
    theme: lightTheme,
    t: (key: string) => translate(settings.language, key),
    setLanguage: (lang) => persist({ ...settings, language: lang }),
    setThemeMode: (mode) => persist({ ...settings, themeMode: mode }),
    toggleHaptic: (enabled) => persist({ ...settings, hapticEnabled: enabled }),
    completeOnboarding: () => persist({ ...settings, onboardingDone: true }),
    completeLanguageSelection: () => persist({ ...settings, languageSelected: true }),
    setDailyGoal: (goal) => persist({ ...settings, dailyGoal: goal }),
  }), [settings, loading]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
