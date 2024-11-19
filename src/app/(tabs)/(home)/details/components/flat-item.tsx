import { Collapsible } from "@/components/Collapsible";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Folder, FolderOpen, ChevronDown, Pin } from "lucide-react-native";
import { DropdownMenuListSelect } from "@/components/dropdonw-without-form";
import { useCallback } from "react";
import { Link } from "expo-router";

interface FlatItemProps {
  item: {
    id: string;
    name: string;
    color?: string;
    pinned?: boolean;
  };
  workSpaceId: string
  pinRequest: (workSpaceId: string, id: string) => void;
  removeFolder: (workSpaceId: string, id: string) => void;
  removeRequest: (workSpaceId: string, id: string) => void;
  duplicateRequest: (workSpaceId: string, id: string) => void;
  setOpenRequest: (workSpaceId: string, id: string) => void;
  setOpenFolder: (workSpaceId: string, id: string) => void;
}

const itensFolderToSelect = [
  { label: "Create Request", value: "create-request", color: "#fff" },
  { label: "New Folder", value: "new-folder", color: "#fff" },
  { label: "Duplicate Folder", value: "duplicate-folder", color: "#fff" },
  { label: "Rename Folder", value: "rename-folder", color: "#fff" },
  { label: "Delete Folder", value: "delete-folder", color: "#fff" },
];

const itensRequestToSelect = ({ pinned }: { pinned: boolean }) => [
  {
    label: `${pinned ? "Un" : ""}Pin Request`,
    value: "pin-request",
    color: "#fff",
  },
  { label: "Duplicate", value: "duplicate-request", color: "#fff" },
  { label: "Rename", value: "rename-request", color: "#fff" },
  { label: "Delete Request", value: "delete-request", color: "#fff" },
];

const methodsColors = {
  GET: "#1E90FF",
  POST: "#32CD32",
  PUT: "#FF8C00",
  DELETE: "#FF0000",
};

export function FlatItem({
  item,
  removeFolder,
  removeRequest,
  pinRequest,
  duplicateRequest,
  setOpenFolder,
  setOpenRequest,
  workSpaceId
}: FlatItemProps) {
  const MountFolderIcon = useCallback(
    ({ isOpen }: { isOpen: boolean }) => {
      if (isOpen) {
        return (
          <FolderOpen
            color={item.color ? item.color : "#fff"}
            className="size-4"
          />
        );
      }
      return (
        <Folder color={item.color ? item.color : "#fff"} className="size-4" />
      );
    },
    [item.color]
  );

  if (!item.color) {
    return (
      <View className="flex-row w-full justify-between p-2">
        <Link className="flex-row  p-2 w-11/12 bg-blue-600 gap-2 justify-between" href={`/request/${item.id}`}>
        <View className="flex-row  p-2 w-full bg-red-500 gap-2 justify-between">
          <View className="flex-row">
            <Text
              style={{ color: methodsColors[item.method] }}
              className={"text-xl"}
            >
              {" "}
              {item.method}
            </Text>
            <Text className="text-white text-base">{item.name}</Text>
          </View>
          {item.pinned && <Pin color={"#fff"} className="w-0.5 h-0.5" />}
        </View>
        </Link>
        <DropdownMenuListSelect
          defaultValue={"create-request"}
          valuesList={itensRequestToSelect({ pinned: item?.pinned ?? false })}
          onSelect={(e) => {
            if (e === "create-request") {
              setOpenRequest(workSpaceId,item.id);
            }
            if (e === "pin-request") {
              pinRequest(workSpaceId,item.id);
            }
            if (e === "duplicate-request") {
              duplicateRequest(workSpaceId,item.id);
            }
            if (e === "delete-request") {
              removeRequest(workSpaceId,item.id);
            }
          }}
        >
          <ChevronDown color={"#fff"} className="w-4 h-4 " />
        </DropdownMenuListSelect>
      </View>
    );
  }

  return (
    <View>
      <Collapsible
        header={({ isOpen, setIsOpen }) => (
          <>
            <View className="bg-black w-full flex flex-row p-2 justify-between ">
              <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
                <View className="w-[95%] flex-row p-2">
                  <MountFolderIcon isOpen={isOpen} />
                  <Text className="text-white text-xl"> {item.name}</Text>
                </View>
              </TouchableOpacity>
              <DropdownMenuListSelect
                defaultValue={"create-request"}
                valuesList={itensFolderToSelect}
                onSelect={(e) => {
                  if (e === "create-request") {
                    setOpenRequest(workSpaceId,item.id);
                  }
                  if (e === "delete-folder") {
                    removeFolder(workSpaceId,item.id);
                  }
                  if (e === "duplicate-folder") {
                    duplicateRequest(workSpaceId,item.id);
                  }
                }}
              >
                <ChevronDown color={"#fff"} className="w-4 h-4" />
              </DropdownMenuListSelect>
              {/* <TouchableOpacity onPress={() => console.log('clicked',item)} className="flex-row gap-2">
                <Plus color={"#fff"} className="w-4 h-4" />
              </TouchableOpacity> */}
            </View>
          </>
        )}
        title={item.name}
      >
        <FlatList
          ItemSeparatorComponent={() => <View className="h-0.5 bg-slate-500" />}
          className="flex-1 h-full pr-2"
          data={item?.items}
          extraData={[item?.items]}
          renderItem={({ item }) => (
            <View className="ml-5">
              <FlatItem
                workSpaceId={workSpaceId}
                duplicateRequest={duplicateRequest}
                setOpenRequest={setOpenRequest}
                setOpenFolder={setOpenFolder}
                removeFolder={removeFolder}
                removeRequest={removeRequest}
                item={item}
                pinRequest={pinRequest}
              />
            </View>
          )}
        />
      </Collapsible>
    </View>
  );
}
