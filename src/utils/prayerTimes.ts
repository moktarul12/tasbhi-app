import { CalculationMethod, Coordinates, Madhab, PrayerTimes, Qibla } from 'adhan';

export interface DayPrayerTimes {
  date: Date;
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  sehriEnds: Date;
  iftar: Date;
}

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export function computePrayerTimes(latitude: number, longitude: number, date: Date): DayPrayerTimes {
  const coordinates = new Coordinates(latitude, longitude);
  const params = CalculationMethod.MuslimWorldLeague();
  params.madhab = Madhab.Shafi;
  const times = new PrayerTimes(coordinates, date, params);

  return {
    date,
    fajr: times.fajr,
    sunrise: times.sunrise,
    dhuhr: times.dhuhr,
    asr: times.asr,
    maghrib: times.maghrib,
    isha: times.isha,
    sehriEnds: times.fajr,
    iftar: times.maghrib,
  };
}

export function computeQiblaBearing(latitude: number, longitude: number): number {
  const coordinates = new Coordinates(latitude, longitude);
  return Qibla(coordinates);
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export function getNextPrayer(times: DayPrayerTimes, now: Date = new Date()): { key: PrayerKey; time: Date } | null {
  const order: PrayerKey[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
  for (const key of order) {
    if (times[key].getTime() > now.getTime()) {
      return { key, time: times[key] };
    }
  }
  return null;
}

export function getCurrentPrayer(times: DayPrayerTimes, now: Date = new Date()): PrayerKey | 'none' {
  const order: PrayerKey[] = ['isha', 'maghrib', 'asr', 'dhuhr', 'sunrise', 'fajr'];
  for (const key of order) {
    if (now.getTime() >= times[key].getTime()) {
      return key;
    }
  }
  return 'none';
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
