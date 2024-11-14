import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, FlatList, View } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useHistoryStore } from '@/store/useHistoryStore';

import SyntaxHighlighter from "react-native-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function TabTwoScreen() {
    const {history} = useHistoryStore()

  return (
    <View className='flex-1'>
    <FlatList
      data={history}
      // keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Collapsible title={item.name}>
          <ThemedText>{item.description}</ThemedText>
          {/* <ExternalLink url={item.url} /> */}
          <ThemedText>Method: {item.method}</ThemedText>
          <ThemedText>Headers:</ThemedText>
          <SyntaxHighlighter language="json" style={dracula}>
            {JSON.stringify(item.request, null, 2)}
          </SyntaxHighlighter>
          <ThemedText>Body:</ThemedText>
          <SyntaxHighlighter language="json" style={dracula}>
            {JSON.stringify(item.response, null, 2)}
          </SyntaxHighlighter>
        </Collapsible>
      )}
    />
    </View>
  );
}
