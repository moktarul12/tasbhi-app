export interface ZikrSuggestion {
  nameEn: string;
  nameAr: string;
  meaning: string;
  category: string;
  defaultCount: number;
  icon: string;
  tags: string[];
}

export const zikrSuggestions: ZikrSuggestion[] = [
  // --- Kalima ---
  {
    nameEn: 'Kalima Tayyaba',
    nameAr: 'لَا إِلَٰهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ',
    meaning: 'There is no god but Allah, Muhammad is the Messenger of Allah',
    category: 'Oneness',
    defaultCount: 100,
    icon: 'moon',
    tags: ['kalima', 'tayyaba', 'first kalima', 'la ilaha'],
  },
  {
    nameEn: 'Kalima Shahada',
    nameAr: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    meaning: 'I bear witness that there is no god but Allah alone, and I bear witness that Muhammad is His servant and messenger',
    category: 'Oneness',
    defaultCount: 100,
    icon: 'moon',
    tags: ['kalima', 'shahada', 'second kalima', 'ashhadu'],
  },
  {
    nameEn: 'Kalima Tamjeed',
    nameAr: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ',
    meaning: 'Glory be to Allah, all praise is for Allah, there is no god but Allah, and Allah is the Greatest',
    category: 'Glorification',
    defaultCount: 100,
    icon: 'star',
    tags: ['kalima', 'tamjeed', 'third kalima', 'subhanallah'],
  },
  {
    nameEn: 'Kalima Tawheed',
    nameAr: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    meaning: 'There is no god but Allah alone, He has no partner, His is the dominion and praise, and He is powerful over everything',
    category: 'Oneness',
    defaultCount: 100,
    icon: 'moon',
    tags: ['kalima', 'tawheed', 'fourth kalima', 'la ilaha'],
  },
  {
    nameEn: 'Kalima Radd-e-Kufr',
    nameAr: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ أَنْ أُشْرِكَ بِكَ شَيْئًا وَأَنَا أَعْلَمُ بِهِ وَأَسْتَغْفِرُكَ لِمَا لَا أَعْلَمُ بِهِ',
    meaning: 'O Allah, I seek refuge in You from associating anything with You knowingly, and I seek Your forgiveness for what I do not know',
    category: 'Forgiveness',
    defaultCount: 100,
    icon: 'rain',
    tags: ['kalima', 'radd', 'kufr', 'fifth kalima'],
  },

  // --- Darood ---
  {
    nameEn: 'Darood Ibrahimi',
    nameAr: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    meaning: 'O Allah, send blessings upon Muhammad and the family of Muhammad as You sent blessings upon Ibrahim and the family of Ibrahim',
    category: 'Supplication',
    defaultCount: 100,
    icon: 'heart',
    tags: ['darood', 'ibrahimi', 'salawat', 'sallallahu', 'blessings'],
  },
  {
    nameEn: 'Darood Sharif (Short)',
    nameAr: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ',
    meaning: 'May Allah send blessings and peace upon him',
    category: 'Supplication',
    defaultCount: 100,
    icon: 'heart',
    tags: ['darood', 'short', 'sallallahu', 'salawat'],
  },
  {
    nameEn: 'Darood Ibrahim (Short)',
    nameAr: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    meaning: 'O Allah, send blessings upon Muhammad and the family of Muhammad',
    category: 'Supplication',
    defaultCount: 100,
    icon: 'heart',
    tags: ['darood', 'short', 'ibrahim', 'salli'],
  },

  // --- Common Zikr ---
  {
    nameEn: 'SubhanAllah',
    nameAr: 'سُبْحَانَ اللَّهِ',
    meaning: 'Glory be to Allah',
    category: 'Glorification',
    defaultCount: 33,
    icon: 'leaf',
    tags: ['subhanallah', 'tasbeeh', 'glory'],
  },
  {
    nameEn: 'Alhamdulillah',
    nameAr: 'الْحَمْدُ لِلَّهِ',
    meaning: 'All praise is due to Allah',
    category: 'Praise',
    defaultCount: 33,
    icon: 'flower',
    tags: ['alhamdulillah', 'hamd', 'praise', 'thankful'],
  },
  {
    nameEn: 'Allahu Akbar',
    nameAr: 'اللَّهُ أَكْبَرُ',
    meaning: 'Allah is the Greatest',
    category: 'Praise',
    defaultCount: 34,
    icon: 'star',
    tags: ['allahu', 'akbar', 'takbeer', 'greatest'],
  },
  {
    nameEn: 'La ilaha illallah',
    nameAr: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    meaning: 'There is no god but Allah',
    category: 'Oneness',
    defaultCount: 100,
    icon: 'moon',
    tags: ['la ilaha', 'illallah', 'tahleel', 'oneness'],
  },
  {
    nameEn: 'Astagfirullah',
    nameAr: 'أَسْتَغْفِرُ اللَّهَ',
    meaning: 'I seek forgiveness from Allah',
    category: 'Forgiveness',
    defaultCount: 100,
    icon: 'rain',
    tags: ['astagfirullah', 'istighfar', 'forgiveness', 'repent'],
  },
  {
    nameEn: 'SubhanAllahi wa bihamdihi',
    nameAr: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    meaning: 'Glory be to Allah and praise Him',
    category: 'Glorification',
    defaultCount: 100,
    icon: 'sparkle',
    tags: ['subhanallah', 'bihamdihi', 'glory', 'praise'],
  },
  {
    nameEn: 'SubhanAllahil Azeem',
    nameAr: 'سُبْحَانَ اللَّهِ الْعَظِيمِ',
    meaning: 'Glory be to Allah, the Most Great',
    category: 'Glorification',
    defaultCount: 100,
    icon: 'sparkle',
    tags: ['subhanallah', 'azeem', 'great', 'glory'],
  },
  {
    nameEn: 'La hawla wa la quwwata illa billah',
    nameAr: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    meaning: 'There is no power and no strength except with Allah',
    category: 'Supplication',
    defaultCount: 100,
    icon: 'sun',
    tags: ['hawla', 'quwwata', 'power', 'strength'],
  },
  {
    nameEn: 'Hasbunallahu wa nim al wakeel',
    nameAr: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    meaning: 'Allah is sufficient for us, and He is the best disposer of affairs',
    category: 'Supplication',
    defaultCount: 100,
    icon: 'sun',
    tags: ['hasbunallah', 'wakeel', 'sufficient', 'trust'],
  },
  {
    nameEn: 'Bismillah',
    nameAr: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    meaning: 'In the name of Allah, the Most Gracious, the Most Merciful',
    category: 'Praise',
    defaultCount: 1,
    icon: 'book',
    tags: ['bismillah', 'rahman', 'raheem', 'name of allah'],
  },

  // --- Ayat / Quranic ---
  {
    nameEn: 'Ayat al Kursi',
    nameAr: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    meaning: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence',
    category: 'Supplication',
    defaultCount: 1,
    icon: 'book',
    tags: ['ayat', 'kursi', 'throne', 'quran', 'protection'],
  },
  {
    nameEn: 'Surah Al-Ikhlas',
    nameAr: 'قُلْ هُوَ اللَّهُ أَحَدٌ اللَّهُ الصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
    meaning: 'Say, He is Allah, who is One, Allah, the Eternal Refuge, He neither begets nor is born, nor is there to Him any equivalent',
    category: 'Oneness',
    defaultCount: 3,
    icon: 'book',
    tags: ['surah', 'ikhlas', 'oneness', 'quran', 'ahad'],
  },
  {
    nameEn: 'Surah Al-Fatiha',
    nameAr: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    meaning: 'All praise is due to Allah, Lord of the worlds',
    category: 'Praise',
    defaultCount: 1,
    icon: 'book',
    tags: ['surah', 'fatiha', 'opening', 'quran', 'hamd'],
  },
  {
    nameEn: 'Surah An-Nas',
    nameAr: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    meaning: 'Say, I seek refuge in the Lord of mankind',
    category: 'Supplication',
    defaultCount: 3,
    icon: 'book',
    tags: ['surah', 'nas', 'mankind', 'quran', 'refuge'],
  },
  {
    nameEn: 'Surah Al-Falaq',
    nameAr: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
    meaning: 'Say, I seek refuge in the Lord of the dawn',
    category: 'Supplication',
    defaultCount: 3,
    icon: 'book',
    tags: ['surah', 'falaq', 'dawn', 'quran', 'refuge'],
  },

  // --- Additional Tasbeeh ---
  {
    nameEn: 'Ya Rahman',
    nameAr: 'يَا رَحْمَٰنُ',
    meaning: 'O Most Gracious',
    category: 'Praise',
    defaultCount: 100,
    icon: 'heart',
    tags: ['rahman', 'gracious', 'name of allah', 'asma'],
  },
  {
    nameEn: 'Ya Raheem',
    nameAr: 'يَا رَحِيمُ',
    meaning: 'O Most Merciful',
    category: 'Praise',
    defaultCount: 100,
    icon: 'heart',
    tags: ['raheem', 'merciful', 'name of allah', 'asma'],
  },
  {
    nameEn: 'Ya Wadud',
    nameAr: 'يَا وَدُودُ',
    meaning: 'O Most Loving',
    category: 'Praise',
    defaultCount: 100,
    icon: 'heart',
    tags: ['wadud', 'loving', 'name of allah', 'asma'],
  },
  {
    nameEn: 'Ya Salam',
    nameAr: 'يَا سَلَامُ',
    meaning: 'O Source of Peace',
    category: 'Praise',
    defaultCount: 100,
    icon: 'sparkle',
    tags: ['salam', 'peace', 'name of allah', 'asma'],
  },
  {
    nameEn: 'Allahumma salli ala Muhammad',
    nameAr: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    meaning: 'O Allah, send blessings upon Muhammad',
    category: 'Supplication',
    defaultCount: 100,
    icon: 'heart',
    tags: ['darood', 'salli', 'muhammad', 'blessings', 'salawat'],
  },
];

export function searchSuggestions(query: string): ZikrSuggestion[] {
  const q = query.toLowerCase().trim();
  if (!q) return zikrSuggestions.slice(0, 6);
  return zikrSuggestions.filter((s) => {
    const haystack = [s.nameEn, s.nameAr, s.meaning, ...s.tags].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}
