import { Collapsible } from "@/components/Collapsible";
import { Link } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Plus, Folder, FolderOpen} from 'lucide-react-native'

interface FlatItemProps {
  item: {
    id: string
    name: string
  };
}

export function FlatItem({ item }:FlatItemProps) {
  console.log({ item });
  return (
    <View>
      <Collapsible
        header={({ isOpen, setIsOpen }) => (
          <>
            <View className="bg-black w-full flex flex-row border border-gray-500 p-4 ">
              <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
                <View className="w-[95%] flex-row ">
                {/* <View className="flex-row"> */}
                  {
                    isOpen ? <FolderOpen color={"#fff"} className="w-4 h-4" /> : <Folder color={"#fff"} className="w-4 h-4" />
                  }
                <Text className="text-white text-xl">{" "}{item.name}</Text>
                {/* </View> */}
                {/* <Ionicons
                  name={isOpen ? "chevron-down" : "chevron-forward-outline"}
                  size={18}
                  color={"#fff"}
                /> */}
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log('clicked')} className="flex-row gap-2">
                <Plus color={"#fff"} className="w-4 h-4" />
              </TouchableOpacity>
            </View>
          </>
        )}
        title={item.name}
      ></Collapsible>
      {/* <Link
        href={`/(tabs)/request/${item.id}/${item.id}`}
        className="bg-[#171717]
                h-20 border rounded-md border-gray-600 justify-center items-center m-1
                "
      >
        <Text className="text-white">{item.name}</Text>
      </Link> */}
    </View>
  );
}
