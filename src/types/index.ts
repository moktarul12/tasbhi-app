export type LanguageCode = 'en' | 'bn' | 'hi' | 'ur';

export interface Zikr {
  id: string;
  nameEn: string;
  nameAr?: string;
  meaning?: string;
  category: string;
  defaultCount: number;
  icon: string;
  totalCount: number;
  todayCount: number;
  lastCountDate: string;
  createdAt: number;
}

export interface Reminder {
  id: string;
  label: string;
  time: string; // HH:mm
  enabled: boolean;
}

export interface DailyLog {
  [date: string]: {
    [zikrId: string]: number;
  };
}

export interface AppSettings {
  language: LanguageCode;
  themeMode: 'light' | 'dark';
  hapticEnabled: boolean;
  onboardingDone: boolean;
  languageSelected: boolean;
  dailyGoal: number;
}
