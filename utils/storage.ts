import { isWeb } from './platform';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Platform-agnostic storage utility
 * Uses localStorage on web, AsyncStorage on native
 */
export const storage = {
  async getItem(key: string): Promise<string | null> {
    if (isWeb) {
      if (typeof window !== 'undefined') {
        return window.localStorage.getItem(key);
      }
      return null;
    }
    return await AsyncStorage.getItem(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (isWeb) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
      }
      return;
    }
    await AsyncStorage.setItem(key, value);
  },

  async removeItem(key: string): Promise<void> {
    if (isWeb) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      return;
    }
    await AsyncStorage.removeItem(key);
  },

  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    if (isWeb) {
      if (typeof window !== 'undefined') {
        return keys.map(key => [key, window.localStorage.getItem(key)]);
      }
      return keys.map(key => [key, null]);
    }
    return await AsyncStorage.multiGet(keys);
  },

  async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    if (isWeb) {
      if (typeof window !== 'undefined') {
        keyValuePairs.forEach(([key, value]) => {
          window.localStorage.setItem(key, value);
        });
      }
      return;
    }
    await AsyncStorage.multiSet(keyValuePairs);
  },

  async multiRemove(keys: string[]): Promise<void> {
    if (isWeb) {
      if (typeof window !== 'undefined') {
        keys.forEach(key => window.localStorage.removeItem(key));
      }
      return;
    }
    await AsyncStorage.multiRemove(keys);
  },
};

