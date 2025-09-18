import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StorageKeys {
  USER_TOKEN: string;
  USER_DATA: string;
  FOLLOWED_ARTISTS: string;
  SAVED_ARTWORKS: string;
  USER_BOARDS: string;
  USER_CURATIONS: string;
  APP_SETTINGS: string;
}

export const STORAGE_KEYS: StorageKeys = {
  USER_TOKEN: '@nebula_art:user_token',
  USER_DATA: '@nebula_art:user_data',
  FOLLOWED_ARTISTS: '@nebula_art:followed_artists',
  SAVED_ARTWORKS: '@nebula_art:saved_artworks',
  USER_BOARDS: '@nebula_art:user_boards',
  USER_CURATIONS: '@nebula_art:user_curations',
  APP_SETTINGS: '@nebula_art:app_settings',
};

export const storeData = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
};

export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};

export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};

export const multiGet = async (keys: string[]): Promise<readonly [string, string | null][]> => {
  try {
    return await AsyncStorage.multiGet(keys);
  } catch (error) {
    console.error('Error getting multiple data:', error);
    return [];
  }
};

export const multiSet = async (keyValuePairs: [string, string][]): Promise<void> => {
  try {
    await AsyncStorage.multiSet(keyValuePairs);
  } catch (error) {
    console.error('Error setting multiple data:', error);
    throw error;
  }
};
