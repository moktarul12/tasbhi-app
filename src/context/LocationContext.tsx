import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as Location from 'expo-location';
import { KEYS, loadJSON, saveJSON } from '../utils/storage';

export interface AppLocation {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  source: 'gps' | 'manual' | 'default';
}

const DEFAULT_LOCATION: AppLocation = {
  latitude: 21.4225,
  longitude: 39.8262,
  city: 'Makkah',
  country: 'Saudi Arabia',
  source: 'default',
};

interface LocationSearchResult {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

interface LocationContextValue {
  location: AppLocation;
  loading: boolean;
  permissionDenied: boolean;
  requestCurrentLocation: () => Promise<boolean>;
  setManualLocation: (result: LocationSearchResult) => void;
  searchCity: (query: string) => Promise<LocationSearchResult[]>;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<AppLocation>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await loadJSON<AppLocation>(KEYS.LOCATION, DEFAULT_LOCATION);
      setLocation(stored);
      setLoading(false);
    })();
  }, []);

  const persist = (next: AppLocation) => {
    setLocation(next);
    saveJSON(KEYS.LOCATION, next);
  };

  const requestCurrentLocation = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        return false;
      }
      setPermissionDenied(false);
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = position.coords;

      let city = 'Current Location';
      let country = '';
      try {
        const places = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (places[0]) {
          city = places[0].city || places[0].subregion || places[0].region || city;
          country = places[0].country || '';
        }
      } catch (e) {
        // reverse geocode failed, keep generic label
      }

      persist({ latitude, longitude, city, country, source: 'gps' });
      return true;
    } catch (e) {
      return false;
    }
  };

  const setManualLocation = (result: LocationSearchResult) => {
    persist({ ...result, source: 'manual' });
  };

  const searchCity = async (query: string): Promise<LocationSearchResult[]> => {
    if (!query.trim()) return [];
    try {
      const results = await Location.geocodeAsync(query);
      const withNames = await Promise.all(
        results.slice(0, 6).map(async (r) => {
          let city = query;
          let country = '';
          try {
            const places = await Location.reverseGeocodeAsync({ latitude: r.latitude, longitude: r.longitude });
            if (places[0]) {
              city = places[0].city || places[0].subregion || places[0].region || query;
              country = places[0].country || '';
            }
          } catch (e) {
            // ignore
          }
          return { latitude: r.latitude, longitude: r.longitude, city, country };
        })
      );
      return withNames;
    } catch (e) {
      return [];
    }
  };

  const value = useMemo<LocationContextValue>(
    () => ({ location, loading, permissionDenied, requestCurrentLocation, setManualLocation, searchCity }),
    [location, loading, permissionDenied]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}
