import { FormInput } from "@/components/input";
import { TouchableOpacity, View, Text } from "react-native";
import { Button } from "@/components/ui/button";
import { useController } from "react-hook-form";

interface BodyFormProps {
  bodyFields: any[];
  errors: any;
  control: any;
  removeField: (index: any) => void;
  addField: () => void;
}

export function BodyForm({
  // addField,
  // bodyFields,
  errors,
  control,
  // removeField,
}: BodyFormProps): JSX.Element {
  const { field } = useController({
    name: "body",
    control,
  })
  console.log({field})
   const bodyFields = field.value; 

  const addField = () => {
    console.log('add field');
    
    field.onChange("body", [...bodyFields, { key: "", value: "" }]);
  };

  const removeField = (index) => {
    const updatedFields = bodyFields.filter((_, idx) => idx !== index);
    field.onChange("body", updatedFields);
  };

  return (
    <View className="p-4">
      <Text className="text-white">Body Fields:</Text>
      {bodyFields?.map((field, index) => (
        <View key={index} className="flex flex-row items-center gap-2 mb-2">
          <FormInput
            errors={errors}
            className="flex-1 border rounded-md placeholder:italic placeholder:text-slate-400 border-gray-300 text-gray-300"
            control={control}
            name={`body[${index}].value`}
          />
          <FormInput
            errors={errors}
            className="flex-1 border rounded-md placeholder:italic placeholder:text-slate-400 border-gray-300 text-gray-300"
            control={control}
            name={`body[${index}].key`}
          />

          <TouchableOpacity onPress={() => removeField(index)}>
            <Text className="text-red-500">Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Button onPress={() => {
        console.log('test 123');
        
        addField()
      }} className="bg-blue-500">
        <Text>Add Field</Text>
      </Button>
    </View>
  );
}
