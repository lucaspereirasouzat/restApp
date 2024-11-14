import { FormInput } from "@/components/input";
import { TouchableOpacity, View, Text, FlatList } from "react-native";
import { Button } from "@/components/ui/button";
import { useController } from "react-hook-form";
import { Trash } from "lucide-react-native";

interface BodyFormProps {
  errors: any;
  control: any;
}

export function ParametersForm({
  errors,
  control,
}: BodyFormProps): JSX.Element {
  const { field } = useController({
    name: "params",
    control,
  })

  const addField = () => {
    field.onChange([...field?.value, { key: "", value: "" }]);
  };

  const removeField = (index) => {
    const updatedFields = field?.value?.filter((_, idx) => idx !== index);
    field.onChange(updatedFields);
  };

  return (
    <View className="w-full h-full justify-between pb-9">
      <FlatList
        data={field?.value}
        className="h-40"
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View key={index} className="flex flex-row items-center gap-2 mb-2">
            <FormInput
              errors={errors}
              className="flex-1 border rounded-md placeholder:italic placeholder:text-slate-400 border-gray-300 text-gray-300"
              control={control}
               placeholder="Key"
              name={`body[${index}].key`}
            />
            <FormInput
              errors={errors}
              className="flex-1 border rounded-md placeholder:italic placeholder:text-slate-400 border-gray-300 text-gray-300"
              control={control}
              placeholder="Value"
              name={`body[${index}].value`}
            />
            <TouchableOpacity onPress={() => removeField(index)}>
              <Trash color={"red"} className="w-6 h-6 text-red-500" />
            </TouchableOpacity>
          </View>
        )}
      />
      <Button onPress={addField} className="bg-blue-500 w-full">
        <Text>Add Field</Text>
      </Button>
    </View>
  );
}
