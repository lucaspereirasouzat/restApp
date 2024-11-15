import { View, SafeAreaView, FlatList } from "react-native";
import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRestStore } from "../../../store/useRestStore";
import { ModalDialog } from "./components/dialog";
import { FlatItem } from "./flat-Item";
import { DropdownMenuListSelect } from "../../../components/dropdonw-without-form";
import { ArrowUpDown } from "lucide-react-native";
import { sortList } from "@/constants/sort-list";

export default function HomeScreen() {
  const { workpaces, removeWorkSpace } = useRestStore();
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const filterWorkspaces = useMemo(() => {
    let sortedItens = workpaces;
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
  }, [workpaces, filter,sort]);
  return (
    <SafeAreaView className="bg-black">
      <View className="mt-16 mr-2 ml-2">
        <View className="h-full w-full">
          <View className="w-full flex-row align-middle justify-center">
            <Input
              placeholder="Search"
              onChangeText={(text) => setFilter(text)}
              className="m-2 border rounded-md placeholder:italic placeholder:text-slate-400 border-gray-300 text-gray-300 w-11/12"
            />
            <DropdownMenuListSelect
              defaultValue={sort}
              valuesList={sortList}
              onSelect={(e) => {
                setSort(e);
              }}
            >
              <ArrowUpDown color={"#fff"} className="h-4 w-4" />
            </DropdownMenuListSelect>
          </View>
          <View className="w-full h-5"></View>
          <ModalDialog />
          <FlatList
            className="flex-1 h-full w-full "
            data={filterWorkspaces}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FlatItem removeItem={(id) => removeWorkSpace(id)} item={item} />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
