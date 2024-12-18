import { useRestStore } from "@/store/useRestStore";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  FlatList,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ModalDialogFolder } from "./components/folder";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Plus } from "lucide-react-native";
import { DropdownMenuListSelect } from "../../../../components/dropdonw-without-form";
import { sortList } from "@/constants/sort-list";
import { FlatItem } from "./components/flat-item";
import { ModalDialogRequest } from "./components/request";
import { AnimatePresence, MotiView } from "moti";
import DraggableFlatList from "react-native-draggable-flatlist";

const addItens = [
  { label: "Create Folder", value: "folder" },
  { label: "Create Request", value: "request" },
];

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const {
    workpaces,
    removeFolder,
    removeRequest,
    pinRequest,
    duplicateRequest,
  } = useRestStore();
  const [sort, setSort] = useState("");
  const currentWorkspace = workpaces.find((workspace) => workspace.id === id);
  const [openRequest, setOpenRequest] = useState(undefined);
  const [openFolder, setOpenFolder] = useState(undefined);
  const [filter, setFilter] = useState("");
  const filterFolders = useMemo(() => {
    let sortedItens = currentWorkspace?.items ?? [];
    if (sort === "name-asc") {
      sortedItens = sortedItens.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === "name-desc") {
      sortedItens = sortedItens.sort((a, b) => b.name.localeCompare(a.name));
    }
    if (sort === "date-asc") {
      sortedItens = sortedItens.sort((a, b) =>
        a.createdAt.localeCompare(b.createdAt)
      );
    }
    if (sort === "date-desc") {
      sortedItens = sortedItens.sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
      );
    }
    if (!filter) return sortedItens;
    return sortedItens.filter((workspace) => workspace.name.includes(filter));
  }, [currentWorkspace?.items, filter, sort]);
  return (
    <View className="bg-black flex-1">
      <View className="flex-1 h-full w-full bg-black">
        <View className="w-full flex-row align-middle justify-center">
          <Input
            placeholder="Search"
            onChangeText={(text) => setFilter(text)}
            className="m-2 border rounded-md placeholder:italic placeholder:text-slate-400 border-gray-300 text-gray-300 w-10/12"
          />
          <DropdownMenuListSelect
            defaultValue={sort}
            valuesList={sortList}
            onSelect={(e) => setSort(e)}
          >
            <ArrowUpDown color={"#fff"} className="h-4 w-4" />
          </DropdownMenuListSelect>
          <DropdownMenuListSelect
            defaultValue={sort}
            valuesList={addItens}
            onSelect={(e) => {
              console.log("item", e);
              if (e === "folder") {
                setOpenFolder(true);
              } else {
                setOpenRequest(true);
              }
            }}
          >
            <Plus color={"#fff"} className="h-4 w-4" />
          </DropdownMenuListSelect>
        </View>
        <ModalDialogRequest
          setOpenDialog={setOpenRequest}
          openDialog={openRequest}
          workspaceId={id}
        />
        <ModalDialogFolder
          setOpenDialog={setOpenFolder}
          openDialog={openFolder}
          id={id}
        />

        <AnimatePresence>
          {filterFolders.map((item, index) => (
            <MotiView
              key={item.id}
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "timing", duration: 500 + index * 100 }}
              className="w-full"
            >
              <FlatItem
                workSpaceId={id}
                duplicateRequest={duplicateRequest}
                setOpenRequest={setOpenRequest}
                setOpenFolder={setOpenFolder}
                removeFolder={removeFolder}
                removeRequest={removeRequest}
                item={item}
                pinRequest={pinRequest}
              />
            </MotiView>
          ))}

          {/* <DraggableFlatList
            data={filterFolders}
            onDragEnd={({ data }) => console.log(data)}
            keyExtractor={(item) => item.id}
            renderItem={({ item, drag, isActive }) => (
              <TouchableOpacity
          style={{
            height: 100,
            // backgroundColor: isActive ? "red" : item.backgroundColor,
            alignItems: "center",
            justifyContent: "center",
          }}
          onLongPress={drag}
        >
             
              </TouchableOpacity>
            )}
          /> */}
        </AnimatePresence>
      </View>
    </View>
  );
}
