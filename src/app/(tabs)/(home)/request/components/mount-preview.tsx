import { getStatusCodeColor } from "@/utils/getStatusCodeColor";
import { View, Text } from "react-native";
import SyntaxHighlighter from "react-native-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {WebView} from "react-native-webview"

interface MountPreviewProps {
  data: any;
  isPending: boolean;
  error: any;
  isError: boolean;
}
export function MountPreview({ data, isPending, error, isError }: MountPreviewProps) {
  if (isPending) {
    return <Text>Carregando...</Text>;
  }

  if (isError) {
    return (
      <Text className="text-red-500">
        Erro: {error?.message || "Falha na requisição"}
      </Text>
    );
  }

  if (!data) {
    return <Text className="text-white">Nenhum dado disponível</Text>;
  }
  console.log(data);
  
  return (
    <View className="flex-1 w-full">
      {/* <View className="flex flex-row w-full bg-yellow-400"> */}
      <View className="flex-row bg-neutral-900 justify-start p-2 w-full">
        <View
          style={{
            backgroundColor: getStatusCodeColor(data.response.status),
          }}
          className="w-11 p-2"
        >
          <Text className="text-white ">
            <Text>{data.response.status} </Text>
          </Text>
        </View>
         <View
          
          className="w-15 h-10 p-2 bg-gray-500"
        >
          <Text className="text-white ">
            <Text>{data.time.toFixed(2)}ms </Text>
          </Text>
        </View>
      </View>
      {/* </View> */}
      {/* <WebView className="flex-1"  /> */}
      <SyntaxHighlighter language="json" style={dracula}>
        {JSON.stringify(data.result, null, 2)}
      </SyntaxHighlighter>
    </View>
  );
}
