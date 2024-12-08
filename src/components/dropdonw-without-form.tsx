import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { useState } from "react";
import { AnimatePresence, MotiView } from "moti";

interface DropdownMenuListProps {
  title?: string;
  valuesList: {
    label: string;
    value: string;
    color: string;
  }[];
  defaultValue: string;
  onSelect: (value: string | undefined) => void;
  children: React.ReactNode;
}

export function DropdownMenuListSelect({
  title,
  valuesList,
  defaultValue,
  children,
  onSelect,

}: DropdownMenuListProps) {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const [selectedValue, setSelectedValue] = useState(
    valuesList.find((item) => item.value === defaultValue)?.value ||
      defaultValue
  );

  return (
    <Select
      value={selectedValue}
      onValueChange={(value) => onSelect(value?.value)}
    >
      <SelectTrigger className="border-0 border-gray-600 p-1 m-0 flex-col  mt-2">
        {children}
      </SelectTrigger>
      <AnimatePresence>
        <SelectContent
          insets={contentInsets}
          className="w-[100px] bg-black text-white"
        >
          <SelectGroup className="text-white mt-2">
            {title && <SelectLabel>{title}</SelectLabel>}
            {valuesList.map((item, index) => (
              <MotiView
                key={item.id}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "timing", duration: 500 + index * 100 }}
                className="w-full"
              >
                <SelectItem
                  classNameText="text-white"
                  key={item.value}
                  label={item.label}
                  className={` text-white`}
                  value={item.value}
                >
                  {item.label}
                </SelectItem>
              </MotiView>
            ))}
          </SelectGroup>
        </SelectContent>
      </AnimatePresence>
    </Select>
  );
}
