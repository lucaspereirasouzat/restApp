import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RestStore {
  workpaces: WorkSpace[];
  createWorkSpace: (workSpace: Exclude<WorkSpace, 'id'>) => void;
  removeWorkSpace: (id: string) => void;
  addFolderToWorkSpace: (workSpaceId: string, folder: Exclude<Folder, 'id'>) => void;
  addRequestToFolder: (folderId: string, request: Exclude<RequestCustom, 'id'>) => void;
  removeFolder: (folderId: string) => void;
  addRequestToWorkSpace: (workSpaceId: string, request: RequestCustom) => void;
  removeRequest: (requestId: string) => void;
}

type Item = {order: number } & (Folder | RequestCustom);

interface WorkSpace {
  id?: string;
  name: string;
  description?: string;
  items: Item[]
  createdAt?: string;
  updatedAt?: string;
}

interface Folder {
  id: string;
  name: string;
  items: Item[]
  createdAt?: string;
  updatedAt?: string;
}

interface RequestCustom {
  id: string;
  name: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: Record<string, string>;

  createdAt?: string;
  updatedAt?: string;
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
            { ...workSpace, id: generateUniqueId(), folders: [], items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          ],
        })),
      addFolderToWorkSpace: (workSpaceId, folder) =>
        {
          let workpaces = get().workpaces;
          const indexCurrentWorkSpace = workpaces.findIndex((workSpace) => workSpace.id === workSpaceId.toString());
          if(workpaces[indexCurrentWorkSpace].items){
            workpaces[indexCurrentWorkSpace].items.push({
              ...folder,
              order: workpaces[indexCurrentWorkSpace].items.length + 1
            });
          } else {
            workpaces[indexCurrentWorkSpace].items = [{
              ...folder,
              order: 0
            }];
          }
          set({workpaces});
        },
      addRequestToFolder: (folderId, request) =>
        {
          let workpaces = get().workpaces;
          const indexCurrentWorkSpace = workpaces.findIndex((workSpace) => workSpace.items.find((folder) => folder.id === folderId));
          const indexCurrentFolder = workpaces[indexCurrentWorkSpace].items.findIndex((folder) => folder.id === folderId);
          if(workpaces[indexCurrentWorkSpace].items[indexCurrentFolder].items){
            workpaces[indexCurrentWorkSpace].items[indexCurrentFolder].items.push({
              ...request,
              order: workpaces[indexCurrentWorkSpace].items[indexCurrentFolder].items.length + 1
            });
          } else {
            workpaces[indexCurrentWorkSpace].items[indexCurrentFolder].items = [{
              ...request,
              order: 0
            }];
          }
          set({workpaces});
        },
      
      removeFolder: (folderId) =>
        set((state) => ({
          workpaces: state.workpaces.map((workSpace) => ({
            ...workSpace,
            folders: workSpace.items.filter(
              (folder) => folder.id !== folderId
            ),
          })),
        })),

        addRequestToWorkSpace: (workSpaceId, request) =>
        {
          let workpaces = get().workpaces;
          const indexCurrentWorkSpace = workpaces.findIndex((workSpace) => workSpace.id === workSpaceId.toString());
          if(workpaces[indexCurrentWorkSpace].items){
            workpaces[indexCurrentWorkSpace].items.push({
              ...request,
              order: workpaces[indexCurrentWorkSpace].items.length + 1
            });
          } else {
            workpaces[indexCurrentWorkSpace].items = [{
              ...request,
              order: 0
            }];
          }
          set({workpaces});
        },
        removeRequest: (requestId) =>
        set((state) => ({
          workpaces: state.workpaces.map((workSpace) => ({
            ...workSpace,
            items: workSpace.items.filter(
              (request) => request.id !== requestId
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
