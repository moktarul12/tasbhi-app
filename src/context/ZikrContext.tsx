import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DailyLog, Reminder, Zikr } from '../types';
import { KEYS, loadJSON, saveJSON } from '../utils/storage';
import { buildDefaultZikrs, defaultCategories } from '../data/defaultZikrs';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function startOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day + 6) % 7; // Monday as first day
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export type StatsRange = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface ZikrContextValue {
  zikrs: Zikr[];
  categories: string[];
  reminders: Reminder[];
  dailyLogs: DailyLog;
  loading: boolean;
  lastZikrId: string | null;
  setLastZikrId: (id: string) => void;
  addZikr: (input: Omit<Zikr, 'id' | 'totalCount' | 'todayCount' | 'lastCountDate' | 'createdAt'>) => Zikr;
  updateZikr: (id: string, input: Partial<Zikr>) => void;
  deleteZikr: (id: string) => void;
  incrementZikr: (id: string, amount?: number) => void;
  resetZikrToday: (id: string) => void;
  getZikr: (id: string) => Zikr | undefined;
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  toggleReminder: (id: string, enabled: boolean) => void;
  deleteReminder: (id: string) => void;
  getStats: (range: StatsRange) => { total: number; topZikrs: { zikr: Zikr; count: number }[] };
}

const ZikrContext = createContext<ZikrContextValue | undefined>(undefined);

const DEFAULT_REMINDERS: Reminder[] = [
  { id: 'r1', label: 'Morning Zikr', time: '06:00 AM', enabled: true },
  { id: 'r2', label: 'Afternoon Zikr', time: '12:00 PM', enabled: true },
  { id: 'r3', label: 'Evening Zikr', time: '06:00 PM', enabled: true },
  { id: 'r4', label: 'Before Sleep', time: '10:00 PM', enabled: false },
];

export const ZikrProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zikrs, setZikrs] = useState<Zikr[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [reminders, setReminders] = useState<Reminder[]>(DEFAULT_REMINDERS);
  const [dailyLogs, setDailyLogs] = useState<DailyLog>({});
  const [lastZikrId, setLastZikrIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedZikrs = await loadJSON<Zikr[] | null>(KEYS.ZIKRS, null);
      const initialZikrs = storedZikrs && storedZikrs.length ? storedZikrs : buildDefaultZikrs();
      setZikrs(initialZikrs);
      if (!storedZikrs) await saveJSON(KEYS.ZIKRS, initialZikrs);

      const storedCategories = await loadJSON<string[]>(KEYS.CATEGORIES, defaultCategories);
      setCategories(storedCategories);

      const storedReminders = await loadJSON<Reminder[]>(KEYS.REMINDERS, DEFAULT_REMINDERS);
      setReminders(storedReminders);

      const storedLogs = await loadJSON<DailyLog>(KEYS.DAILY_LOGS, {});
      setDailyLogs(storedLogs);

      const storedLast = await loadJSON<string | null>(KEYS.LAST_ZIKR_ID, initialZikrs[0]?.id ?? null);
      setLastZikrIdState(storedLast);

      setLoading(false);
    })();
  }, []);

  const persistZikrs = (next: Zikr[]) => {
    setZikrs(next);
    saveJSON(KEYS.ZIKRS, next);
  };

  const persistLogs = (next: DailyLog) => {
    setDailyLogs(next);
    saveJSON(KEYS.DAILY_LOGS, next);
  };

  const setLastZikrId = (id: string) => {
    setLastZikrIdState(id);
    saveJSON(KEYS.LAST_ZIKR_ID, id);
  };

  const addZikr: ZikrContextValue['addZikr'] = (input) => {
    const newZikr: Zikr = {
      ...input,
      id: `${input.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      totalCount: 0,
      todayCount: 0,
      lastCountDate: todayStr(),
      createdAt: Date.now(),
    };
    persistZikrs([newZikr, ...zikrs]);
    return newZikr;
  };

  const updateZikr = (id: string, input: Partial<Zikr>) => {
    persistZikrs(zikrs.map((z) => (z.id === id ? { ...z, ...input } : z)));
  };

  const deleteZikr = (id: string) => {
    persistZikrs(zikrs.filter((z) => z.id !== id));
    if (lastZikrId === id) {
      const remaining = zikrs.filter((z) => z.id !== id);
      setLastZikrId(remaining[0]?.id ?? '');
    }
  };

  const getZikr = (id: string) => zikrs.find((z) => z.id === id);

  const incrementZikr = (id: string, amount: number = 1) => {
    const today = todayStr();
    let updated: Zikr | undefined;
    const next = zikrs.map((z) => {
      if (z.id !== id) return z;
      const isNewDay = z.lastCountDate !== today;
      updated = {
        ...z,
        todayCount: (isNewDay ? 0 : z.todayCount) + amount,
        totalCount: z.totalCount + amount,
        lastCountDate: today,
      };
      return updated;
    });
    persistZikrs(next);
    setLastZikrId(id);

    const nextLogs: DailyLog = { ...dailyLogs };
    const dayLog = { ...(nextLogs[today] ?? {}) };
    dayLog[id] = (dayLog[id] ?? 0) + amount;
    nextLogs[today] = dayLog;
    persistLogs(nextLogs);
  };

  const resetZikrToday = (id: string) => {
    const today = todayStr();
    persistZikrs(zikrs.map((z) => (z.id === id ? { ...z, todayCount: 0, lastCountDate: today } : z)));
    const nextLogs: DailyLog = { ...dailyLogs };
    if (nextLogs[today]) {
      const dayLog = { ...nextLogs[today] };
      delete dayLog[id];
      nextLogs[today] = dayLog;
      persistLogs(nextLogs);
    }
  };

  const addCategory = (name: string) => {
    if (!name.trim() || categories.includes(name.trim())) return;
    const next = [...categories, name.trim()];
    setCategories(next);
    saveJSON(KEYS.CATEGORIES, next);
  };

  const deleteCategory = (name: string) => {
    const next = categories.filter((c) => c !== name);
    setCategories(next);
    saveJSON(KEYS.CATEGORIES, next);
  };

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const next = [...reminders, { ...reminder, id: `rem-${Date.now()}` }];
    setReminders(next);
    saveJSON(KEYS.REMINDERS, next);
  };

  const toggleReminder = (id: string, enabled: boolean) => {
    const next = reminders.map((r) => (r.id === id ? { ...r, enabled } : r));
    setReminders(next);
    saveJSON(KEYS.REMINDERS, next);
  };

  const deleteReminder = (id: string) => {
    const next = reminders.filter((r) => r.id !== id);
    setReminders(next);
    saveJSON(KEYS.REMINDERS, next);
  };

  const getStats: ZikrContextValue['getStats'] = (range) => {
    const now = new Date();
    let fromDate: Date;
    if (range === 'daily') {
      fromDate = new Date(now);
      fromDate.setHours(0, 0, 0, 0);
    } else if (range === 'weekly') {
      fromDate = startOfWeek(now);
    } else if (range === 'monthly') {
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      fromDate = new Date(now.getFullYear(), 0, 1);
    }

    const totalsByZikr: Record<string, number> = {};
    let total = 0;
    Object.entries(dailyLogs).forEach(([dateStr, entries]) => {
      const d = new Date(dateStr);
      if (d >= fromDate) {
        Object.entries(entries).forEach(([zikrId, count]) => {
          totalsByZikr[zikrId] = (totalsByZikr[zikrId] ?? 0) + count;
          total += count;
        });
      }
    });

    const topZikrs = Object.entries(totalsByZikr)
      .map(([zikrId, count]) => ({ zikr: getZikr(zikrId), count }))
      .filter((x): x is { zikr: Zikr; count: number } => !!x.zikr)
      .sort((a, b) => b.count - a.count);

    return { total, topZikrs };
  };

  const value = useMemo<ZikrContextValue>(() => ({
    zikrs,
    categories,
    reminders,
    dailyLogs,
    loading,
    lastZikrId,
    setLastZikrId,
    addZikr,
    updateZikr,
    deleteZikr,
    incrementZikr,
    resetZikrToday,
    getZikr,
    addCategory,
    deleteCategory,
    addReminder,
    toggleReminder,
    deleteReminder,
    getStats,
  }), [zikrs, categories, reminders, dailyLogs, loading, lastZikrId]);

  return <ZikrContext.Provider value={value}>{children}</ZikrContext.Provider>;
};

export function useZikr(): ZikrContextValue {
  const ctx = useContext(ZikrContext);
  if (!ctx) throw new Error('useZikr must be used within ZikrProvider');
  return ctx;
}
