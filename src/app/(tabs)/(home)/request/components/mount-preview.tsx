import { getStatusCodeColor } from "@/utils/getStatusCodeColor";
import { View, Text } from "react-native";
import SyntaxHighlighter from "react-native-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

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

  return (
    <View className="flex-1 w-full">
      <View className="h-14 bg-neutral-900 align-middle justify-center p-2">
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
      </View>
      <SyntaxHighlighter language="json" style={dracula}>
        {JSON.stringify(data.result, null, 2)}
      </SyntaxHighlighter>
    </View>
  );
}
