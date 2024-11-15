import { useRestStore } from "@/store/useRestStore";
import { useLocalSearchParams } from "expo-router";
import { View, FlatList } from "react-native";
import { ModalDialogFolder } from "./components/folder";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ArrowUpDown } from "lucide-react-native";
import { DropdownMenuListSelect } from "../../../components/dropdonw-without-form";
import { sortList } from "@/constants/sort-list";
import { FlatItem } from "./flat-item";
import { ModalDialogRequest } from "./components/request";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const { workpaces } = useRestStore();
  const [sort, setSort] = useState("");
  const currentWorkspace = workpaces.find((workspace) => workspace.id === id);
  const [filter, setFilter] = useState("");
  const filterFolders = useMemo(() => {
    let sortedItens = currentWorkspace?.items ?? [];
    if(sort === "name-asc"){
      sortedItens = workpaces.sort((a,b) => a.name.localeCompare(b.name))
    }
    if(sort === "name-desc"){
      sortedItens = workpaces.sort((a,b) => b.name.localeCompare(a.name))
    }
    if(sort === "date-asc"){
      sortedItens = workpaces.sort((a,b) => a.createdAt.localeCompare(b.createdAt))
    }
    if(sort === "date-desc"){
      sortedItens = workpaces.sort((a,b) => b.createdAt.localeCompare(a.createdAt))
    }
    if (!filter) return sortedItens;
    return sortedItens.filter((workspace) => workspace.name.includes(filter));
  }, [currentWorkspace?.items, filter, sort]);
  return (
    <View className="bg-black flex-1">
      <View className="mt-20 flex-1 h-full w-full bg-black">
        <View className="w-full flex-row align-middle justify-center">
          <Input
            placeholder="Search"
            onChangeText={(text) => setFilter(text)}
            className="m-2 border rounded-md placeholder:italic placeholder:text-slate-400 border-gray-300 text-gray-300 w-11/12"
          />
          <DropdownMenuListSelect
            defaultValue={sort}
            valuesList={sortList}
            onSelect={(e) => setSort(e)}
          >
            <ArrowUpDown color={"#fff"} className="h-4 w-4" />
          </DropdownMenuListSelect>
        </View>
        <ModalDialogRequest workspaceId={id} />
        <ModalDialogFolder id={id} />
        <FlatList
          className="flex-1 h-full"
          data={filterFolders}
          renderItem={({ item }) => <FlatItem item={item} />}
        />
      </View>
    </View>
  );
}


