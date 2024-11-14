import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RestStore {
  workpaces: WorkSpace[];
  createWorkSpace: (workSpace: Exclude<WorkSpace, 'id'>) => void;
  removeWorkSpace: (id: string) => void;
  addFolderToWorkSpace: (workSpaceId: string, folder: Folder) => void;
  addRequestToFolder: (folderId: string, request: RequestCustom) => void;
  removeFolder: (folderId: string) => void;
}

interface WorkSpace {
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

export const useRestStore = create(
  persist<RestStore>(
    (set,get) => ({
      workpaces: [],
      removeWorkSpace: (id) =>
        set((state) => ({
          workpaces: state.workpaces.filter((workSpace) => workSpace.id !== id),
        })),
      createWorkSpace: (workSpace) =>
        set((state) => ({
          workpaces: [
            ...state.workpaces,
            { ...workSpace, id: generateUniqueId(), folders: [], requests: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          ],
        })),
      addFolderToWorkSpace: (workSpaceId, folder) =>
        {
          let workpaces = get().workpaces;
          const indexCurrentWorkSpace = workpaces.findIndex((workSpace) => workSpace.id === workSpaceId.toString());
          if(workpaces[indexCurrentWorkSpace].folders){
            workpaces[indexCurrentWorkSpace].folders.push(folder);
          } else {
            workpaces[indexCurrentWorkSpace].folders = [folder];
          }
          set({workpaces});
        },
      addRequestToFolder: (folderId, request) =>
        {
          let workpaces = get().workpaces;
          const indexCurrentWorkSpace = workpaces.findIndex((workSpace) => workSpace.folders.find((folder) => folder.id === folderId));
          const indexCurrentFolder = workpaces[indexCurrentWorkSpace].folders.findIndex((folder) => folder.id === folderId);
          if(workpaces[indexCurrentWorkSpace].folders[indexCurrentFolder].requests){
            workpaces[indexCurrentWorkSpace].folders[indexCurrentFolder].requests.push(request);
          } else {
            workpaces[indexCurrentWorkSpace].folders[indexCurrentFolder].requests = [request];
          }
          set({workpaces});
        },
      removeFolder: (folderId) =>
        set((state) => ({
          workpaces: state.workpaces.map((workSpace) => ({
            ...workSpace,
            folders: workSpace.folders.filter(
              (folder) => folder.id !== folderId
            ),
          })),
        })),
    }),
    {
      name: "rest-store", // The key for AsyncStorage
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
