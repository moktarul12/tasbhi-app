import { Zikr } from '../types';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export const defaultCategories: string[] = [
  'Praise',
  'Glorification',
  'Forgiveness',
  'Oneness',
  'Supplication',
];

export function buildDefaultZikrs(): Zikr[] {
  const today = todayStr();
  const base: Omit<Zikr, 'todayCount' | 'lastCountDate' | 'createdAt' | 'totalCount'>[] = [
    {
      id: 'subhanallah',
      nameEn: 'SubhanAllah',
      nameAr: 'سُبْحَانَ اللَّهِ',
      meaning: 'Glory be to Allah',
      category: 'Glorification',
      defaultCount: 33,
      icon: 'leaf',
    },
    {
      id: 'alhamdulillah',
      nameEn: 'Alhamdulillah',
      nameAr: 'الْحَمْدُ لِلَّهِ',
      meaning: 'All praise is due to Allah',
      category: 'Praise',
      defaultCount: 33,
      icon: 'flower',
    },
    {
      id: 'allahuakbar',
      nameEn: 'Allahu Akbar',
      nameAr: 'اللَّهُ أَكْبَرُ',
      meaning: 'Allah is the Greatest',
      category: 'Praise',
      defaultCount: 34,
      icon: 'star',
    },
    {
      id: 'lailahaillallah',
      nameEn: 'La ilaha illallah',
      nameAr: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
      meaning: 'There is no god but Allah',
      category: 'Oneness',
      defaultCount: 100,
      icon: 'moon',
    },
    {
      id: 'astagfirullah',
      nameEn: 'Astagfirullah',
      nameAr: 'أَسْتَغْفِرُ اللَّهَ',
      meaning: 'I seek forgiveness from Allah',
      category: 'Forgiveness',
      defaultCount: 100,
      icon: 'rain',
    },
    {
      id: 'subhanallahi-wabihamdihi',
      nameEn: 'SubhanAllahi wa bihamdihi',
      nameAr: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
      meaning: 'Glory be to Allah and praise Him',
      category: 'Glorification',
      defaultCount: 100,
      icon: 'sparkle',
    },
  ];

  return base.map((z, idx) => ({
    ...z,
    totalCount: 0,
    todayCount: 0,
    lastCountDate: today,
    createdAt: Date.now() + idx,
  }));
}
