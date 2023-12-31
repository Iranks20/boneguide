import React from "react";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import AppText from "./AppText";
import NodeElement from "../models/NodeElement";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import RemixIcon from "react-native-remix-icon";

interface MenuItemProps {
  nodeElement: NodeElement;
}

const MenuItem = ({ nodeElement }: MenuItemProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { id, title, image }: any = nodeElement;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push("NodeScreen", { nodeId: id });
      }}
      style={styles.container}
    >
      <View style={{ flexDirection: "row" }}>
        {image && (
          <Image
            source={{
              uri: image,
            }}
            style={styles.image}
          />
        )}

        <View style={{ padding: 15, flex: 0.9 }}>
          <AppText style={styles.name}>{title}</AppText>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <RemixIcon name="arrow-right-s-line" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EAECF0",
    marginVertical: 6,
  },
  image: {
    width: 80,
    height: 70,
  },
  name: {
    fontSize: 15,
    color: "#344054",
    fontWeight: "500",
  },
});

export default MenuItem;
