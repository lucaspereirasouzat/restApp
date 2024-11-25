import * as React from "react";
import { View } from "react-native";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

interface TabsScreenProps {
  tabs: Tab[];
  setTab: (tab: string) => void;
  activeTab: string;
  tabsClassName?: string;
  tabClassName?: string;
  contentClass?: string;
}

interface Tab {
  title: string | JSX.Element;
  value: string;
  content: JSX.Element;
}

export default function TabsScreen({
  tabs,
  activeTab,
  setTab,
  tabClassName,
  contentClass,
  tabsClassName
}: TabsScreenProps) {
  return (
    <View className="flex-1 w-full h-full justify-center p-6">
      <Tabs
        value={activeTab}
        onValueChange={setTab}
        className={cn("w-full h-full mx-auto flex-col gap-1.5",tabsClassName)}
      >
        <TabsList className="flex flex-row w-full gap-1">
        {tabs.map(({value,title}) => (
          <TabsTrigger disabled={value === activeTab} onPress={() => setTab(value)} className={cn('bg-green-400 w-full h-full gap-1',tabClassName)} value={value} key={value} >
            {typeof title === "string" ? <View className={cn(" p-2 h-10 items-center w-full border rounded-md", value === activeTab ? 'bg-blue-800' : 'bg-[#272727]')}> <Label className={cn("text-white w-full ")}>{title}</Label> </View> : title}
          </TabsTrigger>
        ))}
        </TabsList>
        {tabs.map(({value, content}) => (
          <TabsContent className={cn("h-full w-full", contentClass)} value={value} key={value}>
            {content}
          </TabsContent>
        ))}
      </Tabs>
    </View>
  );
}
