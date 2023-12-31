import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import RemixIcon from "react-native-remix-icon";

const BackBtn = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  if (navigation && navigation.canGoBack()) {
    return (
      <View style={{ marginBottom: 10, marginRight: 15, }}>
        <TouchableOpacity
          style={{
            justifyContent: "flex-start",
            borderWidth: 0,
            paddingHorizontal: 0,
          }}
          onPress={navigation.goBack}
        >
          <RemixIcon name="arrow-left-line" color="#475467" size={27} />
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

export default BackBtn;
