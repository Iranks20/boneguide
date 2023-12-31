import React from "react";
import { View } from "react-native";
import AppButton from "./AppButton";

const ShareApp = () => {


  const handleShareApp = () => {};

  const handleSuggestFeature = () => {};

  return (
    <View>
      <AppButton
        onPress={handleShareApp}
        style={{
          marginBottom: 15,
        }}
        text="Share The App"
      />

      <AppButton
        onPress={handleSuggestFeature}
        theme="light"
        text="Suggest A Feature"
      />
    </View>
  );
};

export default ShareApp;