import * as React from "react";
import { View } from "react-native";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

interface TabsScreenProps {
  tabs: Tab[];
  setTab: (tab: string) => void;
  activeTab: string;
  tabClassName?: string;
  contentClass?: string;
}

interface Tab {
  title: string;
  value: string;
  content: JSX.Element;
}

export default function TabsScreen({
  tabs,
  activeTab,
  setTab,
  tabClassName
}: TabsScreenProps) {
  return (
    <View className="flex-1 h-full justify-center p-6">
      <Tabs
        value={activeTab}
        onValueChange={setTab}
        className={cn("w-full max-w-[400px] h-full mx-auto flex-col gap-1.5")}
      >
        <TabsList className="flex flex-row w-full gap-1">
        {tabs.map(({value,title}) => (
          <TabsTrigger onPress={() => setTab(value)} className={cn('h-full gap-1',tabClassName)} value={value} key={value}>
            <Label className="text-white">{title}</Label>
          </TabsTrigger>
        ))}
        </TabsList>
        {tabs.map(({value, content}) => (
          <TabsContent className="h-full w-full" value={value} key={value}>
            {content}
          </TabsContent>
        ))}
      </Tabs>
    </View>
  );
}
