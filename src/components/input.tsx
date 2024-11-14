import { useController } from "react-hook-form";
import { Input } from "./ui/input";
import { Text } from "@/components/ui/text";

interface FormInputProps extends React.ComponentProps<typeof Input> {
  name: string;
  errors: any;
  control: any;
  className?: string;
}

export function FormInput({ name, errors, control, ...props }: FormInputProps) {
  const { field } = useController({
    name,
    control,
  });
  return (
    <>
      <Input
        value={field.value}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        editable={field.disabled}
        {...props}
      />
      {errors[field.name] && <Text className="text-red-500">{errors[field.name].message}</Text>}
    </>
  );
}
