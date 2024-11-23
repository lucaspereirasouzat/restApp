import { useRestStore } from "@/store/useRestStore";
import { useLocalSearchParams } from "expo-router";
import { View, FlatList, Text, ScrollView } from "react-native";
import { ModalDialogFolder } from "./components/folder";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Plus } from "lucide-react-native";
import { DropdownMenuListSelect } from "../../../../components/dropdonw-without-form";
import { sortList } from "@/constants/sort-list";
import { FlatItem } from "./components/flat-item";
import { ModalDialogRequest } from "./components/request";
import { AnimatePresence, MotiView } from "moti";
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
      sortedItens = workpaces.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === "name-desc") {
      sortedItens = workpaces.sort((a, b) => b.name.localeCompare(a.name));
    }
    if (sort === "date-asc") {
      sortedItens = workpaces.sort((a, b) =>
        a.createdAt.localeCompare(b.createdAt)
      );
    }
    if (sort === "date-desc") {
      sortedItens = workpaces.sort((a, b) =>
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
            valuesList={sortList}
            onSelect={(e) => setSort(e)}
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
          <ScrollView>
          {
            filterFolders.map((item, index) => <MotiView
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
              )
          }
          </ScrollView>
          {/* <FlatList
            ItemSeparatorComponent={() => (
              <View className="h-0.5 bg-slate-500" />
            )}
            className="flex-1 h-full"
            data={filterFolders}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <MotiView
                key={item.id}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "timing", duration: 300 }}
                className="w-full"
                // style={styles.item}
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
            )}
          /> */}
        </AnimatePresence>
      </View>
    </View>
  );
}
