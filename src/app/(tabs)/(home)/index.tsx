import { View, SafeAreaView, FlatList } from "react-native";
import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRestStore } from "../../../store/useRestStore";
import { ModalDialog } from "./components/dialog";
import { FlatItem } from "./flat-Item";
import { DropdownMenuListSelect } from "../../../components/dropdonw-without-form";
import { ArrowUpDown, Plus, X } from "lucide-react-native";
import { sortList } from "@/constants/sort-list";
import { AnimatePresence, View as MotiView } from "moti";

const ADD_LIST = [
  {
    label: "New WorkSpace",
    value: "create-workspace",
    color: "#fff",
  },
]

export default function HomeScreen() {
  const { workpaces, removeWorkSpace } = useRestStore();
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [id, setId] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const filterWorkspaces = useMemo(() => {
    let sortedItens = workpaces;
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
  }, [workpaces, filter, sort]);
  return (
    <SafeAreaView className="bg-black">
      <View className="mt-16 mr-2 ml-2">
        <View className="h-full w-full">
          <View className="w-full flex-row align-middle justify-center">
            <View className="w-11/12">
            <Input
              placeholder="Search"
              value={filter}
              onChangeText={(text) => setFilter(text)}
              className="m-2 border rounded-md placeholder:italic placeholder:text-slate-400 border-gray-300 text-gray-300 w-11/12"
            />
           {filter && <X onPress={() => setFilter('')} color="#fff" className="w-2 h-2 absolute top-5 right-10"/>}
            </View>
            <DropdownMenuListSelect
              defaultValue={sort}
              valuesList={sortList}
              onSelect={(e) => {
                setSort(e);
              }}
            >
              <ArrowUpDown color={"#fff"} className="h-4 w-4" />
            </DropdownMenuListSelect>
             <DropdownMenuListSelect
              defaultValue={sort}
              valuesList={ADD_LIST}
              onSelect={(e) => {
                if(e === 'create-workspace') {
                  setOpen(true)
                }
              }}
            >
              <Plus color={"#fff"} className="h-4 w-4" />
            </DropdownMenuListSelect>
          </View>
          <View className="w-full h-5"></View>
          <ModalDialog isOpenModal={open} id={id} clear={() => {
            setOpen(false)
            setId(undefined)
          }} />
          <AnimatePresence>
            {filterWorkspaces.map((item) => (
              <MotiView
                key={item.id}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "timing", duration: 300 }}
                className="w-full"
              >
                <FlatItem
                  updateItem={(id) => { setOpen(true); setId(id)}}
                  removeItem={(id) => removeWorkSpace(id)}
                  item={item}
                />
              </MotiView>
            ))}
          </AnimatePresence>
          {/* <FlatList
            className="flex-1 h-full w-full "
            data={filterWorkspaces}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FlatItem removeItem={(id) => removeWorkSpace(id)} item={item} />
            )}
          /> */}
        </View>
      </View>
    </SafeAreaView>
  );
}
