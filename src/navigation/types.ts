export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Language: undefined;
  MainTabs: undefined;
  AddZikr: undefined;
  EditZikr: { zikrId: string };
  ZikrDetail: { zikrId: string };
  LocationPicker: undefined;
  Statistics: undefined;
  Reminders: undefined;
  Categories: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ZikrListTab: undefined;
  PrayerTab: undefined;
  QiblaTab: undefined;
  MoreTab: undefined;
};
