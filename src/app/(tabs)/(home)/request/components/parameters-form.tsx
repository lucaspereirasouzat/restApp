import { FormInput } from "@/components/input";
import { TouchableOpacity, View, Text } from "react-native";
import { Button } from "@/components/ui/button";
import { useController } from "react-hook-form";
import { ScrollView } from "react-native";
import { Trash } from "lucide-react-native";
import { AnimatePresence, MotiView } from "moti";
import { FormCheckBox } from "@/components/check-box";

interface BodyFormProps {
  control: any;
}

export function ParametersForm({ control }: BodyFormProps): JSX.Element {
  const { field, formState: {errors} } = useController({
    name: "params",
    control,
  });
  const { field: fieldType } = useController({
    name: "body-type",
    control,
  });
 
  const addField = () => {
    field.onChange([
      ...field?.value,
      { key: "", value: "", id: Date.now(), enabled: true },
    ]);
  };

  const removeField = (id) => {
    const updatedFields = field?.value?.filter((item) => item.id !== id);
    field.onChange(updatedFields);
  };

  return (
    <View className="w-full h-full justify-between pb-9">
      <ScrollView className="h-40">
        <AnimatePresence>
          {field?.value.map((item, index) => (
            <MotiView
              key={item.id}
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "timing", duration: 500 + index * 100 }}
              className="w-full"
            >
              <View
                key={item.id}
                className="flex flex-row items-center gap-2 mb-2"
              >
                <FormCheckBox
                  className="bg-black border border-gray-300"
                  name={`body[${index}].enabled`}
                  control={control}
                  errors={errors}
                />
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
              
                {/* <Checkbox checked /> */}
                <TouchableOpacity onPress={() => removeField(item.id)}>
                  <Trash color={"red"} className="w-6 h-6 text-red-500" />
                </TouchableOpacity>
              </View>
            </MotiView>
          ))}
        </AnimatePresence>
      </ScrollView>
      {/* <FlatList
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
      /> */}
      <Button onPress={addField} className="bg-blue-500 w-full">
        <Text>Add Field</Text>
      </Button>
    </View>
  );
}
