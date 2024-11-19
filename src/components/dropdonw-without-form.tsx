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
  onSelect
}: DropdownMenuListProps) {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const [selectedValue, setSelectedValue] = useState(
    valuesList.find((item) => item.value === defaultValue)?.value || defaultValue
  );

  return (
    <Select
      value={selectedValue}
      onValueChange={(value) => onSelect(value?.value)}
    >
      <SelectTrigger className="border-0 border-gray-600 bg-yellow-400 p-1 m-0 flex-col ">
        {children}
      </SelectTrigger>
      <SelectContent
        insets={contentInsets}
        className="w-[100px] bg-black text-white"
      >
        <SelectGroup className="text-white">
          <SelectLabel>{title}</SelectLabel>
          {valuesList.map((item) => (
            <SelectItem
              classNameText="text-white"
              key={item.value}
              label={item.label}
              className={` text-white`}
              value={item.value}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
