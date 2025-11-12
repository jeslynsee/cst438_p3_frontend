import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

export async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === "web") {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    if (value == null) await SecureStore.deleteItemAsync(key);
    else await SecureStore.setItemAsync(key, value);
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {

      try {
        if (Platform.OS === "web") {
          const value = localStorage.getItem(key);
          if (isMounted) {
            setState(value);
            setIsLoading(false);
          }
        } else {
          const value = await SecureStore.getItemAsync(key);
          if (isMounted) {
            setState(value);
            setIsLoading(false);
          }
        }
      } catch (e) {
        console.error("Error loading storage:", e);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [key]);

  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [[isLoading, state], setValue];
}