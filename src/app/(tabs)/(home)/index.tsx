import { View, Text, SafeAreaView, FlatList } from "react-native";
import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRestStore } from "../../../store/useRestStore";
import { Link } from "expo-router";
import { ModalDialog } from "./components/dialog";

export default function HomeScreen() {
  const { workpaces } = useRestStore();
  const [filter, setFilter] = useState("");
  const filterWorkspaces = useMemo(() => {
    if (!filter) return workpaces;
    return workpaces.filter((workspace) => workspace.name.includes(filter));
  }, [workpaces, filter]);
  return (
    <SafeAreaView className="bg-black">
      <View className="mt-16 mr-2 ml-2">
        <View className="h-full w-full">
          <Input
            placeholder="Search"
            onChangeText={(text) => setFilter(text)}
            className="m-2 border rounded-md placeholder:italic placeholder:text-slate-400 border-gray-300 text-gray-300"
          />
          <View className="w-full h-5"></View>
          <ModalDialog />
          <FlatList
            className="flex-1 h-full "
            data={filterWorkspaces}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FlatItem item={item} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function FlatItem({ item }) {
  return (
    <View>
      <Link
        href={`/(tabs)/details/${item.id}`}
        className="bg-[#171717]
                h-20 border rounded-md border-gray-600 justify-center items-center m-1
                "
      >
        <Text className="text-white">{item.name}</Text>
      </Link>
    </View>
  );
}
