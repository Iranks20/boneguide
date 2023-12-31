import React from "react";
import { View, ActivityIndicator } from "react-native";
import {colors} from "../utils/colors";

const Loading = () => {
  return (
    <View>
      <ActivityIndicator size="large" color={colors.MAIN} />
    </View>
  );
};

export default Loading;
