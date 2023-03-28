import { useLocalStorage } from "react-use";

export function useLocalStorageSerializeKey<T>(
  key: string | any[],
  value: T,
  opts?: {
    raw: boolean;
    serializer: (val: T) => string;
    deserializer: (value: string) => T;
  }
) {
  key = JSON.stringify(key);

  return useLocalStorage<T>(key, value, opts);
}
