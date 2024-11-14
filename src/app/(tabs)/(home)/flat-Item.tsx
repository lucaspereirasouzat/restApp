import { Card } from "@/components/ui/card";
import { Link } from "expo-router";
import { MoreHorizontal, File } from "lucide-react-native";
import { View, Text } from "react-native";
import { DropdownMenuListSelect } from "../request/[folder]/[id]/components/dropdonw-without-form";
import { customHumanize } from "./humanize-time";

interface FlatItemProps {
  item: any;
  removeItem: (id: string) => void;
}

const listValues = [{
            label: 'Edit',
            value: 'edit',
            color: 'red',
          }, {
            label: 'Delete',
            value: 'delete',
            color: 'blue',
          }]

export function FlatItem({ item, removeItem }: FlatItemProps) {
  return (
    <Card className="w-full bg-zinc-950 text-white p-2 mt-1 mb-1 border rounded-md border-gray-600">
      <View className="w-full flex flex-row items-start justify-between">
        <Link
          href={`/(tabs)/details/${item.id}`}
          className="w-full justify-center items-center m-1 p-2"
        >
          <View className="flex items-start gap-3 flex-row">
            <View className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center text-xs font-medium">
            <File color={'#fff'} className="h-4 w-4 " />
            </View>
            <View className="space-y-1">
              <Text className="font-medium text-xl leading-none text-white">{item.name}</Text>
             <View className="flex flex-row items-center gap-2">
              {/* <TimerIcon color={'#fff'} className="h-0.5 w-0.5" /> */}
              <Text className="text-sm text-zinc-400">{customHumanize(new Date(item.updatedAt ?? item.createdAt))}</Text>
              </View>
            </View>
          </View>
        </Link>
        <View className="absolute right-0 top-0">
          <DropdownMenuListSelect defaultValue="" valuesList={listValues} onSelect={e => {
            if (e === 'delete') {
              removeItem(item.id);
            }
          }} >
          <MoreHorizontal color={'#fff'} className="h-4 w-4" />
          </DropdownMenuListSelect>
        </View>
      </View>
    </Card>
  );
}
