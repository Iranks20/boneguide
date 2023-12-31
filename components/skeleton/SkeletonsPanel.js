import React from "react";
import Skeleton from "./Skeleton";
import { View } from "react-native";

const SkeletonsPanel = ({ nodes, currentProject }) => {
  const age = currentProject?.title?.toLowerCase().includes("adult")
    ? "adult"
    : "paediatrics";

  return (
    <View
      style={
        age == "paediatrics"
          ? {
              marginBottom: 30,
            }
          : {}
      }
    >
      <Skeleton nodes={nodes} age={age} />
    </View>
  );
};

export default SkeletonsPanel;
