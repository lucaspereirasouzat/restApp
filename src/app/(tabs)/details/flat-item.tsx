import { Collapsible } from "@/components/Collapsible";
import { View, Text, TouchableOpacity } from "react-native";
import { Plus, Folder, FolderOpen, ArrowUpDown } from "lucide-react-native";
import { DropdownMenuListSelect } from "@/components/dropdonw-without-form";

interface FlatItemProps {
  item: {
    id: string;
    name: string;
    color?: string;
  };
}

const itensToSelect = [
  { label: "Create Request", value: "create-request", color: "#fff" },
  { label: "New Folder", value: "new-folder", color: "#fff" },
  { label: "Duplicate Folder", value: "duplicate-folder", color: "#fff" },
  { label: "Rename Folder", value: "rename-folder", color: "#fff" },
  { label: "Delete Folder", value: "delete-folder", color: "#fff" },
];

export function FlatItem({ item }: FlatItemProps) {
  if (!item.color) {
    console.log(item);
    return (
      <View className="flex-row w-full justify-between">
        <View className="flex-row text-center align-middle justify-center">
          <Text className="text-white text-xl bg-green-500">{item.method}</Text>
          <Text className="text-white">{item.name}</Text>
        </View>
        <DropdownMenuListSelect
          defaultValue={"create-request"}
          valuesList={itensToSelect}
          onSelect={(e) => {
            console.log(e);
          }}
        >
          <Plus color={"#fff"} className="w-4 h-4" />
        </DropdownMenuListSelect>
      </View>
    );
  }
  return (
    <View>
      <Collapsible
        header={({ isOpen, setIsOpen }) => (
          <>
            <View className="bg-black w-full flex flex-row border border-gray-500 p-4 justify-between ">
              <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
                <View className="w-[95%] flex-row ">
                  {isOpen ? (
                    <FolderOpen
                      color={item.color ? item.color : "#fff"}
                      className="w-4 h-4"
                    />
                  ) : (
                    <Folder
                      color={item.color ? item.color : "#fff"}
                      className="w-4 h-4"
                    />
                  )}
                  <Text className="text-white text-xl"> {item.name}</Text>
                </View>
              </TouchableOpacity>
              <DropdownMenuListSelect
                defaultValue={"create-request"}
                valuesList={itensToSelect}
                onSelect={(e) => {
                  console.log(e);
                }}
              >
                <Plus color={"#fff"} className="w-4 h-4" />
              </DropdownMenuListSelect>
              {/* <TouchableOpacity onPress={() => console.log('clicked',item)} className="flex-row gap-2">
                <Plus color={"#fff"} className="w-4 h-4" />
              </TouchableOpacity> */}
            </View>
          </>
        )}
        title={item.name}
      ></Collapsible>
    </View>
  );
}
