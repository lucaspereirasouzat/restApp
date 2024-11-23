import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RestStore {
  workpaces: WorkSpace[];
  createWorkSpace: (workSpace: Exclude<WorkSpace, 'id'>) => void;
  removeWorkSpace: (id: string) => void;
  addFolderToWorkSpace: (workSpaceId: string, folder: Exclude<Folder, 'id'>) => void;
  addRequestToFolder: (workSpaceId: string, folderId: string, request: Exclude<RequestCustom, 'id'>) => void;
  removeFolder: (workSpaceId: string,folderId: string) => void;
  addRequestToWorkSpace: (workSpaceId: string, request: RequestCustom) => void;
  removeRequest: (workSpaceId: string,requestId: string) => void;
  pinRequest: (workSpaceId: string,requestId: string) => void;
  duplicateRequest: (workSpaceId: string,requestId: string) => void
}

type Item = { 
  pinned?: boolean;
  order: number 
} & (Folder | RequestCustom);

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
              id: generateUniqueId(),
              items: [],
              order: workpaces[indexCurrentWorkSpace].items.length + 1
            });
          } else {
            workpaces[indexCurrentWorkSpace].items = [{
              ...folder,
              items: [],
              id: generateUniqueId(),
              order: 0
            }];
          }
          set({workpaces});
        },
      addRequestToFolder: (workSpaceId, folderId, request) =>
        {
          let workpaces = get().workpaces;
          const indexCurrentWorkSpace = workpaces.findIndex((workSpace) => workSpace.id === workSpaceId.toString());
          const indexCurrentFolder = workpaces[indexCurrentWorkSpace].items.findIndex((folder) => folder.id === folderId);
          if(workpaces[indexCurrentWorkSpace].items[indexCurrentFolder].items){
            workpaces[indexCurrentWorkSpace].items[indexCurrentFolder].items.push({
              ...request,
              id: generateUniqueId(),
              order: workpaces[indexCurrentWorkSpace].items[indexCurrentFolder].items.length + 1
            });
          } else {
            workpaces[indexCurrentWorkSpace].items[indexCurrentFolder].items = [{
              ...request,
              id: generateUniqueId(),
              order: 0
            }];
          }
          set({workpaces});
        },
      
      removeFolder: (workSpaceId, folderId) =>{
          const workspaces = get().workpaces;
          const indexCurrentWorkSpace = workspaces.findIndex((workSpace) => workSpace.id === workSpaceId);
          const indexCurrentRequest = workspaces[indexCurrentWorkSpace].items.findIndex((request) => request.id === folderId);
          workspaces[indexCurrentWorkSpace].items.splice(indexCurrentRequest, 1);
          set({workspaces});
        },

        addRequestToWorkSpace: (workSpaceId, request) =>
        {
          let workpaces = get().workpaces;
          const indexCurrentWorkSpace = workpaces.findIndex((workSpace) => workSpace.id === workSpaceId.toString());
          console.log({
            workSpaceId, request
          });
          
          if(workpaces[indexCurrentWorkSpace]?.items){
            const requestIndex = workpaces[indexCurrentWorkSpace].items.findIndex((item) => item.id === request.id);

            if(requestIndex !== -1){
              workpaces[indexCurrentWorkSpace].items[requestIndex] = {
                ...request,
                order: workpaces[indexCurrentWorkSpace].items[requestIndex].order
              }
              return set({workpaces});
            }

            workpaces[indexCurrentWorkSpace].items.push({
              ...request,
              id: generateUniqueId(),
              order: workpaces[indexCurrentWorkSpace].items.length + 1
            });
          } else {
            workpaces[indexCurrentWorkSpace].items = [{
              ...request,
              id: generateUniqueId(),
              order: 0
            }];
          }
          set({workpaces});
        },
        removeRequest: (workSpaceId, requestId) => {
          const workspaces = get().workpaces;
          const indexCurrentWorkSpace = workspaces.findIndex((workSpace) => workSpace.id === workSpaceId);
          const indexCurrentRequest = workspaces[indexCurrentWorkSpace].items.findIndex((request) => request.id === requestId);
          workspaces[indexCurrentWorkSpace].items.splice(indexCurrentRequest, 1);
          set({workspaces});
        },
        pinRequest: (workSpaceId, requestId) => {
          const workspaces = get().workpaces;
          const indexCurrentWorkSpace = workspaces.findIndex((workSpace) => workSpace.id === workSpaceId);
          const indexCurrentRequest = workspaces[indexCurrentWorkSpace].items.findIndex((request) => request.id === requestId);
          workspaces[indexCurrentWorkSpace].items[indexCurrentRequest].pinned = !workspaces[indexCurrentWorkSpace].items[indexCurrentRequest].pinned;
          set({workspaces});
        },
        duplicateRequest: (workSpaceId, requestId) => {
          const workspaces = get().workpaces;
          const indexCurrentWorkSpace = workspaces.findIndex((workSpace) => workSpace.id === workSpaceId);
          const indexCurrentRequest = workspaces[indexCurrentWorkSpace].items.findIndex((request) => request.id === requestId);
          const request = workspaces[indexCurrentWorkSpace].items[indexCurrentRequest];
          workspaces[indexCurrentWorkSpace].items.push({
            ...request,
            name: `${request.name} - Copy`,
            id: generateUniqueId(),
            order: workspaces[indexCurrentWorkSpace].items.length + 1
          });
          set({workspaces});
        }
        
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
