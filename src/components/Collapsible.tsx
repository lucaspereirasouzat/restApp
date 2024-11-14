import Ionicons from "@expo/vector-icons/Ionicons";
import { PropsWithChildren, ReactNode, useState } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

export function Collapsible({
  children,
  title,
  header,
}: PropsWithChildren & {
  title: string;
  header?: ({
    isOpen,
    setIsOpen
  }: {isOpen: boolean, setIsOpen: (isOpen: boolean) => void}) => ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? "light";

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        {header ? (
          header({
            isOpen,
            setIsOpen
          })
        ) : (
          <>
            <Ionicons
              name={isOpen ? "chevron-down" : "chevron-forward-outline"}
              size={18}
              color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
            />
            <ThemedText type="defaultSemiBold">{title}</ThemedText>
          </>
        )}
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  content: {
    backgroundColor: '#000',
    marginTop: 6,
    marginLeft: 24,
  },
});
