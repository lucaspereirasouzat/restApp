import { useRestStore } from "@/store/useRestStore";
import { Link, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { ModalDialogFolder } from "./components/folder";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const { workpaces } = useRestStore();

  const currentWorkspace = workpaces.find((workspace) => workspace.id === id);
  const [filter, setFilter] = useState("");
  const filterFolders = useMemo(() => {
    if (!filter) return currentWorkspace?.folders;
    return currentWorkspace?.folders.filter((workspace) =>
      workspace.name.includes(filter)
    );
  }, [currentWorkspace?.folders, filter]);
  return (
    <View className="mt-20 flex-1 h-full w-full bg-black">
      {/* <Text>Details of user {JSON.stringify(currentWorkspace)} </Text> */}
      <Input
        placeholder="Search"
        onChangeText={(text) => setFilter(text)}
        className="m-2 border rounded-md placeholder:italic placeholder:text-slate-400 border-gray-300 text-gray-300"
      />
      <ModalDialogFolder id={id} />
      <FlatList
        className="flex-1 h-full"
        data={filterFolders}
        renderItem={({ item }) => <FlatItem item={item} />}
      />
    </View>
  );
}

function FlatItem({item}) {
  return (
    <View>
      <Link
        href={`/(tabs)/request/${item.id}/${item.id}`}
        className="bg-[#171717]
                h-20 border rounded-md border-gray-600 justify-center items-center m-1
                "
      >
        <Text className="text-white">{item.name}</Text>
      </Link>
    </View>
  );
  
}