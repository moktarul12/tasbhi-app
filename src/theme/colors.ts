export const palette = {
  deepGreen: '#0F2A1D',
  deepGreenDark: '#081810',
  green: '#14432C',
  greenLight: '#1F5C3A',
  gold: '#D4AF37',
  goldLight: '#E8C766',
  cream: '#FAF6EC',
  creamDark: '#F1EAD9',
  ivory: '#FFFDF7',
  textDark: '#1B2B22',
  textMuted: '#6B7B70',
  danger: '#C0392B',
  white: '#FFFFFF',
};

export type ThemeMode = 'light' | 'dark';

export interface AppTheme {
  mode: ThemeMode;
  background: string;
  surface: string;
  card: string;
  primary: string;
  primaryDark: string;
  accent: string;
  text: string;
  textMuted: string;
  border: string;
  tabBar: string;
  headerText: string;
  danger: string;
}

export const lightTheme: AppTheme = {
  mode: 'light',
  background: palette.cream,
  surface: palette.ivory,
  card: '#FFFFFF',
  primary: palette.green,
  primaryDark: palette.deepGreen,
  accent: palette.gold,
  text: palette.textDark,
  textMuted: palette.textMuted,
  border: '#E4DDC9',
  tabBar: '#FFFFFF',
  headerText: palette.textDark,
  danger: palette.danger,
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  background: palette.deepGreenDark,
  surface: palette.deepGreen,
  card: palette.green,
  primary: palette.goldLight,
  primaryDark: palette.gold,
  accent: palette.gold,
  text: palette.cream,
  textMuted: '#A9BBAE',
  border: '#24402F',
  tabBar: palette.deepGreen,
  headerText: palette.cream,
  danger: '#E57368',
};
