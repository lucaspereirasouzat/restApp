import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HistoryStore {
  history: History[];
  addToHistory: (history: Exclude<History, 'id'>) => void;
}

interface History {
  id?: string;
  name: string;
  description?: string;
  folders: Folder[];
  requests: RequestCustom[];
  createdAt?: string;
  updatedAt?: string;
}

interface Folder {
  id: string;
  name: string;
  requests: RequestCustom[];
}

interface RequestCustom {
  id: string;
  name: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: Record<string, string>;
}

function generateUniqueId() {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const useHistoryStore = create(
  persist<HistoryStore>(
    (set,get) => ({
      history: [],
      addToHistory: (history) =>
        set((state) => ({
          history: [
            ...state.history,
            { ...history, id: generateUniqueId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          ],
        })),
    }),
    {
      name: "history-store", // The key for AsyncStorage
      storage: {
        getItem: async (name) => {
          const item = await AsyncStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
