import { useRestStore } from "@/store/useRestStore";
import { Link, useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { DropdownMenuList } from "./components/dropdonw";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { FormInput } from "@/components/input";
import { METHODS_LIST } from "@/constants/methods";
import { useMutation } from "@tanstack/react-query";
import SyntaxHighlighter from "react-native-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import ky from "ky";
import TabsScreen from "@/components/tabs";
import { BodyForm } from "./components/body-form";
import { HeadersForm } from "./components/headers-form";
import { ParametersForm } from "./components/parameters-form";
import { useHistoryStore } from "@/store/useHistoryStore";
import { BODY_LIST } from "@/constants/body-options";
import { LoaderCircle } from "lucide-react-native";
import { MotiView } from "moti";

export default function DetailsScreen() {
  const { id, workspaceId } = useLocalSearchParams();

  const { workpaces, addRequestToFolder, addRequestToWorkSpace } =
    useRestStore();
  const { addToHistory } = useHistoryStore();
  const currentWorkspace = workpaces.find(
    (workspace) => workspace.id === workspaceId
  );
  const currentRequest = currentWorkspace?.items.find((item) => item.id === id);

  const [activeTab, setActiveTab] = useState("body");
  const { mutateAsync, data, isPending, error, isError } = useMutation({
    mutationKey: ["send-request"],
    mutationFn: async (data) => {
      const { method, url } = data;
      try {
        const body = undefined;
        if (data.method !== "GET") {
          data.body =
            data.body.reduce((acc, field) => {
              acc[field.key] = field.value;
              return acc;
            }, {}) ?? {};
        }
        const response = await ky(url, {
          method,
          headers: data?.headers,
          body,

        }).json();
        return response;
      } catch (error) {
        console.log("err", { error });
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
      name: currentRequest?.name,
      url: currentRequest?.url,
      method: {
        value: currentRequest?.method,
        label: currentRequest?.method,
      },
      body: currentRequest?.body ?? [],
      headers: currentRequest?.headers ?? [],
      ['body-type']: currentRequest?.headers?.find((header) => header.key === "Content-Type")?.value,
    },
    defaultValues: {
      name: "Teste",
      url: "https://jsonplaceholder.typicode.com/todos/1",
      method: {
        value: "GET",
        label: "GET",
      },
      ['body-type']: '',
      body: [],
      headers: [],
    },
  });

  useEffect(() => {
    if (workspaceId) {
      const fullBody = watch();
    
      if(
        fullBody.name !== currentRequest?.name || 
        fullBody.url !== currentRequest?.url || 
        JSON.stringify(fullBody.body) !== JSON.stringify(currentRequest?.body) ||
        JSON.stringify(fullBody.headers) !== JSON.stringify(currentRequest?.headers) ||
        fullBody.method.value !== currentRequest?.method
      ){
      
      addRequestToWorkSpace(workspaceId, {
        id,
        name: fullBody.name,
        url: fullBody.url,
        body: fullBody.body,
        headers: fullBody.headers,
        method: fullBody.method.value
      });
    }

    // console.log('body-type',fullBody["body-type"]);
    
    // console.log(JSON.stringify(fullBody.headers), fullBody.headers.find((header) => header.key === "Content-Type").value)
    
     const contentTypeIndex = fullBody.headers.findIndex(
          (header) => header.key === "Content-Type"
        );
      if (
        !fullBody["body-type"] || -1 === contentTypeIndex ||
        fullBody["body-type"] !==
        fullBody.headers[contentTypeIndex].value
      ) {
        if(contentTypeIndex !== -1){
       fullBody.headers[contentTypeIndex] = { key: "Content-Type", value: fullBody["body-type"], enabled: 'true' }
       } else {
        fullBody.headers.push({ key: "Content-Type", value: fullBody["body-type"], enabled: 'true' });
       }
       if(JSON.stringify(fullBody.headers) !== JSON.stringify(currentRequest?.headers)){
         setValue("headers", fullBody.headers);
       }
      }
    }
  }, [watch(), workspaceId,currentRequest]);


  async function onSubmit(data) {
    // addRequestToFolder(folder, data);
    const body =
      data.body?.reduce((acc, field) => {
        if(!field.enabled) return acc;
        acc[field.key] = field.value;
        return acc;
      }, {}) ?? {};
    const headers =
      data.headers?.reduce((acc, field) => {
        if(!field.enabled) return acc;
        acc[field.key] = field.value;
        return acc;
      }, {}) ?? {};

    const result = await mutateAsync({
      method: data.method.value,
      url: data.url,
      // body: data.body,
      headers,
      body,
    });

    addToHistory({
      request: data,
      response: result.data,
    });
  }

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 h-full w-full bg-black">
        <FormInput
            placeholder="Name"
            className="m-2 border rounded-md placeholder:italic placeholder:text-slate-400 border-gray-300 text-gray-300 w-3/4"
            control={control}
            errors={errors}
            name="name"
          />
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
            disabled={isPending}
            onPress={handleSubmit(onSubmit)}
            className="bg-yellow-300 m-2"
            variant="default"
          >
           {isPending ? 
            <ActivityIndicator color={'white'} className="w-2 h-2" /> : <Text>SEND</Text>} 
          </Button>
        </View>

        {/* BODY_LIST */}
        <View className="flex-1">
          <TabsScreen
            activeTab={activeTab}
            setTab={setActiveTab}
            tabClassName="bg-black border border-1 border-gray-100 text-white w-1/3"
            tabs={[
              {
                value: "body",
                title:
                  activeTab === "body" ? (
                    <View className="bg-blue-600">
                      <DropdownMenuList
                        control={control}
                        errors={errors}
                        name="body-type"
                        title="Methods"
                        valuesList={BODY_LIST}
                      />
                    </View>
                  ) : (
                    "Body"
                  ),
                content: (
                  <BodyForm
                    control={control}
                  />
                ),
              },
              {
                value: "headers",
                title: "Headers",
                content: (
                  <HeadersForm
                    control={control}
                  />
                ),
              },
              {
                value: "params",
                title: "Params",
                content: (
                  <ParametersForm
                    control={control}
                  />
                ),
              },
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
