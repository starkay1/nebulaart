declare module '@react-native-async-storage/async-storage' {
  export default class AsyncStorage {
    static getItem(key: string): Promise<string | null>;
    static setItem(key: string, value: string): Promise<void>;
    static removeItem(key: string): Promise<void>;
    static clear(): Promise<void>;
    static getAllKeys(): Promise<readonly string[]>;
    static multiGet(keys: readonly string[]): Promise<readonly [string, string | null][]>;
    static multiSet(keyValuePairs: readonly [string, string][]): Promise<void>;
    static multiRemove(keys: readonly string[]): Promise<void>;
  }
}
