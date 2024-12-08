import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useController } from "react-hook-form";

interface DropdownMenuListProps {
  title?: string;
  valuesList: {
    label: string;
    value: string;
    color: string;
  }[]
  defaultValue: string;
  name: string
  control: any
  
}

export function DropdownMenuList({title, valuesList, defaultValue, name, control}: DropdownMenuListProps) {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const { field } = useController({
    name,
    control,
  });

  return (
    <Select value={field.value} onValueChange={value => field.onChange(value)} defaultValue={valuesList.find((items) => items.value === defaultValue)}>
      <SelectTrigger className="w-[100px] border border-gray-600 bg-black m-2">
        <SelectValue
          className="text-foreground text-sm native:text-lg text-white"
          placeholder="Select a fruit"
        />
      </SelectTrigger>
      <SelectContent insets={contentInsets} className="w-[100px] text-white">
        <SelectGroup className={`text-white bg-black `}>
          {title && <SelectLabel>{title}</SelectLabel>}
          {valuesList.map((item) => (
            <SelectItem
              key={item.value}
              label={item.label}
              className={`bg-[${item.color}] text-white`}
              value={item.value}
              classNameText="text-white"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
