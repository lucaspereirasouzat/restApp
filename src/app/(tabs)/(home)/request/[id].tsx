import { useRestStore } from "@/store/useRestStore";
import { Link, useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useMemo, useState } from "react";
import { DropdownMenuList } from "./components/dropdonw";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { FormInput } from "@/components/input";
import { METHODS_LIST } from "@/constants/methods";
import { useMutation } from "@tanstack/react-query";
import SyntaxHighlighter from "react-native-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import axios from "axios";
import TabsScreen from "@/components/tabs";
import { BodyForm } from "./components/body-form";
import { HeadersForm } from "./components/headers-form";
import { ParametersForm } from "./components/parameters-form";
import { useHistoryStore } from "@/store/useHistoryStore";

export default function DetailsScreen() {
  const { id, folder } = useLocalSearchParams();
  const { workpaces, addRequestToFolder } = useRestStore();
  const {addToHistory} = useHistoryStore()
  const currentWorkspace = workpaces.find((workspace) => workspace.id === id);
  const [activeTab, setActiveTab] = useState("body");
  const { mutateAsync, data, isPending, error, isError } = useMutation({
    mutationKey: ["send-request"],
    mutationFn: async (data) => {
      const { method, url } = data;
      try {
        console.log({data})
        const response = await axios({
        method,
        url,
        // params: data?.params,
        // data: data?.body,
        // headers: data?.headers,
      });
      return response;
      } catch (error) {
        console.log('err',{error});
        
      }
     
    },
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    values: {
      // method: {
      // }
    },
    defaultValues: {
      url: "https://jsonplaceholder.typicode.com/todos/1",
      method: {
        value: "GET",
        label: "GET",
      },

      body: [],
      headers: [],
    },
  });

  const bodyFields = watch("body"); // Assiste os campos dinâmicos do body

  const addField = () => {
    setValue("body", [...bodyFields, { key: "", value: "" }]);
  };

  const removeField = (index) => {
    const updatedFields = bodyFields.filter((_, idx) => idx !== index);
    setValue("body", updatedFields);
  };

  async function onSubmit(data) {
    // addRequestToFolder(folder, data);
    // const body =
    //   data?.reduce((acc, field) => {
    //     acc[field.key] = field.value;
    //     return acc;
    //   }, {}) ?? {};

    const result = await mutateAsync({
      method: data.method.value,
      url: data.url,
      // body,
    });

    addToHistory({
      request: data,
      response: result.data,
    })
  }

  return (
    <View className="flex-1 bg-black">
    <View className="flex-1 h-full w-full bg-black">
      {/* <Text>Details of user {JSON.stringify(currentWorkspace)} </Text> */}
      <View className="flex flex-row w-full bg-black ">
        <DropdownMenuList
          control={control}
          errors={errors}
          name="method"
          title="Methods"
          valuesList={METHODS_LIST}
        />

        <FormInput
          placeholder="Url"
          className="m-2 border rounded-md placeholder:italic placeholder:text-slate-400 border-gray-300 text-gray-300 w-2/4"
          control={control}
          errors={errors}
          name="url"
        />
        <Button
          onPress={handleSubmit(onSubmit)}
          className="bg-yellow-300 m-2"
          variant="default"
        >
          <Text>SEND</Text>
        </Button>
      </View>

    <View className="flex-1">
      <TabsScreen
        activeTab={activeTab}
        setTab={setActiveTab}
        tabClassName="bg-black border border-1 border-gray-100 text-white w-1/3"
        tabs={[
          {
            value: "body",
            title: "Body",
            content: (
              <BodyForm 
                bodyFields={bodyFields}
                errors={errors}
                control={control}
                removeField={removeField}
                addField={addField}
              />
            ),
          },
          {
            value: "headers",
            title: "Headers",
            content: (
              <HeadersForm 
                bodyFields={bodyFields}
                errors={errors}
                control={control}
                removeField={removeField}
                addField={addField}
              />
            ),
          }, 
          {
            value: "params",
            title: "Params",
            content: (
              <ParametersForm 
                bodyFields={bodyFields}
                errors={errors}
                control={control}
                removeField={removeField}
                addField={addField}
              />
            ),
          }
        ]}
      />
      </View>

      <View className="flex flex-1 align-middle justify-center items-center h-full w-full">
        {isError && (
          <Text className="text-red-500">
            Erro: {error?.message || "Falha na requisição"}
          </Text>
        )}

        {isPending ? (
          <Text className="text-white">Carregando...</Text>
        ) : data ? (
          <SyntaxHighlighter language="json" style={dracula}>
            {JSON.stringify(data, null, 2)}
          </SyntaxHighlighter>
        ) : (
          <Text className="text-white">Nenhum dado disponível</Text>
        )}
      </View>
    </View>
    </View>
  );
}

