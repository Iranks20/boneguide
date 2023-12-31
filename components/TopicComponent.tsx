import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import AppText from "./AppText";
import NodeElement from "../models/NodeElement";

interface TopicComponentProps {
  nodeElement: any;
  color: any;
}

const TopicComponent = ({ nodeElement, color }: TopicComponentProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate("NodeScreen", { nodeId: nodeElement.id })
      }
    >
      {/* image */}
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 100,
          backgroundColor: color,
          marginTop: 8
        }}
      />

      {/* content */}
      <View>
        <AppText style={styles.name}>{nodeElement.title}</AppText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  name: {
    color: "#344054",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 10,
    marginRight: 50,
  },
  categoryContainer: {
    marginVertical: 10,
  },
});

export default TopicComponent;
