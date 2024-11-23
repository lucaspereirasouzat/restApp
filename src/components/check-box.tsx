import { useController } from "react-hook-form";
import { Input } from "./ui/input";
import { Text } from "@/components/ui/text";
import { Checkbox } from "./ui/checkbox";

interface FormInputProps extends React.ComponentProps<typeof Input> {
  name: string;
  errors: any;
  control: any;
  className?: string;
}

export function FormCheckBox({ name, errors, control, ...props }: FormInputProps) {
  const { field } = useController({
    name,
    control,
  });
  
  return (
    <>
    <Checkbox {...props} checked={Boolean(field.value)} onCheckedChange={e => {
      field.onChange(e)
    }} />
     
      {errors[field.name] && <Text className="text-red-500">{errors[field.name].message}</Text>}
    </>
  );
}
